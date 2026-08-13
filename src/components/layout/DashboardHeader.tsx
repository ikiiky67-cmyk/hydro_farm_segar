"use client";

import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Bell, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <header
      className="t-header h-16 border-b flex items-center justify-between px-4 md:px-6 flex-shrink-0 transition-theme"
      style={{
        background: "var(--t-header-bg)",
        borderColor: "var(--t-header-border)",
        backdropFilter: "blur(16px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pl-10 md:pl-0"
      >
        <p className="text-xs" style={{ color: "var(--t-text-muted)" }}>
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification Bell */}
        <button
          className="relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 hover:opacity-80"
          style={{
            background: "var(--t-input-bg)",
            borderColor: "var(--t-input-border)",
            color: "var(--t-text-secondary)",
          }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2" style={{ borderColor: "var(--t-header-bg)" }} />
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-xl border transition-all duration-200 hover:opacity-80"
              style={{
                background: "var(--t-input-bg)",
                borderColor: "var(--t-input-border)",
              }}
            >
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium" style={{ color: "var(--t-text-primary)" }}>
                {user.name ?? "Admin"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52"
            style={{
              background: "var(--t-modal-bg)",
              borderColor: "var(--t-card-border)",
              color: "var(--t-text-primary)",
            }}
          >
            <DropdownMenuLabel style={{ color: "var(--t-text-muted)", fontSize: "0.75rem" }}>
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator style={{ background: "var(--t-divider)" }} />
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              style={{ color: "var(--t-text-secondary)" }}
            >
              <User className="w-4 h-4" />
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuSeparator style={{ background: "var(--t-divider)" }} />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-rose-500 cursor-pointer gap-2 focus:text-rose-500 focus:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
