import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { format, parseISO } from "date-fns";
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
                      <TableCell>{format(new Date(payment.date), "PPP")}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
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
                          {t("dueOn")}: {format(dueDate, "PPP")}
                          {!isOverdue && daysUntilDue <= 30 && (
                            <span className="ml-2 text-amber-600 font-medium">
                              ({daysUntilDue} {t("daysLeft")})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                        <div className="text-2xl font-bold text-neutral-800 mb-2">
                          {obligation.amount}
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
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("creditCard")}</h3>
              <p className="text-sm text-neutral-500">Visa, Mastercard, Amex</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("bankTransfer")}</h3>
              <p className="text-sm text-neutral-500">ACH, Wire Transfer</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("digitalWallet")}</h3>
              <p className="text-sm text-neutral-500">PayPal, Apple Pay</p>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center">
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V7a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1" />
                <path d="M22 7.8c-.2-2-1.8-2.8-3-2.8h-1a2.4 2.4 0 0 0-2.4 2.8V8h4.8" />
                <path d="M6.8 8h4.4V7a2.4 2.4 0 0 0-2.4-2.8H7.8" />
                <path d="M8 6v.8A.8.8 0 0 1 7.2 8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="m8 12 2 2 6-3" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">{t("paymentVoucher")}</h3>
              <p className="text-sm text-neutral-500">{t("inPersonPayment")}</p>
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
