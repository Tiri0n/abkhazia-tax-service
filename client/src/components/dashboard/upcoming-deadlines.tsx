import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export type Deadline = {
  id: number;
  title: string;
  date: Date;
  status: "urgent" | "upcoming" | "future";
};

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
  isLoading?: boolean;
}

export default function UpcomingDeadlines({ deadlines, isLoading = false }: UpcomingDeadlinesProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: Deadline["status"]) => {
    switch (status) {
      case "urgent":
        return "bg-danger";
      case "upcoming":
        return "bg-warning";
      case "future":
        return "bg-neutral-400";
    }
  };

  const getStatusBadge = (deadline: Deadline) => {
    const daysLeft = differenceInDays(deadline.date, new Date());
    
    if (daysLeft <= 14) {
      return (
        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-danger bg-opacity-10 text-danger font-medium">
          {daysLeft} {t("daysLeft")}
        </span>
      );
    }
    
    if (daysLeft <= 30) {
      return (
        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-warning bg-opacity-10 text-warning font-medium">
          {daysLeft} {t("daysLeft")}
        </span>
      );
    }
    
    return null;
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-8">
      <CardHeader className="px-6 py-5 border-b border-neutral-200">
        <CardTitle className="text-lg font-medium text-neutral-800">
          {t("upcomingDeadlines")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : deadlines.length === 0 ? (
          <div className="text-center py-6">
            <svg className="h-10 w-10 text-neutral-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-neutral-500">{t("noUpcomingDeadlines")}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {deadlines.map((deadline) => (
              <li key={deadline.id} className="flex items-start">
                <span className={`flex-shrink-0 w-3 h-3 rounded-full ${getStatusColor(deadline.status)} mt-1.5`}></span>
                <div className="ml-3">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-neutral-800">{deadline.title}</h4>
                    {getStatusBadge(deadline)}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {t("dueOn")} {format(deadline.date, "PP")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <Link 
            href="/deadlines" 
            className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
          >
            <span>{t("viewAllDeadlines")}</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
