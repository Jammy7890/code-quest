import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useUserStat } from "@/lib/useUserData";
import { computeLevel } from "@/lib/progress";
import { Flame, LayoutDashboard, BookOpen, FolderGit2, LogOut, Code2, Menu, X, Gem, Layers, Terminal, Gamepad2 } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/projects", label: "Projects", icon: FolderGit2 },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/playground", label: "Playground", icon: Terminal },
  { to: "/minigames", label: "Minigames", icon: Gamepad2 },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { data: stat } = useUserStat();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const level = computeLevel(stat?.total_xp || 0);

  const SidebarInner = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Code2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-heading font-bold tracking-tight">CodeQuest</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-orange-50 to-amber-50 p-4 dark:from-orange-950/40 dark:to-amber-950/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Flame className={`w-5 h-5 ${stat?.current_streak ? "text-orange-500" : "text-orange-300"}`} />
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stat?.current_streak || 0}</span>
            </div>
            <span className="text-xs font-medium text-orange-700/70 dark:text-orange-300/70">day streak</span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Level {level.level} · {stat?.total_xp || 0} XP</span>
            <span className="flex items-center gap-1"><Gem className="w-3 h-3" /> {stat?.gems ?? 0}</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-orange-100 dark:bg-orange-900/40 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${Math.round(level.progress * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="px-4 pb-5 pt-3 border-t border-border">
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
            {(user?.full_name || user?.email || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.full_name || user?.email}</div>
          </div>
          <button onClick={() => logout()} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-accent transition-colors" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-border bg-sidebar flex-col">
        {SidebarInner}
      </aside>

      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Code2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold">CodeQuest</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-bold">{stat?.current_streak || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-sky-500">
            <Gem className="w-4 h-4" />
            <span className="text-sm font-bold">{stat?.gems ?? 0}</span>
          </div>
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-accent">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar border-r border-border shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent z-10">
              <X className="w-5 h-5" />
            </button>
            {SidebarInner}
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}