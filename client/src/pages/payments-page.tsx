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
          {/* Sberbank */}
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
              <p className="text-sm text-neutral-500">{t("bankTransferRu")}</p>
            </div>
          </Card>
          
          {/* VTB Bank */}
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-[#e8eef9] rounded-full flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="white"/>
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" stroke="#0055AA" strokeWidth="1"/>
                <path d="M6 9.5H18V14.5H6V9.5Z" fill="#0055AA"/>
                <path d="M10 11.5H14V12.5H10V11.5Z" fill="white"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentMethods.vtb")}</h3>
              <p className="text-sm text-neutral-500">{t("bankTransferRu")}</p>
            </div>
          </Card>
          
          {/* Promsvyazbank */}
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-[#e8f1f5] rounded-full flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="white"/>
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" stroke="#165a7e" strokeWidth="1"/>
                <path d="M11 6H8V18H11V6Z" fill="#165a7e"/>
                <path d="M16 6H13V18H16V6Z" fill="#165a7e"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentMethods.psb")}</h3>
              <p className="text-sm text-neutral-500">{t("bankTransferRu")}</p>
            </div>
          </Card>
          
          {/* APRA */}
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-[#f1f3f9] rounded-full flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="white"/>
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" stroke="#293896" strokeWidth="1"/>
                <path d="M7 12L10 8H14L17 12L14 16H10L7 12Z" fill="#293896"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentMethods.apra")}</h3>
              <p className="text-sm text-neutral-500">{t("localPaymentSystem")}</p>
            </div>
          </Card>
          
          {/* Cash Payment */}
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-[#f6f8e8] rounded-full flex items-center justify-center mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" fill="white"/>
                <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12Z" stroke="#587c2c" strokeWidth="1"/>
                <path d="M12 6C13.1046 6 14 6.89543 14 8V8.5C15.1046 8.5 16 9.39543 16 10.5V14.5C16 15.6046 15.1046 16.5 14 16.5H10C8.89543 16.5 8 15.6046 8 14.5V10.5C8 9.39543 8.89543 8.5 10 8.5V8C10 6.89543 10.8954 6 12 6ZM12 7C11.4477 7 11 7.44772 11 8V8.5H13V8C13 7.44772 12.5523 7 12 7ZM10 9.5C9.44772 9.5 9 9.94772 9 10.5V14.5C9 15.0523 9.44772 15.5 10 15.5H14C14.5523 15.5 15 15.0523 15 14.5V10.5C15 9.94772 14.5523 9.5 14 9.5H10ZM12 11.5C12.5523 11.5 13 11.9477 13 12.5C13 13.0523 12.5523 13.5 12 13.5C11.4477 13.5 11 13.0523 11 12.5C11 11.9477 11.4477 11.5 12 11.5Z" fill="#587c2c"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentMethods.cash")}</h3>
              <p className="text-sm text-neutral-500">{t("offlinePayment")}</p>
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
