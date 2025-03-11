import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type QuickAccessItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  iconBgColor: string;
  iconColor: string;
};

interface QuickAccessProps {
  items: QuickAccessItem[];
}

export default function QuickAccess({ items }: QuickAccessProps) {
  const { t } = useTranslation();

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-8">
      <CardHeader className="px-6 py-5 border-b border-neutral-200">
        <CardTitle className="text-lg font-medium text-neutral-800">
          {t("quickAccess")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block p-3 rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-${item.iconColor}`}
                  style={{ backgroundColor: item.iconBgColor }}
                >
                  {item.icon}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-neutral-800">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-neutral-500">{item.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
