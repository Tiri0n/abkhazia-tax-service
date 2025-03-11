import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

type BadgeVariant = "due" | "processed" | "info";

interface TaxSummaryCardProps {
  title: string;
  amount: string;
  description: string;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  actionText: string;
  actionLink: string;
  actionVariant?: "primary" | "outline";
}

export default function TaxSummaryCard({
  title,
  amount,
  description,
  badgeText,
  badgeVariant = "info",
  actionText,
  actionLink,
  actionVariant = "primary",
}: TaxSummaryCardProps) {
  const { t } = useTranslation();

  const getBadgeClasses = (variant: BadgeVariant) => {
    switch (variant) {
      case "due":
        return "bg-danger bg-opacity-10 text-danger";
      case "processed":
        return "bg-success bg-opacity-10 text-success";
      case "info":
        return "bg-info bg-opacity-10 text-info";
      default:
        return "bg-primary-100 text-primary-600";
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-neutral-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
          {badgeText && (
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                getBadgeClasses(badgeVariant)
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-neutral-800">{amount}</div>
        <div className="mt-1 text-sm text-neutral-500">{description}</div>
        <div className="mt-4">
          <Button
            asChild
            variant={actionVariant === "primary" ? "default" : "outline"}
            className={cn(
              "w-full justify-center",
              actionVariant === "primary" 
                ? "bg-primary-500 hover:bg-primary-600" 
                : "text-neutral-700 hover:bg-neutral-50"
            )}
          >
            <Link href={actionLink}>{actionText}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
