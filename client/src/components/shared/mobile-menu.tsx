import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  unreadNotifications: number;
}

export default function MobileMenu({ isOpen, onClose, unreadNotifications }: MobileMenuProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    onClose();
  };

  const isActive = (path: string) => location === path;

  const NavLink = ({ href, icon, label, count }: { href: string; icon: React.ReactNode; label: string; count?: number }) => (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-md",
          isActive(href)
            ? "bg-primary-50 text-primary-600"
            : "text-neutral-700 hover:bg-neutral-100"
        )}
        onClick={onClose}
      >
        {icon}
        <span>{label}</span>
        {count !== undefined && count > 0 && (
          <span className="ml-auto bg-accent-500 text-white text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
            {count}
          </span>
        )}
      </a>
    </Link>
  );

  return (
    <div className="fixed inset-0 z-50 bg-neutral-800 bg-opacity-75">
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col h-full">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 h-5 w-5 mr-2">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              <path d="M12 7V3" />
              <path d="M3 8v7.5a1.5 1.5 0 0 0 3 0v-4.5" />
              <path d="M18 10v3.5a1.5 1.5 0 0 0 3 0" />
            </svg>
            <span className="font-semibold text-primary-500">
              {t("appName")}
            </span>
          </div>
          <button
            type="button"
            className="text-neutral-500 hover:text-neutral-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-4">
          <nav>
            <ul className="space-y-1">
              <li>
                <NavLink
                  href="/"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>}
                  label={t("dashboard")}
                />
              </li>
              <li>
                <NavLink
                  href="/documents"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>}
                  label={t("taxDocuments")}
                />
              </li>
              <li>
                <NavLink
                  href="/payments"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>}
                  label={t("payments")}
                />
              </li>
              <li>
                <NavLink
                  href="/inquiries"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>}
                  label={t("inquiries")}
                />
              </li>
              <li>
                <NavLink
                  href="/notifications"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>}
                  label={t("notifications")}
                  count={unreadNotifications}
                />
              </li>
              <li className="pt-4 mt-4 border-t border-neutral-200">
                <h3 className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {t("resources")}
                </h3>
              </li>
              <li>
                <NavLink
                  href="/faq"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>}
                  label={t("faqs")}
                />
              </li>
              <li>
                <NavLink
                  href="/education"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>}
                  label={t("taxEducation")}
                />
              </li>
              <li>
                <NavLink
                  href="/support"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><path d="M7 19a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7z" /><line x1="12" x2="12" y1="10" y2="16" /><line x1="12" x2="12.01" y1="7" y2="7" /></svg>}
                  label={t("support")}
                />
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-medium mr-2">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-800">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-neutral-500">{user?.email}</div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>{t("logout")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
