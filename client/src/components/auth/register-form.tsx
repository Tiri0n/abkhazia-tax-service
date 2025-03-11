import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

// Extended schema with password confirmation
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { t } = useTranslation();
  const { registerMutation } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      taxId: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setAuthError(null);
    // Remove confirmPassword as it's not part of the API model
    const { confirmPassword, ...registerData } = data;
    
    try {
      await registerMutation.mutateAsync(registerData);
    } catch (error: any) {
      setAuthError(error.message || t("registrationError"));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {authError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterFirstName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("enterLastName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("enterEmail")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("username")}</FormLabel>
              <FormControl>
                <Input placeholder={t("chooseUsername")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("taxId")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterTaxId")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("choosePassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("confirmYourPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phoneNumber")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterPhoneNumber")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterAddress")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-primary-500 hover:bg-primary-600"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("registering")}
            </>
          ) : (
            t("register")
          )}
        </Button>
      </form>
    </Form>
  );
}
