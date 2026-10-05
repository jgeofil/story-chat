"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Moon, Sun, Sparkles, Tv, Radio } from "lucide-react";
import { useTheme } from "next-themes";

interface EntertainmentHeaderProps {
  userId: string;
  userName: string;
  activeChannelName?: string;
  viewerCount?: number;
  onSwitchUser: () => void;
}

export function EntertainmentHeader({
  userId,
  userName,
  activeChannelName,
  viewerCount = 14820,
  onSwitchUser,
}: EntertainmentHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const initial = (userName || userId || "U").charAt(0).toUpperCase();

  return (
    <header className="h-14 border-b border-border/60 bg-card/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30 select-none">
      {/* Left: Brand & Live Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Tv className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
                Stream Live
              </span>
              <Badge variant="outline" className="h-5 px-1.5 gap-1 border-red-500/30 text-red-400 bg-red-500/10 font-mono text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </Badge>
            </div>
            {activeChannelName && (
              <p className="text-[11px] text-muted-foreground truncate max-w-[220px] md:max-w-[360px]">
                {activeChannelName}
              </p>
            )}
          </div>
        </div>

        {/* Live viewer pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 text-xs font-mono text-muted-foreground border border-border/40">
          <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
          <span>{viewerCount.toLocaleString()} viewers</span>
        </div>
      </div>

      {/* Right: User status, Switch User, Theme Toggle */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* User Identity Display */}
        <div className="flex items-center gap-2 pl-2">
          <Avatar className="h-8 w-8 ring-2 ring-purple-500/30 bg-muted">
            <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`} alt={userName} />
            <AvatarFallback className="bg-purple-600/20 text-purple-300 font-semibold text-xs">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-medium leading-none text-foreground flex items-center gap-1">
              {userName}
              <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400/20" />
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">@{userId}</span>
          </div>
        </div>

        <Badge variant="secondary" className="hidden lg:inline-flex text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
          VIP Audience
        </Badge>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
          title="Toggle color theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Switch User Button (Required: clears state and returns to login) */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground border-border/60 hover:bg-muted"
          onClick={onSwitchUser}
          title="Sign out and switch user"
        >
          <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
          <span className="hidden sm:inline">Switch User</span>
        </Button>
      </div>
    </header>
  );
}
