import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/shared/mobile-menu";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/shared/language-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  // Get unread notifications count
  const { data: unreadNotifications = [] } = useQuery({
    queryKey: ["/api/notifications/unread"],
    enabled: !!user,
  });

  const unreadCount = unreadNotifications.length;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/auth");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-primary-500 text-2xl mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                    <path d="M12 7V3" />
                    <path d="M3 8v7.5a1.5 1.5 0 0 0 3 0v-4.5" />
                    <path d="M18 10v3.5a1.5 1.5 0 0 0 3 0" />
                  </svg>
                </span>
                <span className="font-semibold text-primary-500 text-xl">
                  {t("appName")}
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5 mr-1" />
                  <span>{t("notifications")}</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-accent-500 text-white text-xs rounded-full size-5 flex items-center justify-center -mt-1 -mr-1">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              <LanguageSelector />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-medium mr-2">
                      {getInitials()}
                    </div>
                    <span>{user?.firstName} {user?.lastName}</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-4 lg:p-8 bg-neutral-50">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-4 mt-auto">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} {t("footerCopyright")}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">
                {t("privacyPolicy")}
              </a>
              <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">
                {t("termsOfService")}
              </a>
              <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">
                {t("accessibility")}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        unreadNotifications={unreadCount}
      />
    </div>
  );
}
