import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/shared/language-selector";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header for auth page */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500 h-6 w-6 mr-2">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              <path d="M12 7V3" />
              <path d="M3 8v7.5a1.5 1.5 0 0 0 3 0v-4.5" />
              <path d="M18 10v3.5a1.5 1.5 0 0 0 3 0" />
            </svg>
            <span className="font-semibold text-primary-500 text-xl">{t("appName")}</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left column - Auth forms */}
        <div className="w-full lg:w-1/2 py-12 px-4 sm:px-6 lg:px-12 flex items-center justify-center">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {activeTab === "login" ? t("login") : t("register")}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? t("welcomeToTaxService")
                  : t("createAnAccount")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">{t("login")}</TabsTrigger>
                  <TabsTrigger value="register">{t("register")}</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Hero section */}
        <div className="hidden lg:block lg:w-1/2 bg-primary-600">
          <div className="h-full flex flex-col justify-center p-12">
            <div className="text-white max-w-lg mx-auto">
              <h1 className="text-4xl font-bold mb-6">
                {t("manageYourTaxesEfficiently")}
              </h1>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t("checkTaxStatus")}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t("receiveNotifications")}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t("makeOnlinePayments")}</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t("manageTaxDocuments")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-4">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-neutral-500">
                &copy; {new Date().getFullYear()} {t("footerCopyright")}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">
                {t("privacyPolicy")}
              </a>
              <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">
                {t("termsOfService")}
              </a>
              <a href="#" className="text-sm text-neutral-500 hover:text-primary-500">
                {t("accessibility")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
