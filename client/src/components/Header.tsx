import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { 
  Film, Image, Sparkles, Zap, CheckCircle, FolderOpen, 
  LayoutTemplate, BookOpen, LogOut, LogIn, Menu, Palette, ChevronDown,
  Wand2, Play
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { data: user } = trpc.auth.me.useQuery();
  const getLoginUrl = () => `${import.meta.env.VITE_OAUTH_PORTAL_URL}?app_id=${import.meta.env.VITE_APP_ID}&redirect_uri=${encodeURIComponent(window.location.origin + "/api/oauth/callback")}`;
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationWithDropdowns = [
    {
      name: "Production",
      href: "/production",
      icon: Film,
      items: [
        { name: "Prompts Library", href: "/production" },
        { name: "Visual Gallery", href: "/production?tab=gallery" },
      ]
    },
    {
      name: "Prompts Studio",
      href: "/prompts-studio",
      icon: FolderOpen,
      items: [
        { name: "My Prompts", href: "/prompts-studio" },
        { name: "Customizer", href: "/prompts-studio?tab=customizer" },
        { name: "Optimizer", href: "/prompts-studio?tab=optimizer" },
        { name: "Validator", href: "/prompts-studio?tab=validator" },
      ]
    },
    {
      name: "Templates",
      href: "/templates",
      icon: LayoutTemplate,
    },
    {
      name: "Tone Guide",
      href: "/tone-guide",
      icon: Palette,
      items: [
        { name: "Tone Categories", href: "/tone-guide" },
        { name: "Tone Examples", href: "/tone-guide?tab=examples" },
      ]
    },
    {
      name: "Documentation",
      href: "/documentation",
      icon: BookOpen,
      items: [
        { name: "Overview", href: "/documentation" },
        { name: "LLM API", href: "/documentation#llm-api" },
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === "/production" && location === "/") return false;
    return location === href || location.startsWith(href + "/") || location.startsWith(href + "?");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <Film className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">Video Marketing Prompts</span>
            <span className="sm:hidden">VMP</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigationWithDropdowns.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            // If item has dropdown
            if (item.items) {
              return (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link href={subItem.href}>
                          <a className="w-full cursor-pointer">
                            {subItem.name}
                          </a>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            // Regular link without dropdown
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

        {/* Mobile Menu Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {navigationWithDropdowns.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name}>
                    <Link href={item.href}>
                      <a
                        className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </a>
                    </Link>
                    {item.items && (
                      <div className="ml-8 mt-2 space-y-2">
                        {item.items.map((subItem) => (
                          <Link key={subItem.name} href={subItem.href}>
                            <a
                              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Auth in Mobile Menu */}
              <div className="pt-4 border-t">
                {user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {user.name || user.email}
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href="/api/auth/logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </a>
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" asChild className="w-full">
                    <a href={getLoginUrl()}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </a>
                  </Button>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
