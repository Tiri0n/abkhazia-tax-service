import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Loader2, User, Lock, CreditCard, KeySquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const { t } = useTranslation();
  const { loginMutation } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<string>("standard");

  // Standard login form
  const standardForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // INN/Passport login form
  const innPassportSchema = loginSchema.extend({
    inn: z.string().min(12, { message: "ИНН должен содержать 12 цифр" }),
    passportSeries: z.string().min(4, { message: "Введите серию паспорта" }),
    passportNumber: z.string().min(6, { message: "Введите номер паспорта" }),
  });
  
  const innForm = useForm({
    resolver: zodResolver(innPassportSchema),
    defaultValues: {
      inn: "",
      passportSeries: "",
      passportNumber: "",
    },
  });

  const onStandardSubmit = async (data: any) => {
    setAuthError(null);
    try {
      await loginMutation.mutateAsync(data);
    } catch (error: any) {
      setAuthError(error.message || t("loginError"));
    }
  };

  const onInnSubmit = async (data: any) => {
    setAuthError(null);
    try {
      // In real implementation, this would use a different authentication endpoint
      // For now, we're just using the same login mutation
      await loginMutation.mutateAsync({
        username: data.inn,
        password: `${data.passportSeries}${data.passportNumber}`,
      });
    } catch (error: any) {
      setAuthError(error.message || t("loginError"));
    }
  };

  const handleGosuslugiLogin = () => {
    // This would redirect to Gosuslugi OAuth in a real implementation
    alert("В реальном приложении это перенаправило бы вас на страницу авторизации Госуслуг");
  };

  return (
    <div className="space-y-6">
      {/* Gosuslugi login button */}
      <Button 
        onClick={handleGosuslugiLogin}
        className="w-full bg-[#0D4CD3] hover:bg-[#0A3DA5] text-white flex items-center justify-center"
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 32 32" className="mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white"/>
          <path d="M22.954 8H10.181C9.68982 8 9.29135 8.35579 9.29135 8.79447V18.5634C9.29135 19.0021 9.68982 19.3579 10.181 19.3579H22.954C23.4451 19.3579 23.8436 19.0021 23.8436 18.5634V8.79447C23.8436 8.35579 23.4451 8 22.954 8Z" fill="#0D4CD3"/>
          <path d="M21.272 11.0262H18.818V13.2448H21.272V11.0262Z" fill="white"/>
          <path d="M14.454 11.0262H12V13.2448H14.454V11.0262Z" fill="white"/>
          <path d="M17.909 11.0262H15.454V13.2448H17.909V11.0262Z" fill="white"/>
          <path d="M21.272 14.179H18.818V16.3977H21.272V14.179Z" fill="white"/>
          <path d="M14.454 14.179H12V16.3977H14.454V14.179Z" fill="white"/>
          <path d="M17.909 14.179H15.454V16.3977H17.909V14.179Z" fill="white"/>
          <path d="M16.6361 20.4186C16.6361 20.9579 16.8406 21.4754 17.2036 21.8581C17.5666 22.2407 18.0571 22.4552 18.5689 22.4552C19.0807 22.4552 19.5712 22.2407 19.9342 21.8581C20.2972 21.4754 20.5017 20.9579 20.5017 20.4186H16.6361Z" fill="#0D4CD3"/>
          <path d="M14.5014 22.4552V20.4186H16.6343V22.4552C16.6343 22.9944 16.4298 23.512 16.0668 23.8946C15.7038 24.2773 15.2133 24.4918 14.7015 24.4918C14.1897 24.4918 13.6992 24.2773 13.3362 23.8946C12.9732 23.512 12.7688 22.9944 12.7688 22.4552H14.5014Z" fill="#0D4CD3"/>
        </svg>
        {t("loginWithGosuslugi")}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("or")}
          </span>
        </div>
      </div>

      <Tabs value={loginMethod} onValueChange={setLoginMethod} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard" className="flex items-center justify-center">
            <User className="mr-2 h-4 w-4" />
            <span>{t("standardLogin")}</span>
          </TabsTrigger>
          <TabsTrigger value="inn" className="flex items-center justify-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{t("innLogin")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Standard login form */}
        <TabsContent value="standard">
          <Card>
            <CardContent className="pt-4">
              <Form {...standardForm}>
                <form onSubmit={standardForm.handleSubmit(onStandardSubmit)} className="space-y-4">
                  {authError && loginMethod === "standard" && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {authError}
                    </div>
                  )}

                  <FormField
                    control={standardForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("username")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("enterUsername")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={standardForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("password")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("enterPassword")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && loginMethod === "standard" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("loggingIn")}
                      </>
                    ) : (
                      t("login")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INN/Passport login form */}
        <TabsContent value="inn">
          <Card>
            <CardContent className="pt-4">
              <Form {...innForm}>
                <form onSubmit={innForm.handleSubmit(onInnSubmit)} className="space-y-4">
                  {authError && loginMethod === "inn" && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {authError}
                    </div>
                  )}

                  <FormField
                    control={innForm.control}
                    name="inn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("taxId")} (ИНН)</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789012" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={innForm.control}
                      name="passportSeries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("passportSeries")}</FormLabel>
                          <FormControl>
                            <Input placeholder="0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={innForm.control}
                      name="passportNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("passportNumber")}</FormLabel>
                          <FormControl>
                            <Input placeholder="000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && loginMethod === "inn" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("loggingIn")}
                      </>
                    ) : (
                      t("login")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
