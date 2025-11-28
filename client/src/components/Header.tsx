import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { 
  Film, Image, Sparkles, Zap, CheckCircle, FolderOpen, 
  LayoutTemplate, BookOpen, LogOut, LogIn, Menu, X 
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { data: user } = trpc.auth.me.useQuery();
  const getLoginUrl = () => `${import.meta.env.VITE_OAUTH_PORTAL_URL}?app_id=${import.meta.env.VITE_APP_ID}&redirect_uri=${encodeURIComponent(window.location.origin + "/api/oauth/callback")}`;
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Explore", href: "/prompts", icon: Film },
    { name: "Gallery", href: "/gallery", icon: Image },
    { name: "Generator", href: "/generator", icon: Sparkles },
    { name: "Optimizer", href: "/optimizer", icon: Zap },
    { name: "Validator", href: "/validator", icon: CheckCircle },
    { name: "My Prompts", href: "/my-prompts", icon: FolderOpen },
    { name: "Templates", href: "/templates", icon: LayoutTemplate },
    { name: "Documentation", href: "/documentation", icon: BookOpen },
  ];

  const isActive = (href: string) => {
    if (href === "/prompts" && location === "/") return false;
    return location === href || location.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <Film className="h-6 w-6 text-primary" />
            <span>Video Marketing Prompts</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Auth Button (Desktop) */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user.name || user.email}
              </span>
              <Button variant="outline" size="sm" asChild>
                <a href="/api/auth/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </a>
              </Button>
            </div>
          ) : (
            <Button size="sm" asChild>
              <a href={getLoginUrl()}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </a>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
            
            {/* Mobile Auth */}
            <div className="pt-4 border-t mt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    {user.name || user.email}
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/api/auth/logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </a>
                  </Button>
                </div>
              ) : (
                <Button className="w-full" asChild>
                  <a href={getLoginUrl()}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </a>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
