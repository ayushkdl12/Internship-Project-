"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import {
  Briefcase,
  Bell,
  BellOff,
  CheckCheck,
  LogOut,
  ArrowLeft,
  GraduationCap,
  Building2,
  Award,
  Info,
  AlertTriangle,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface Notification {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

const typeIcon: Record<string, React.ElementType> = {
  application_status: GraduationCap,
  new_application:    Building2,
  certificate:        Award,
  announcement:       Info,
  warning:            AlertTriangle,
};

const typeBg: Record<string, string> = {
  application_status: "gradient-card-blue",
  new_application:    "gradient-card-purple",
  certificate:        "gradient-card-green",
  announcement:       "gradient-card-orange",
  warning:            "bg-red-50 dark:bg-red-950/20",
};

const typeColor: Record<string, string> = {
  application_status: "text-blue-600",
  new_application:    "text-purple-600",
  certificate:        "text-green-600",
  announcement:       "text-orange-600",
  warning:            "text-red-600",
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (status === "authenticated") fetchNotifications();
  }, [status]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setMarkingAll(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto animate-pulse">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading notifications…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-muted/5">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base hidden sm:block">InternSync<span className="text-secondary font-black">.</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session && (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-8 max-w-3xl">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={session ? `/dashboard/${session.user?.role}` : "/"}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-primary text-white text-xs">{unreadCount}</Badge>
                )}
              </h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              disabled={markingAll}
              className="text-primary border-primary/30 hover:bg-primary/5"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications list */}
        {notifications.length === 0 ? (
          <Card className="shadow-card border-0">
            <CardContent className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-card-blue flex items-center justify-center mx-auto mb-4">
                <BellOff className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-semibold text-lg mb-2">No notifications yet</p>
              <p className="text-muted-foreground text-sm">
                You'll receive updates on your applications and platform activity here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, i) => {
              const Icon = typeIcon[notif.notificationType] || Bell;
              const bg = typeBg[notif.notificationType] || "gradient-card-blue";
              const color = typeColor[notif.notificationType] || "text-blue-600";
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                    notif.isRead
                      ? "bg-background border-border/50 opacity-70"
                      : "bg-white dark:bg-slate-900 border-primary/10 shadow-sm shadow-primary/5"
                  }`}>
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm">{notif.title}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                          <span className="text-xs text-muted-foreground">{formatTime(notif.createdAt)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
