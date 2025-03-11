import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

interface AlertBannerProps {
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  daysLeft?: number;
}

export default function AlertBanner({
  title,
  message,
  ctaText,
  ctaLink,
  daysLeft,
}: AlertBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 bg-accent-50 border-l-4 border-accent-500 p-4 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="text-accent-500 h-5 w-5" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-accent-800">{title}</h3>
          <div className="mt-1 text-sm text-accent-700">
            {message}
            {daysLeft !== undefined && (
              <span className="font-semibold"> {daysLeft} {t('days')}</span>
            )}
          </div>
          <div className="mt-2">
            <Link
              href={ctaLink}
              className="text-sm font-medium text-accent-600 hover:text-accent-500 inline-flex items-center"
            >
              {ctaText} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
