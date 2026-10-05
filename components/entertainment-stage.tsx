"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Flame,
  Heart,
  Rocket,
  Sparkles,
  Clapperboard,
  Gamepad2,
  Music,
  Share2,
  Radio,
  CheckCircle2,
} from "lucide-react";

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
  rx: number;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface EntertainmentStageProps {
  channelId?: string;
  channelName?: string;
  onSendReactionToChat?: (reactionType: string) => void;
  isTheaterMode?: boolean;
  onToggleTheaterMode?: () => void;
}

export function EntertainmentStage({
  channelId = "movie-premiere",
  channelName = "🎬 Cinema Premiere: Cyber Neon 2099",
  onSendReactionToChat,
  isTheaterMode = false,
  onToggleTheaterMode,
}: EntertainmentStageProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [activePollVote, setActivePollVote] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic poll options per entertainment category
  const [poll, setPoll] = useState<{
    question: string;
    options: PollOption[];
    totalVotes: number;
  }>({
    question: "Audience Choice: What should be featured next?",
    options: [
      { id: "opt1", text: "Exclusive Director's Cut Scene", votes: 432 },
      { id: "opt2", text: "Live Cast Q&A Discussion", votes: 618 },
      { id: "opt3", text: "Behind-the-scenes VFX Breakdown", votes: 289 },
    ],
    totalVotes: 1339,
  });

  // Animated procedural ambient backdrop for the stage canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.015;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

      // Deep cinema background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (channelId.includes("esports")) {
        bgGrad.addColorStop(0, "#09090b");
        bgGrad.addColorStop(0.5, "#0f172a");
        bgGrad.addColorStop(1, "#1e1b4b");
      } else if (channelId.includes("concert")) {
        bgGrad.addColorStop(0, "#18052e");
        bgGrad.addColorStop(0.5, "#2e0854");
        bgGrad.addColorStop(1, "#09090b");
      } else {
        bgGrad.addColorStop(0, "#09090b");
        bgGrad.addColorStop(0.5, "#18181b");
        bgGrad.addColorStop(1, "#1c1917");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (isPlaying) {
        // Dynamic glowing audio/video visualizer waves
        const waveCount = 5;
        for (let i = 0; i < waveCount; i++) {
          ctx.beginPath();
          const hue = channelId.includes("esports")
            ? 180 + i * 20
            : channelId.includes("concert")
            ? 270 + i * 18
            : 240 + i * 15;
          ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${0.25 - i * 0.04})`;
          ctx.lineWidth = 3 - i * 0.4;

          const segments = 60;
          for (let j = 0; j <= segments; j++) {
            const x = (width / segments) * j;
            const freq = 0.008 + i * 0.003;
            const amp = (height * 0.15) / (i + 1);
            const y =
              height * 0.52 +
              Math.sin(x * freq + time * (1.2 + i * 0.3)) * amp +
              Math.cos(x * 0.004 - time * 0.8) * (amp * 0.5);
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Ambient cyber spotlights / particles
        for (let p = 0; p < 16; p++) {
          const px = ((Math.sin(p * 2.3 + time * 0.4) + 1) * 0.5) * width;
          const py = ((Math.cos(p * 1.7 + time * 0.3) + 1) * 0.5) * height;
          const radius = (Math.sin(p + time) + 2) * 12;
          const radGrad = ctx.createRadialGradient(px, py, 0, px, py, radius * 3);
          radGrad.addColorStop(0, "rgba(168, 85, 247, 0.25)");
          radGrad.addColorStop(1, "rgba(168, 85, 247, 0)");
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(px, py, radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, channelId]);

  // Handle floating reaction burst
  const triggerReaction = (emoji: string) => {
    const newReaction: FloatingReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 35 + Math.random() * 55, // percent from left
      rx: (Math.random() - 0.5) * 4,
    };
    setReactions((prev) => [...prev.slice(-20), newReaction]);
    if (onSendReactionToChat) {
      onSendReactionToChat(emoji);
    }
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 1800);
  };

  const handleVote = (optionId: string) => {
    if (activePollVote) return;
    setActivePollVote(optionId);
    setPoll((prev) => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
    }));
  };

  const getChannelIcon = () => {
    if (channelId.includes("esports")) return <Gamepad2 className="h-4 w-4 text-emerald-400" />;
    if (channelId.includes("concert")) return <Music className="h-4 w-4 text-pink-400" />;
    return <Clapperboard className="h-4 w-4 text-purple-400" />;
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-black/90 overflow-hidden select-none border-b border-border/40">
      {/* Video / Stage Canvas */}
      <div className="relative flex-1 w-full min-h-[220px] max-h-[460px] bg-neutral-950 flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

        {/* Center Stage Info Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-xs mb-2">
            {getChannelIcon()}
            <span className="font-semibold tracking-wide">ENTERTAINMENT BROADCAST</span>
          </div>
          <h2 className="text-lg md:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
            {channelName}
          </h2>
          <p className="text-xs text-white/70 mt-1 max-w-md hidden sm:block">
            Synchronized Ultra-Low Latency Live Feed • Spatial Audio Enabled
          </p>
        </div>

        {/* Top Badges Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-600/90 hover:bg-red-600 text-white font-mono text-[10px] tracking-wider px-2 py-0.5 gap-1 border-0 shadow-lg shadow-red-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              LIVE 4K HDR
            </Badge>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] text-white/80 font-mono border border-white/10">
              <Radio className="h-3 w-3 text-red-500 animate-pulse" />
              <span>1080p 60fps</span>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-sm"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? "Unmute Broadcast" : "Mute Broadcast"}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </Button>
            {onToggleTheaterMode && (
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-sm"
                onClick={onToggleTheaterMode}
                title={isTheaterMode ? "Standard View" : "Theater View"}
              >
                {isTheaterMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Floating Reactions Container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {reactions.map((r) => (
            <div
              key={r.id}
              style={
                {
                  left: `${r.x}%`,
                  bottom: "60px",
                  "--rx": r.rx,
                } as React.CSSProperties
              }
              className="absolute text-3xl animate-float-particle select-none filter drop-shadow-lg"
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Bottom Media Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="h-1.5 w-24 bg-white/20 rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-purple-500 w-full animate-pulse" />
            </div>
            <span className="text-[11px] font-mono text-white/70 hidden sm:inline">LIVE</span>
          </div>

          {/* Quick Floating Reaction Buttons (Audience Interaction) */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
            <span className="text-[10px] text-white/60 font-medium mr-1 hidden sm:inline">
              React:
            </span>
            <button
              onClick={() => triggerReaction("🔥")}
              className="hover:scale-125 transition-transform active:scale-95 text-base px-1 focus:outline-none"
              title="Fire"
            >
              🔥
            </button>
            <button
              onClick={() => triggerReaction("❤️")}
              className="hover:scale-125 transition-transform active:scale-95 text-base px-1 focus:outline-none"
              title="Love"
            >
              ❤️
            </button>
            <button
              onClick={() => triggerReaction("🚀")}
              className="hover:scale-125 transition-transform active:scale-95 text-base px-1 focus:outline-none"
              title="Hype"
            >
              🚀
            </button>
            <button
              onClick={() => triggerReaction("👏")}
              className="hover:scale-125 transition-transform active:scale-95 text-base px-1 focus:outline-none"
              title="Applause"
            >
              👏
            </button>
            <button
              onClick={() => triggerReaction("🍿")}
              className="hover:scale-125 transition-transform active:scale-95 text-base px-1 focus:outline-none"
              title="Popcorn"
            >
              🍿
            </button>
          </div>
        </div>
      </div>

      {/* Live Audience Poll / Interactive Stage Banner */}
      <div className="bg-card/95 border-t border-border/50 px-4 py-2.5 z-10 shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="text-xs font-semibold text-foreground">
              {poll.question}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground hidden md:inline">
              ({poll.totalVotes} votes)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {poll.options.map((opt) => {
              const isSelected = activePollVote === opt.id;
              const pct = Math.round((opt.votes / poll.totalVotes) * 100);
              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(opt.id)}
                  disabled={Boolean(activePollVote)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-500 shadow-sm shadow-purple-500/30"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="h-3 w-3" />}
                  <span>{opt.text}</span>
                  <span className="font-mono text-[10px] opacity-75">{pct}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
