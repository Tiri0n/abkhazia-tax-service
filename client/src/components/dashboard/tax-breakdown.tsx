import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";

export type TaxCategory = {
  name: string;
  amount: number;
  color: string;
};

interface TaxBreakdownProps {
  categories: TaxCategory[];
  isLoading?: boolean;
}

export default function TaxBreakdown({ categories, isLoading = false }: TaxBreakdownProps) {
  const { t } = useTranslation();

  // Format the data for the chart
  const chartData = categories.map((category) => ({
    name: category.name,
    value: parseFloat(category.amount.toString().replace(/[$,]/g, '')),
  }));

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-8">
      <CardHeader className="px-6 py-5 border-b border-neutral-200">
        <CardTitle className="text-lg font-medium text-neutral-800">
          {t("taxBreakdownByCategory")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="h-64 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-neutral-500">{t("loading")}</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="h-64 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
            <div className="text-center">
              <svg className="h-12 w-12 text-neutral-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-neutral-500">{t("noTaxDataAvailable")}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categories[index].color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, t("amount")]}
                    labelFormatter={(name) => t(`taxCategory.${name.toLowerCase()}`)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="mt-4 space-y-3">
              {categories.map((category, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-neutral-700">
                      {t(`taxCategory.${category.name.toLowerCase()}`)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-800">
                    {typeof category.amount === 'number' 
                      ? `$${category.amount.toLocaleString()}`
                      : category.amount}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
