import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { MessageSquare, FileText, Loader2, Plus, FileUp, Paperclip } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";

// Status badge colors
const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{status}</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{status}</Badge>;
    case "resolved":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Form schema for inquiry submission
const inquirySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  supportDocuments: z.array(z.any()).optional(),
});

export default function InquiriesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch inquiries
  const { 
    data: inquiries = [], 
    isLoading 
  } = useQuery({
    queryKey: ["/api/inquiries"],
    enabled: !!user,
  });

  // Form handling
  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      subject: "",
      message: "",
      supportDocuments: [],
    },
  });

  // Create inquiry mutation
  const createInquiryMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/inquiries", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof inquirySchema>) => {
    createInquiryMutation.mutateAsync({
      subject: data.subject,
      message: data.message,
      status: "open",
      supportDocuments: data.supportDocuments || [],
    });
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
        <BreadcrumbItem active>{t("inquiries")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("inquiries")}</h1>
          <p className="mt-1 text-neutral-600">{t("submitAndTrackInquiries")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600">
              <Plus className="mr-2 h-4 w-4" />
              {t("newInquiry")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{t("submitNewInquiry")}</DialogTitle>
              <DialogDescription>
                {t("fillInDetailsBelow")}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("subject")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("enterSubject")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("message")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("detailYourInquiry")}
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supportDocuments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("uploadSupportingDocuments")}</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-neutral-200 rounded-md p-6 text-center">
                          <FileUp className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                          <p className="text-sm text-neutral-600 mb-1">
                            {t("dragAndDropFiles")}
                          </p>
                          <p className="text-xs text-neutral-500 mb-2">
                            {t("maxFileSize")}
                          </p>
                          <Button type="button" variant="outline" size="sm" className="mt-2">
                            <Paperclip className="h-4 w-4 mr-1" />
                            {t("browseFiles")}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t("allowedFileTypes")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createInquiryMutation.isPending}
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    {createInquiryMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t("submitting")}</>
                    ) : (
                      t("submitInquiry")
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inquiries Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : inquiries.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-16 w-16 text-neutral-300 mb-4" />
            <h3 className="text-lg font-medium text-neutral-800 mb-2">
              {t("noInquiriesYet")}
            </h3>
            <p className="text-neutral-500 max-w-md mb-6">
              {t("submitFirstInquiry")}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("submitNewInquiry")}
                </Button>
              </DialogTrigger>
              <DialogContent>{/* Dialog content */}</DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {inquiries.map((inquiry: any) => (
            <Card key={inquiry.id}>
              <CardHeader className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">{inquiry.subject}</CardTitle>
                    <CardDescription>
                      {t("submitted")}: {format(new Date(inquiry.date), "PPP")}
                    </CardDescription>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {getStatusBadge(inquiry.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="bg-neutral-50 p-4 rounded-md mb-4">
                  <p className="text-neutral-700 whitespace-pre-line">{inquiry.message}</p>
                </div>
                
                {inquiry.supportDocuments && inquiry.supportDocuments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-neutral-800 mb-2">{t("attachedDocuments")}</h4>
                    <div className="space-y-2">
                      {inquiry.supportDocuments.map((doc: any, idx: number) => (
                        <div key={idx} className="flex items-center p-2 bg-neutral-50 rounded-md">
                          <FileText className="h-4 w-4 text-neutral-500 mr-2" />
                          <span className="text-sm text-neutral-600">{doc.filename}</span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            {t("download")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {inquiry.status === "resolved" ? (
                  <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-md">
                    <h4 className="text-sm font-medium text-green-800 mb-1">{t("inquiryResolved")}</h4>
                    <p className="text-sm text-green-700">
                      {t("thanksForInquiry")}
                    </p>
                  </div>
                ) : inquiry.status === "in_progress" ? (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-md">
                    <h4 className="text-sm font-medium text-amber-800 mb-1">{t("inquiryInProgress")}</h4>
                    <p className="text-sm text-amber-700">
                      {t("agentWorkingOnInquiry")}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">{t("inquiryReceived")}</h4>
                    <p className="text-sm text-blue-700">
                      {t("inquiryUnderReview")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
