"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tv, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { EntertainmentChat } from "@/components/entertainment-chat";

interface AuthState {
  apiKey: string;
  chatToken: string;
  userId: string;
  userName: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState | null>(null);

  const handleSubmit = async (e?: React.FormEvent, customUser?: string) => {
    if (e) e.preventDefault();
    const targetUser = (customUser || username).trim();

    if (!targetUser) {
      setError("Please enter a username to continue");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/token?user_id=${encodeURIComponent(targetUser)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to authenticate with Stream Chat");
      }

      // Store credentials in React state (independent per browser tab)
      setAuthState({
        apiKey: data.apiKey,
        chatToken: data.chatToken,
        userId: data.userId,
        userName: data.name || data.userId,
      });
    } catch (err: unknown) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchUser = () => {
    // Clears all state and returns to Login Screen
    setAuthState(null);
    setUsername("");
    setError(null);
  };

  // State gate: Render main entertainment chat UI when authenticated
  if (authState) {
    return (
      <EntertainmentChat
        apiKey={authState.apiKey}
        chatToken={authState.chatToken}
        userId={authState.userId}
        userName={authState.userName}
        onSwitchUser={handleSwitchUser}
      />
    );
  }

  // Pre-configured test usernames for convenient pair testing
  const quickUsers = [
    { id: "alex_fan", label: "Alex (Audience)" },
    { id: "nova_host", label: "Nova (Host / VIP)" },
    { id: "kai_gamer", label: "Kai (Esports)" },
    { id: "sam_dj", label: "Sam (Live Music)" },
  ];

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-background relative overflow-hidden select-none">
      {/* Subtle cinema backdrop glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl relative z-10">
        <CardContent className="pt-8 pb-7 px-6 sm:px-8 flex flex-col items-center text-center">
          {/* 1. App Icon / Logo */}
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/25 mb-4 ring-4 ring-purple-500/20">
            <Tv className="h-8 w-8" />
          </div>

          {/* 2. App Name / Use-Case Label */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Stream Entertainment Chat</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome to the Show
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Join live watch parties, premieres, and stage broadcasts.
            </p>
          </div>

          {/* Error Banner if any */}
          {error && (
            <div className="w-full mb-4 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 text-left">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={(e) => handleSubmit(e)} className="w-full space-y-4">
            {/* 3. Single username input (required, full card width) */}
            <div className="text-left w-full">
              <label
                htmlFor="username"
                className="text-xs font-semibold text-foreground/80 block mb-1.5 ml-0.5"
              >
                Choose your display handle
              </label>
              <Input
                id="username"
                type="text"
                required
                placeholder="e.g. jordan_live or cyber_fan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 w-full bg-muted/50 border-border/80 focus-visible:ring-purple-500 text-sm"
                autoComplete="off"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Quick Demo Handles */}
            <div className="text-left pt-1">
              <span className="text-[11px] text-muted-foreground font-medium block mb-1.5">
                Or quick-test with a preset profile:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setUsername(u.id);
                      handleSubmit(undefined, u.id);
                    }}
                    disabled={isLoading}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/60 transition-colors focus:outline-none"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Continue Primary Button (RULES.md: No arrow characters in label text!) */}
            <Button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting to Stream...
                </>
              ) : (
                "Continue to Broadcast"
              )}
            </Button>
          </form>

          {/* 5. Hint text below the button (exact text from builder-ui.md) */}
          <p className="text-muted-foreground text-sm mt-5 leading-relaxed">
            Open this URL in another tab with a different username to test multi-user features.
          </p>

          {/* App Metadata Footer */}
          <div className="mt-4 pt-4 border-t border-border/40 w-full flex items-center justify-between text-[11px] text-muted-foreground/80">
            <span>Stream App ID: 1163763</span>
            <span className="flex items-center gap-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              Connected
            </span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
