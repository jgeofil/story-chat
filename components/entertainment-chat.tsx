"use client";

import React, { useState, useMemo } from "react";
import {
  Chat,
  ChannelList,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageComposer,
  Thread,
  useCreateChatClient,
  useChatContext,
} from "stream-chat-react";
import type { ChannelFilters, ChannelSort } from "stream-chat";
import { useTheme } from "next-themes";
import { EntertainmentHeader } from "@/components/entertainment-header";
import { EntertainmentStage } from "@/components/entertainment-stage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Tv,
  MessageSquare,
  LayoutTemplate,
  ChevronLeft,
  ChevronRight,
  Radio,
  Flame,
  Clapperboard,
  Sparkles,
  Users,
} from "lucide-react";
import "@/components/stream-chat.css";

interface EntertainmentChatProps {
  apiKey: string;
  chatToken: string;
  userId: string;
  userName: string;
  onSwitchUser: () => void;
}

// Inner helper component to access ChatContext and display active channel details
function ActiveChannelSynchronizer({
  onChannelChange,
}: {
  onChannelChange: (name: string, id: string) => void;
}) {
  const { channel } = useChatContext();

  React.useEffect(() => {
    if (channel) {
      const name =
        (channel.data?.name as string) || channel.id || "Live Stage Broadcast";
      if (channel.id) {
        onChannelChange(name, channel.id);
      }
    }
  }, [channel, onChannelChange]);

  return null;
}

export function EntertainmentChat({
  apiKey,
  chatToken,
  userId,
  userName,
  onSwitchUser,
}: EntertainmentChatProps) {
  const { resolvedTheme } = useTheme();
  const [activeChannelName, setActiveChannelName] = useState<string>(
    "🎬 Cinema Premiere: Cyber Neon 2099"
  );
  const [activeChannelId, setActiveChannelId] = useState<string>("movie-premiere");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<"split" | "theater" | "chat">("split");

  // Strict mode safe chat client hook from SDK v14
  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: chatToken,
    userData: {
      id: userId,
      name: userName || userId,
      image: `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
    },
  });

  // Channel filters: fetch entertainment livestream & messaging channels
  const filters: ChannelFilters = useMemo(
    () => ({
      type: { $in: ["livestream", "messaging"] },
    }),
    []
  );

  const sort: ChannelSort = useMemo(() => ({ last_message_at: -1 }), []);

  const themeClass =
    resolvedTheme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light";

  if (!chatClient) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-6 text-center select-none">
        <div className="relative mb-4">
          <div className="h-16 w-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center animate-pulse">
            <Tv className="h-8 w-8 text-purple-400" />
          </div>
          <Loader2 className="h-6 w-6 text-purple-400 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Connecting to Stream Live...
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Synchronizing channels, stage feed, and live audience presence.
        </p>
      </div>
    );
  }

  // Handle quick reaction sent from stage to chat channel
  const handleStageReaction = (emoji: string) => {
    if (!chatClient.activeChannels) return;
    const channel = chatClient.activeChannels[activeChannelId];
    if (channel) {
      channel
        .sendMessage({
          text: `${emoji} [Reaction Burst]`,
          custom: { isReactionBurst: true, emoji },
        })
        .catch((err) => console.error("Could not broadcast reaction:", err));
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* App Header (Rules: App Header sits above all product UI) */}
      <EntertainmentHeader
        userId={userId}
        userName={userName}
        activeChannelName={activeChannelName}
        onSwitchUser={onSwitchUser}
      />

      {/* Main Entertainment Workspace */}
      <div className="flex-1 flex min-h-0 relative">
        <Chat client={chatClient} theme={themeClass}>
          <ActiveChannelSynchronizer
            onChannelChange={(name, id) => {
              setActiveChannelName(name);
              setActiveChannelId(id);
            }}
          />

          {/* Left: Collapsible Channel Sidebar */}
          <aside
            className={`${
              sidebarOpen ? "w-72 md:w-80" : "w-0"
            } transition-all duration-200 border-r border-border/60 bg-card/60 backdrop-blur-md flex flex-col shrink-0 overflow-hidden relative z-20`}
          >
            {sidebarOpen && (
              <div className="flex flex-col h-full">
                {/* Channel List Header */}
                <div className="p-3 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Live Channels
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5 border-purple-500/30 text-purple-400">
                    5 Active
                  </Badge>
                </div>

                {/* Prebuilt ChannelList from Stream */}
                <div className="flex-1 overflow-y-auto">
                  <ChannelList
                    filters={filters}
                    sort={sort}
                    options={{ state: true, watch: true, presence: true }}
                    showChannelSearch
                    setActiveChannelOnMount
                  />
                </div>

                {/* Sidebar Footer info */}
                <div className="p-2.5 border-t border-border/40 bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    Stream US-East Live
                  </span>
                  <span className="font-mono text-[10px]">App 1163763</span>
                </div>
              </div>
            )}
          </aside>

          {/* Sidebar Toggle Handle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-10 w-4 rounded-r-md bg-muted/80 hover:bg-muted border-y border-r border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none transition-all shadow-md"
            style={{ left: sidebarOpen ? (typeof window !== "undefined" && window.innerWidth >= 768 ? "320px" : "288px") : "0px" }}
            title={sidebarOpen ? "Collapse Channels" : "Expand Channels"}
          >
            {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>

          {/* Right Area: Stage + Live Chat Layout */}
          <main className="flex-1 flex flex-col lg:flex-row min-w-0 h-full overflow-hidden relative">
            {/* View Mode Switcher Floating Bar */}
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-lg">
              <Button
                variant={viewMode === "split" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs text-white"
                onClick={() => setViewMode("split")}
                title="Split Stage & Chat"
              >
                <LayoutTemplate className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Split</span>
              </Button>
              <Button
                variant={viewMode === "theater" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs text-white"
                onClick={() => setViewMode("theater")}
                title="Theater Stage View"
              >
                <Tv className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Stage</span>
              </Button>
              <Button
                variant={viewMode === "chat" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs text-white"
                onClick={() => setViewMode("chat")}
                title="Chat Focused View"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Chat</span>
              </Button>
            </div>

            {/* Stage Column (hidden in 'chat' mode) */}
            {viewMode !== "chat" && (
              <div
                className={`${
                  viewMode === "theater"
                    ? "flex-1 w-full"
                    : "flex-1 lg:flex-[1.4] w-full min-h-[260px] lg:min-h-0"
                } flex flex-col h-full border-b lg:border-b-0 lg:border-r border-border/50 relative overflow-hidden transition-all`}
              >
                <EntertainmentStage
                  channelId={activeChannelId}
                  channelName={activeChannelName}
                  onSendReactionToChat={handleStageReaction}
                  isTheaterMode={viewMode === "theater"}
                  onToggleTheaterMode={() =>
                    setViewMode(viewMode === "theater" ? "split" : "theater")
                  }
                />
              </div>
            )}

            {/* Chat Column (hidden in 'theater' mode) */}
            {viewMode !== "theater" && (
              <div
                className={`${
                  viewMode === "chat"
                    ? "flex-1 w-full"
                    : "flex-1 lg:flex-1 w-full"
                } flex flex-col h-full min-w-0 bg-card/40 relative overflow-hidden transition-all`}
              >
                {/* Note: In Stream Chat React, when ChannelList is rendered as a sibling,
                    do NOT pass a channel prop to Channel so it uses the active channel */}
                <Channel>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageComposer />
                  </Window>
                  <Thread />
                </Channel>
              </div>
            )}
          </main>
        </Chat>
      </div>
    </div>
  );
}
