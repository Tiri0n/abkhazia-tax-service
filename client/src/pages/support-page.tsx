import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MessageSquare, PhoneCall, Mail, Clock, FileUp, Paperclip, CheckCircle } from "lucide-react";

// Form schema for support request
const supportSchema = z.object({
  subject: z.string().min(1, { message: "Subject is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  supportDocuments: z.array(z.any()).optional(),
});

type SupportFormValues = z.infer<typeof supportSchema>;

export default function SupportPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form handling
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      subject: "",
      category: "",
      message: "",
      supportDocuments: [],
    },
  });

  // Create support request mutation
  const createSupportRequestMutation = useMutation({
    mutationFn: async (data: SupportFormValues) => {
      // This would normally submit to the support API endpoint
      const res = await apiRequest("POST", "/api/inquiries", {
        subject: data.subject,
        message: data.message,
        status: "open",
        supportDocuments: data.supportDocuments || [],
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t("supportRequestSubmitted"),
        description: t("supportRequestSubmittedDescription"),
      });
      setIsSubmitted(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: t("supportRequestFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: SupportFormValues) => {
    createSupportRequestMutation.mutateAsync(data);
  };

  // Contact channels
  const contactChannels = [
    {
      icon: <PhoneCall className="h-6 w-6" />,
      title: t("phoneSupport"),
      description: t("phoneSupportDescription"),
      detail: "+1 (555) 123-4567",
      hours: t("mondayToFriday"),
      buttonText: t("callNow"),
      buttonAction: "tel:+15551234567",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: t("chatSupport"),
      description: t("chatSupportDescription"),
      detail: t("availableNow"),
      hours: t("247Support"),
      buttonText: t("startChat"),
      buttonAction: "#chat",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: t("emailSupport"),
      description: t("emailSupportDescription"),
      detail: "support@taxservice.gov",
      hours: t("responseTime24h"),
      buttonText: t("sendEmail"),
      buttonAction: "mailto:support@taxservice.gov",
    },
  ];

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
        <BreadcrumbItem href="/resources">{t("resources")}</BreadcrumbItem>
        <BreadcrumbItem active>{t("support")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("taxSupport")}</h1>
        <p className="mt-1 text-neutral-600">{t("getHelpWithTaxRelatedQuestions")}</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contactChannels.map((channel, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                  {channel.icon}
                </div>
                <h3 className="font-medium text-lg mb-1">{channel.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">{channel.description}</p>
                <div className="font-medium text-neutral-800 mb-1">{channel.detail}</div>
                <div className="flex items-center text-xs text-neutral-500 mb-4">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{channel.hours}</span>
                </div>
                <Button
                  asChild
                  className="w-full justify-center bg-primary-500 hover:bg-primary-600"
                >
                  <a href={channel.buttonAction}>
                    {channel.buttonText}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Request Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("submitSupportRequest")}</CardTitle>
          <CardDescription>{t("fillOutFormBelow")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-neutral-800 mb-2">
                {t("thankYouForReachingOut")}
              </h3>
              <p className="text-neutral-600 max-w-md mb-6">
                {t("supportRequestConfirmation")}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
              >
                {t("submitAnotherRequest")}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("category")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectCategory")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tax_filing">{t("taxFiling")}</SelectItem>
                            <SelectItem value="payment">{t("payment")}</SelectItem>
                            <SelectItem value="documents">{t("documents")}</SelectItem>
                            <SelectItem value="account">{t("account")}</SelectItem>
                            <SelectItem value="other">{t("other")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("message")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("detailYourIssue")}
                          rows={6}
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
                
                <Button 
                  type="submit" 
                  disabled={createSupportRequestMutation.isPending}
                  className="w-full bg-primary-500 hover:bg-primary-600"
                >
                  {createSupportRequestMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("submitRequest")
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("frequentlyAskedQuestions")}</CardTitle>
          <CardDescription>{t("quickAnswersToCommonQuestions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-neutral-800 mb-1">{t("howToUpdatePersonalInfo")}</h3>
              <p className="text-sm text-neutral-600">{t("updatePersonalInfoAnswer")}</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-800 mb-1">{t("paymentMethodsQuestion")}</h3>
              <p className="text-sm text-neutral-600">{t("paymentMethodsAnswer")}</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-800 mb-1">{t("taxRefundTimelineQuestion")}</h3>
              <p className="text-sm text-neutral-600">{t("taxRefundTimelineAnswer")}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-neutral-50 border-t border-neutral-200 flex justify-center">
          <Button variant="link" asChild>
            <a href="/faq">{t("viewAllFAQs")}</a>
          </Button>
        </CardFooter>
      </Card>
    </MainLayout>
  );
}
