import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export type Activity = {
  id: number;
  icon: React.ReactNode;
  title: string;
  date: Date;
  description: string;
  action: {
    label: string;
    href: string;
  };
  iconBgColor: string;
  iconColor: string;
};

interface RecentActivitiesProps {
  activities: Activity[];
  isLoading?: boolean;
}

export default function RecentActivities({ activities, isLoading = false }: RecentActivitiesProps) {
  const { t } = useTranslation();

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200">
      <CardHeader className="px-6 py-5 border-b border-neutral-200 flex justify-between items-center">
        <CardTitle className="text-lg font-medium text-neutral-800">
          {t("recentActivities")}
        </CardTitle>
        <Link href="/activities" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          {t("viewAll")}
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10">
            <svg className="h-12 w-12 text-neutral-400 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-neutral-500">{t("noRecentActivities")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {activities.map((activity) => (
              <li key={activity.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start">
                  <div 
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-${activity.iconColor}`}
                    style={{ backgroundColor: activity.iconBgColor }}
                  >
                    {activity.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-neutral-900">{activity.title}</h4>
                      <span className="text-xs text-neutral-500" title={format(activity.date, 'PPP')}>
                        {formatDistanceToNow(activity.date, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{activity.description}</p>
                    <div className="mt-2">
                      <Link 
                        href={activity.action.href}
                        className="text-xs font-medium text-primary-600 hover:text-primary-500 inline-flex items-center"
                      >
                        {activity.action.label} <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
