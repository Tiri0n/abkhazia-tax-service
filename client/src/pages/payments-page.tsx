import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { format, parseISO } from "date-fns";
import { formatRussianDate, formatRubles } from "@/lib/utils";
import { CreditCard, Loader2, Plus, FileText, AlertTriangle, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function PaymentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("history");

  // Fetch payments history
  const { 
    data: payments = [], 
    isLoading: isLoadingPayments 
  } = useQuery({
    queryKey: ["/api/payments"],
    enabled: !!user,
  });

  // Fetch upcoming tax obligations
  const { 
    data: obligations = [], 
    isLoading: isLoadingObligations 
  } = useQuery({
    queryKey: ["/api/tax-obligations"],
    enabled: !!user,
  });

  // Filter for pending obligations only
  const pendingObligations = obligations.filter((obligation: any) => 
    obligation.status === "pending"
  );

  // Get payment status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50"><Check className="h-3 w-3 mr-1" /> {t("completed")}</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> {t("processing")}</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50"><X className="h-3 w-3 mr-1" /> {t("failed")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        <BreadcrumbItem active>{t("payments")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("payments")}</h1>
          <p className="mt-1 text-neutral-600">{t("manageYourTaxPayments")}</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          {t("makeNewPayment")}
        </Button>
      </div>

      {/* Payments Content */}
      <Card>
        <CardHeader className="px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="history">{t("paymentHistory")}</TabsTrigger>
              <TabsTrigger value="pending">
                {t("pendingObligations")}
                {pendingObligations.length > 0 && (
                  <span className="ml-2 bg-primary-100 text-primary-700 text-xs rounded-full px-2 py-0.5">
                    {pendingObligations.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <TabsContent value="history" className="m-0">
          {isLoadingPayments ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : payments.length === 0 ? (
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <CreditCard className="h-16 w-16 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                {t("noPaymentHistory")}
              </h3>
              <p className="text-neutral-500 max-w-md mb-6">
                {t("noPaymentsYet")}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("makeFirstPayment")}
              </Button>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("reference")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("amount")}</TableHead>
                    <TableHead>{t("method")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.reference}</TableCell>
                      <TableCell>{formatRussianDate(new Date(payment.date))}</TableCell>
                      <TableCell>{formatRubles(payment.amount)}</TableCell>
                      <TableCell className="capitalize">{payment.method.replace('_', ' ')}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          {t("receipt")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="m-0">
          {isLoadingObligations ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : pendingObligations.length === 0 ? (
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <Check className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                {t("noOutstandingObligations")}
              </h3>
              <p className="text-neutral-500 max-w-md">
                {t("allObligationsPaid")}
              </p>
            </CardContent>
          ) : (
            <div className="divide-y divide-neutral-200">
              {pendingObligations.map((obligation: any) => {
                const dueDate = new Date(obligation.dueDate);
                const isOverdue = dueDate < new Date();
                const daysUntilDue = Math.round((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={obligation.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-neutral-800 mr-2">
                            {obligation.name}
                          </h3>
                          {isOverdue ? (
                            <Badge variant="destructive" className="font-normal">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {t("overdue")}
                            </Badge>
                          ) : daysUntilDue <= 7 ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-normal">
                              {t("dueSoon")}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-neutral-600 mb-2">
                          {obligation.category.charAt(0).toUpperCase() + obligation.category.slice(1)} tax for {obligation.year || new Date().getFullYear()}
                        </p>
                        <div className="text-sm text-neutral-500">
                          {t("dueOn")}: {formatRussianDate(dueDate)}
                          {!isOverdue && daysUntilDue <= 30 && (
                            <span className="ml-2 text-amber-600 font-medium">
                              ({daysUntilDue} {t("daysLeft")})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                        <div className="text-2xl font-bold text-neutral-800 mb-2">
                          {formatRubles(obligation.amount)}
                        </div>
                        <Button className="bg-primary-500 hover:bg-primary-600">
                          {t("payNow")}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Card>

      {/* Payment methods section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t("acceptedPaymentMethods")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sberbank Online */}
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-[#eaf3ec] rounded-full flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="white"/>
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" stroke="#1a9f29" strokeWidth="1"/>
                <path d="M8.4 18V6H15.6C16.8 6 17.4 6.6 17.4 7.8C17.4 9 16.8 9.6 15.6 9.6H12.6V13.2H14.4C15.6 13.2 16.2 13.8 16.2 15C16.2 16.2 15.6 16.8 14.4 16.8H12.6V18H8.4Z" fill="#1a9f29"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentMethods.sberbank")}</h3>
              <p className="text-sm text-neutral-500">{t("instantPayment")}</p>
            </div>
          </Card>
          
          {/* Tinkoff */}
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-[#f9f3e8] rounded-full flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="white"/>
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" stroke="#FFE603" strokeWidth="1"/>
                <path d="M12 6C15.866 6 19 9.13401 19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9.13401 8.13401 6 12 6Z" fill="#FFDD2D"/>
                <path d="M12.5 10.5V15.5H11.5V10.5H12.5Z" fill="black"/>
                <path d="M12.5 8.5V9.5H11.5V8.5H12.5Z" fill="black"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentMethods.tinkoff")}</h3>
              <p className="text-sm text-neutral-500">Visa, MasterCard, МИР</p>
            </div>
          </Card>
          
          {/* YooMoney */}
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-[#e8f1f9] rounded-full flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="white"/>
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" stroke="#0055FF" strokeWidth="1"/>
                <path d="M7 7H11V17H7V7Z" fill="#0055FF"/>
                <path d="M13 12C13 9.79086 14.7909 8 17 8V16C14.7909 16 13 14.2091 13 12Z" fill="#0055FF"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentMethods.yoomoney")}</h3>
              <p className="text-sm text-neutral-500">{t("digitalWalletRu")}</p>
            </div>
          </Card>
          
          {/* QIWI */}
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-[#f7e8f9] rounded-full flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="white"/>
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" stroke="#FF8C00" strokeWidth="1"/>
                <path d="M7.5 6.5H16.5C17.0523 6.5 17.5 6.94772 17.5 7.5V16.5C17.5 17.0523 17.0523 17.5 16.5 17.5H7.5C6.94772 17.5 6.5 17.0523 6.5 16.5V7.5C6.5 6.94772 6.94772 6.5 7.5 6.5Z" fill="#FF8C00"/>
                <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="white"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentMethods.qiwi")}</h3>
              <p className="text-sm text-neutral-500">{t("electronicPayment")}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Security */}
      <Card className="mt-8 bg-primary-50 border-primary-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-primary-800 mb-2">{t("securePayments")}</h3>
              <p className="text-primary-700">
                {t("securePaymentsDescription")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
