import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");

    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return NextResponse.json(
        { error: "Query parameter 'user_id' is required" },
        { status: 400 }
      );
    }

    const cleanUserId = userId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const userName = searchParams.get("name") || cleanUserId;

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Stream API credentials are not configured on the server" },
        { status: 500 }
      );
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    // Upsert the current requesting user only
    await serverClient.upsertUsers([
      {
        id: cleanUserId,
        name: userName,
        role: "user",
        image: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUserId}`,
      },
    ]);

    // Create development token
    const chatToken = serverClient.createToken(cleanUserId);

    // Ensure entertainment channels exist and user has access
    const channelsToEnsure = [
      {
        type: "livestream",
        id: "movie-premiere",
        name: "🎬 Cinema Premiere: Cyber Neon 2099",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
        description: "Official interactive watch party and red-carpet premiere.",
      },
      {
        type: "livestream",
        id: "esports-finals",
        name: "🎮 Apex Legends Pro League Finals",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
        description: "Grand Finals championship stream. High-speed hype chat.",
      },
      {
        type: "livestream",
        id: "live-concert",
        name: "🎵 Neon Waves Synthwave Live",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
        description: "Live festival broadcast from Stage 1.",
      },
      {
        type: "messaging",
        id: "backstage-vip",
        name: "🎙️ Backstage VIP Lounge & Q&A",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
        description: "Exclusive backstage discussions, artist meet-and-greets.",
      },
      {
        type: "messaging",
        id: "trivia-night",
        name: "🍿 Sci-Fi & Pop Culture Trivia",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
        description: "Live audience trivia, quiz questions, and polls.",
      },
    ];

    await Promise.all(
      channelsToEnsure.map(async (ch) => {
        try {
          const channel = serverClient.channel(ch.type, ch.id, {
            name: ch.name,
            image: ch.image,
            description: ch.description,
            created_by_id: cleanUserId,
          });
          await channel.create();
          if (ch.type === "messaging") {
            await channel.addMembers([cleanUserId]);
          }
        } catch (err) {
          console.warn(`Channel init note for ${ch.id}:`, err);
        }
      })
    );

    return NextResponse.json({
      apiKey,
      chatToken,
      userId: cleanUserId,
      name: userName,
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token", details: String(error) },
      { status: 500 }
    );
  }
}
