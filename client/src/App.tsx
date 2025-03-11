import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import DocumentsPage from "@/pages/documents-page";
import PaymentsPage from "@/pages/payments-page";
import InquiriesPage from "@/pages/inquiries-page";
import NotificationsPage from "@/pages/notifications-page";
import FAQPage from "@/pages/faq-page";
import EducationPage from "@/pages/education-page";
import SupportPage from "@/pages/support-page";
import SettingsPage from "@/pages/settings-page";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/documents" component={DocumentsPage} />
      <ProtectedRoute path="/payments" component={PaymentsPage} />
      <ProtectedRoute path="/inquiries" component={InquiriesPage} />
      <ProtectedRoute path="/notifications" component={NotificationsPage} />
      <ProtectedRoute path="/faq" component={FAQPage} />
      <ProtectedRoute path="/education" component={EducationPage} />
      <ProtectedRoute path="/support" component={SupportPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
