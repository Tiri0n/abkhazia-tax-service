import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

type HelpLink = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

interface HelpSectionProps {
  links: HelpLink[];
}

export default function HelpSection({ links }: HelpSectionProps) {
  const { t } = useTranslation();

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200">
      <CardHeader className="px-6 py-5 border-b border-neutral-200">
        <CardTitle className="text-lg font-medium text-neutral-800">
          {t("needHelp")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="space-y-3">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-sm text-neutral-700 hover:text-primary-600 flex items-center"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <Button 
            asChild
            className="w-full justify-center bg-primary-500 hover:bg-primary-600"
          >
            <Link href="/support">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              {t("contactTaxSupport")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
