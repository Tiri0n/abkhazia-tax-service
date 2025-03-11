import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type NavLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
};

function NavLink({ href, icon, label, count }: NavLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-md",
          isActive
            ? "bg-primary-50 text-primary-600"
            : "text-neutral-700 hover:bg-neutral-100"
        )}
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
}

export default function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Get unread notifications count
  const { data: unreadNotifications = [], isLoading } = useQuery({
    queryKey: ["/api/notifications/unread"],
    enabled: !!user,
  });

  const unreadCount = unreadNotifications.length;

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-neutral-200 h-[calc(100vh-4rem)] sticky top-16 overflow-hidden">
      <ScrollArea className="h-full py-4 px-3">
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
                count={unreadCount}
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
            <li className="pt-4 mt-4 border-t border-neutral-200">
              <NavLink
                href="/settings"
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>}
                label={t("settings")}
              />
            </li>
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
}
