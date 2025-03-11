import { useEffect } from "react";
import MainLayout from "@/components/layout/main-layout";
import TaxSummaryCard from "@/components/dashboard/tax-summary-card";
import AlertBanner from "@/components/dashboard/alert-banner";
import TaxBreakdown, { TaxCategory } from "@/components/dashboard/tax-breakdown";
import RecentActivities, { Activity } from "@/components/dashboard/recent-activities";
import UpcomingDeadlines, { Deadline } from "@/components/dashboard/upcoming-deadlines";
import QuickAccess from "@/components/dashboard/quick-access";
import HelpSection from "@/components/dashboard/help-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Loader2, FileText, CreditCard, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Fetch tax obligations data
  const { 
    data: taxObligations = [], 
    isLoading: isLoadingObligations 
  } = useQuery({
    queryKey: ["/api/tax-obligations"],
    enabled: !!user,
  });

  // Fetch payments data
  const { 
    data: payments = [], 
    isLoading: isLoadingPayments 
  } = useQuery({
    queryKey: ["/api/payments"],
    enabled: !!user,
  });

  // Fetch upcoming deadlines
  const { 
    data: upcomingObligations = [], 
    isLoading: isLoadingUpcoming 
  } = useQuery({
    queryKey: ["/api/tax-obligations/upcoming"],
    enabled: !!user,
  });

  // Prepare tax categories for breakdown chart
  const taxCategories: TaxCategory[] = [
    { name: "income", amount: 5240.75, color: "#0F4C81" },
    { name: "property", amount: 2150.00, color: "#36B37E" },
    { name: "vehicle", amount: 890.50, color: "#FF8C42" },
    { name: "other", amount: 509.00, color: "#0DCAF0" }
  ];

  // Format payments as activities
  const recentActivities: Activity[] = payments.slice(0, 3).map((payment: any) => ({
    id: payment.id,
    icon: <CreditCard className="h-5 w-5" />,
    title: `Payment - ${payment.method}`,
    date: new Date(payment.date),
    description: `Your payment of ${payment.amount} was processed successfully.`,
    action: {
      label: "View receipt",
      href: `/payments/${payment.id}`
    },
    iconBgColor: "#E6EFF5",
    iconColor: "#0F4C81"
  }));

  // Format upcoming obligations as deadlines
  const upcomingDeadlines: Deadline[] = upcomingObligations.map((obligation: any) => {
    const dueDate = new Date(obligation.dueDate);
    const now = new Date();
    const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: "urgent" | "upcoming" | "future" = "future";
    if (daysUntilDue <= 14) {
      status = "urgent";
    } else if (daysUntilDue <= 30) {
      status = "upcoming";
    }
    
    return {
      id: obligation.id,
      title: obligation.name,
      date: dueDate,
      status
    };
  });

  // Quick access items
  const quickAccessItems = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: t("taxDocuments"),
      description: t("accessTaxDocuments"),
      href: "/documents",
      iconBgColor: "#E6EFF5",
      iconColor: "#0F4C81"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: t("payments"),
      description: t("makePayments"),
      href: "/payments",
      iconBgColor: "#ECFAF4",
      iconColor: "#36B37E"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: t("inquiries"),
      description: t("submitInquiry"),
      href: "/inquiries",
      iconBgColor: "#FFF1E9",
      iconColor: "#FF8C42"
    }
  ];

  // Help section links
  const helpLinks = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 mr-2 h-4 w-4"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>,
      label: t("faqs"),
      href: "/faq"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 mr-2 h-4 w-4"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
      label: t("taxEducation"),
      href: "/education"
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 mr-2 h-4 w-4"><path d="M7 19a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7z" /><line x1="12" x2="12" y1="10" y2="16" /><line x1="12" x2="12.01" y1="7" y2="7" /></svg>,
      label: t("support"),
      href: "/support"
    }
  ];

  // Find the earliest upcoming obligation for alert banner
  const earliestObligation = upcomingObligations.length > 0 
    ? upcomingObligations.reduce((earliest, current) => {
        return new Date(earliest.dueDate) < new Date(current.dueDate) ? earliest : current;
      }) 
    : null;

  // Calculate days left for the earliest obligation
  const daysLeft = earliestObligation 
    ? Math.round((new Date(earliestObligation.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Find the most recent payment
  const lastPayment = payments.length > 0 ? payments[0] : null;

  // Calculate total YTD taxes
  const ytdTaxes = payments.reduce((total, payment) => {
    const paymentAmount = parseFloat(payment.amount.replace(/[$,]/g, ''));
    return total + paymentAmount;
  }, 0);

  return (
    <MainLayout>
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbItem href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {t("home")}
        </BreadcrumbItem>
        <BreadcrumbItem active>{t("dashboard")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">
          {t("welcome", { name: user?.firstName })}
        </h1>
        <p className="mt-1 text-neutral-600">{t("taxOverview")}</p>
      </div>

      {/* Alert banner for important notifications */}
      {earliestObligation && daysLeft && daysLeft <= 30 && (
        <AlertBanner
          title={t("importantTaxDeadline")}
          message={`${t("taxDeadlineMessage")}`}
          ctaText={t("fileNow")}
          ctaLink={`/payments?obligation=${earliestObligation.id}`}
          daysLeft={daysLeft}
        />
      )}

      {/* Tax Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Outstanding Balance */}
        <TaxSummaryCard
          title={t("outstandingBalance")}
          amount={isLoadingObligations ? "..." : "$2,450.00"}
          description={t("dueBy", { date: "July 15, 2023" })}
          badgeText={t("dueSoon")}
          badgeVariant="due"
          actionText={t("payNow")}
          actionLink="/payments/new"
          actionVariant="primary"
        />

        {/* Last Payment */}
        <TaxSummaryCard
          title={t("lastPayment")}
          amount={isLoadingPayments || !lastPayment ? "..." : lastPayment.amount}
          description={isLoadingPayments || !lastPayment ? "..." : t("processedOn", { date: format(new Date(lastPayment.date), "MMMM d, yyyy") })}
          badgeText={t("processed")}
          badgeVariant="processed"
          actionText={t("viewReceipt")}
          actionLink={lastPayment ? `/payments/${lastPayment.id}` : "/payments"}
          actionVariant="outline"
        />

        {/* Year-to-Date */}
        <TaxSummaryCard
          title={t("yearToDateTaxesPaid")}
          amount={isLoadingPayments ? "..." : `$${ytdTaxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          description={t("acrossTaxCategories")}
          badgeText={new Date().getFullYear().toString()}
          badgeVariant="info"
          actionText={t("viewDetails")}
          actionLink="/payments"
          actionVariant="outline"
        />
      </div>

      {/* Tabs for content sections */}
      <div className="mb-6 border-b border-neutral-200">
        <Tabs defaultValue="overview">
          <TabsList className="mx-0 bg-transparent border-b-0 justify-start">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 border-b-2 border-transparent data-[state=active]:shadow-none rounded-none py-3 px-4 text-sm font-medium"
            >
              {t("taxOverviewTab")}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 border-b-2 border-transparent data-[state=active]:shadow-none rounded-none py-3 px-4 text-sm font-medium"
            >
              {t("paymentHistoryTab")}
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 border-b-2 border-transparent data-[state=active]:shadow-none rounded-none py-3 px-4 text-sm font-medium"
            >
              {t("documentsTab")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tax Breakdown */}
          <TaxBreakdown 
            categories={taxCategories} 
            isLoading={isLoadingObligations} 
          />

          {/* Recent Activities */}
          <RecentActivities 
            activities={recentActivities} 
            isLoading={isLoadingPayments} 
          />
        </div>

        <div className="lg:col-span-1">
          {/* Upcoming Deadlines */}
          <UpcomingDeadlines 
            deadlines={upcomingDeadlines} 
            isLoading={isLoadingUpcoming} 
          />

          {/* Quick Access */}
          <QuickAccess items={quickAccessItems} />

          {/* Help Section */}
          <HelpSection links={helpLinks} />
        </div>
      </div>
    </MainLayout>
  );
}
