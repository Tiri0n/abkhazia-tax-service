import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Loader2, User, Lock, Bell, Shield, Globe, CheckCircle, AlertTriangle } from "lucide-react";

// Personal information form schema
const personalInfoSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Security form schema
const securitySchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Notification preferences schema
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  appNotifications: z.boolean().default(true),
  deadlineReminders: z.boolean().default(true),
  paymentConfirmations: z.boolean().default(true),
  newDocuments: z.boolean().default(true),
  marketingUpdates: z.boolean().default(false),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type SecurityValues = z.infer<typeof securitySchema>;
type NotificationValues = z.infer<typeof notificationSchema>;

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Personal information form
  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  // Security form
  const securityForm = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notification preferences form
  const notificationForm = useForm<NotificationValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      appNotifications: true,
      deadlineReminders: true,
      paymentConfirmations: true,
      newDocuments: true,
      marketingUpdates: false,
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: PersonalInfoValues) => {
      // This would normally update the user's profile via the API
      const res = await apiRequest("PATCH", `/api/user/${user?.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: t("profileUpdateFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: SecurityValues) => {
      // This would normally change the password via the API
      // For demo purposes, we're just simulating a successful response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: t("passwordChanged"),
        description: t("passwordChangedDescription"),
      });
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordChanged(true);
    },
    onError: (error) => {
      toast({
        title: t("passwordChangeFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update notification preferences mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: NotificationValues) => {
      // This would normally update notification preferences via the API
      // For demo purposes, we're just simulating a successful response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: t("preferencesUpdated"),
        description: t("preferencesUpdatedDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: t("preferencesUpdateFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onPersonalInfoSubmit = (data: PersonalInfoValues) => {
    updateProfileMutation.mutateAsync(data);
  };

  const onSecuritySubmit = (data: SecurityValues) => {
    changePasswordMutation.mutateAsync(data);
  };

  const onNotificationSubmit = (data: NotificationValues) => {
    updateNotificationsMutation.mutateAsync(data);
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
        <BreadcrumbItem active>{t("settings")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("accountSettings")}</h1>
        <p className="mt-1 text-neutral-600">{t("manageYourAccountPreferences")}</p>
      </div>

      {/* Settings Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{t("profile")}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                <span>{t("security")}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span>{t("notifications")}</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-200">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-2xl font-bold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-neutral-500">{user?.email}</p>
                  <p className="text-neutral-500 text-sm mt-1">{t("taxId")}: {user?.taxId}</p>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      {t("uploadPhoto")}
                    </Button>
                  </div>
                </div>
              </div>
              
              <Form {...personalInfoForm}>
                <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={personalInfoForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("firstName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={personalInfoForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("lastName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phoneNumber")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("phoneNumberDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("address")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-primary-500 hover:bg-primary-600"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t("saving")}
                        </>
                      ) : (
                        t("saveChanges")
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("changePassword")}</h3>
                
                {passwordChanged && (
                  <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>{t("passwordUpdated")}</AlertTitle>
                    <AlertDescription>
                      {t("passwordUpdatedDescription")}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("currentPassword")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={securityForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("newPassword")}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={securityForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("confirmNewPassword")}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        className="bg-primary-500 hover:bg-primary-600"
                      >
                        {changePasswordMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t("updating")}
                          </>
                        ) : (
                          t("updatePassword")
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-medium">{t("twoFactorAuthentication")}</h3>
                <p className="text-sm text-neutral-600">{t("twoFactorDescription")}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa" className="font-medium">{t("enable2FA")}</Label>
                    <p className="text-sm text-neutral-500">{t("secureYourAccount")}</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-medium">{t("sessionManagement")}</h3>
                <p className="text-sm text-neutral-600">{t("sessionManagementDescription")}</p>
                
                <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t("currentSession")}</p>
                      <p className="text-sm text-neutral-500">{t("thisBrowser")}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">{t("active")}</Badge>
                  </div>
                </div>
                
                <Button variant="destructive">
                  {t("logoutAllDevices")}
                </Button>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-medium text-red-600">{t("dangerZone")}</h3>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t("deleteAccount")}</AlertTitle>
                  <AlertDescription>
                    {t("deleteAccountWarning")}
                  </AlertDescription>
                </Alert>
                
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  {t("requestAccountDeletion")}
                </Button>
              </div>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t("notificationChannels")}</h3>
                    
                    <div className="grid gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{t("emailNotifications")}</Label>
                              <p className="text-sm text-neutral-500">{t("emailNotificationsDescription")}</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{t("smsNotifications")}</Label>
                              <p className="text-sm text-neutral-500">{t("smsNotificationsDescription")}</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="appNotifications"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{t("appNotifications")}</Label>
                              <p className="text-sm text-neutral-500">{t("appNotificationsDescription")}</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t border-neutral-200">
                    <h3 className="text-lg font-medium">{t("notificationTypes")}</h3>
                    
                    <div className="grid gap-4">
                      <FormField
                        control={notificationForm.control}
                        name="deadlineReminders"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{t("deadlineReminders")}</Label>
                              <p className="text-sm text-neutral-500">{t("deadlineRemindersDescription")}</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="paymentConfirmations"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{t("paymentConfirmations")}</Label>
                              <p className="text-sm text-neutral-500">{t("paymentConfirmationsDescription")}</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="newDocuments"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{t("newDocuments")}</Label>
                              <p className="text-sm text-neutral-500">{t("newDocumentsDescription")}</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="marketingUpdates"
                        render={({ field }) => (
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{t("marketingUpdates")}</Label>
                              <p className="text-sm text-neutral-500">{t("marketingUpdatesDescription")}</p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateNotificationsMutation.isPending}
                      className="bg-primary-500 hover:bg-primary-600"
                    >
                      {updateNotificationsMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t("saving")}
                        </>
                      ) : (
                        t("savePreferences")
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Language Preferences */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("languagePreferences")}</CardTitle>
          <CardDescription>{t("changeDisplayLanguage")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Globe className="h-5 w-5 text-neutral-500" />
            <Select defaultValue="en">
              <SelectTrigger className="w-full md:w-[240px]">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">{t("apply")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy and Terms */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="text-sm text-neutral-500">
            <p>{t("privacyTermsDescription")}</p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-primary-600 hover:underline">{t("privacyPolicy")}</a>
              <a href="#" className="text-primary-600 hover:underline">{t("termsOfService")}</a>
              <a href="#" className="text-primary-600 hover:underline">{t("cookiePolicy")}</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
