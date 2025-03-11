import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format, formatDistanceToNow } from "date-fns";
import { Bell, Check, Calendar, CreditCard, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch notifications
  const { 
    data: notifications = [], 
    isLoading 
  } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/notifications/${id}/read`, undefined);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread"] });
    },
  });

  // Filter notifications based on active tab and read status
  const filteredNotifications = notifications.filter((notification: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  // Handle marking notification as read
  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutateAsync(id);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Calendar className="h-6 w-6" />;
      case "payment":
        return <CreditCard className="h-6 w-6" />;
      case "assessment":
        return <FileText className="h-6 w-6" />;
      case "alert":
        return <AlertTriangle className="h-6 w-6" />;
      default:
        return <Bell className="h-6 w-6" />;
    }
  };

  // Get notification icon background color based on type
  const getNotificationIconBackground = (type: string) => {
    switch (type) {
      case "deadline":
        return "bg-amber-100 text-amber-600";
      case "payment":
        return "bg-green-100 text-green-600";
      case "assessment":
        return "bg-blue-100 text-blue-600";
      case "alert":
        return "bg-red-100 text-red-600";
      default:
        return "bg-primary-100 text-primary-600";
    }
  };

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
        <BreadcrumbItem active>{t("notifications")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("notifications")}</h1>
          <p className="mt-1 text-neutral-600">{t("stayUpdatedWithTaxEvents")}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center">
          <Switch id="notification-settings" />
          <Label htmlFor="notification-settings" className="ml-2">
            {t("emailNotifications")}
          </Label>
        </div>
      </div>

      {/* Notifications Content */}
      <Card>
        <CardHeader className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">{t("all")}</TabsTrigger>
              <TabsTrigger value="unread">{t("unread")}</TabsTrigger>
              <TabsTrigger value="deadline">{t("deadlines")}</TabsTrigger>
              <TabsTrigger value="payment">{t("payments")}</TabsTrigger>
              <TabsTrigger value="assessment">{t("assessments")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <Bell className="h-16 w-16 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                {activeTab === "unread" 
                  ? t("noUnreadNotifications") 
                  : activeTab === "all" 
                    ? t("noNotifications") 
                    : t("noNotificationsOfType", { type: t(activeTab).toLowerCase() })}
              </h3>
              <p className="text-neutral-500 max-w-md">
                {activeTab === "unread" 
                  ? t("allNotificationsRead") 
                  : t("notificationsWillAppearHere")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredNotifications.map((notification: any) => (
                <div key={notification.id} className={`p-6 ${!notification.read ? 'bg-primary-50' : ''}`}>
                  <div className="flex">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full ${getNotificationIconBackground(notification.type)} flex items-center justify-center`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-medium text-neutral-900">
                            {notification.title}
                            {!notification.read && (
                              <Badge variant="outline" className="ml-2 bg-primary-100 text-primary-700 border-primary-200 font-normal">
                                {t("new")}
                              </Badge>
                            )}
                          </h4>
                          <p className="mt-1 text-sm text-neutral-600">{notification.message}</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="ml-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {t("markAsRead")}
                          </Button>
                        )}
                      </div>
                      {notification.type === "deadline" && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-md inline-block">
                          <div className="flex items-center text-xs text-amber-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{t("dueOn")} {format(new Date(notification.dueDate), "PPP")}</span>
                          </div>
                        </div>
                      )}
                      {notification.type === "payment" && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-md inline-block">
                          <div className="flex items-center text-xs text-green-800">
                            <CreditCard className="h-3 w-3 mr-1" />
                            <span>{notification.amount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("notificationPreferences")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="deadline-notifications">{t("deadlineNotifications")}</Label>
                <p className="text-sm text-neutral-500">{t("deadlineNotificationsDescription")}</p>
              </div>
              <Switch id="deadline-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payment-notifications">{t("paymentNotifications")}</Label>
                <p className="text-sm text-neutral-500">{t("paymentNotificationsDescription")}</p>
              </div>
              <Switch id="payment-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="assessment-notifications">{t("assessmentNotifications")}</Label>
                <p className="text-sm text-neutral-500">{t("assessmentNotificationsDescription")}</p>
              </div>
              <Switch id="assessment-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alert-notifications">{t("alertNotifications")}</Label>
                <p className="text-sm text-neutral-500">{t("alertNotificationsDescription")}</p>
              </div>
              <Switch id="alert-notifications" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
