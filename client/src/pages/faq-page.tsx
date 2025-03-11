import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ Categories with questions and answers
  const faqCategories = [
    {
      id: "general",
      title: t("generalQuestions"),
      faqs: [
        {
          id: "faq1",
          question: t("whatIsTaxService"),
          answer: t("taxServiceAnswer"),
        },
        {
          id: "faq2",
          question: t("howToCreateAccount"),
          answer: t("createAccountAnswer"),
        },
        {
          id: "faq3",
          question: t("forgotPassword"),
          answer: t("forgotPasswordAnswer"),
        },
      ],
    },
    {
      id: "payments",
      title: t("paymentQuestions"),
      faqs: [
        {
          id: "faq4",
          question: t("acceptedPaymentMethods"),
          answer: t("acceptedPaymentMethodsAnswer"),
        },
        {
          id: "faq5",
          question: t("paymentDeadlines"),
          answer: t("paymentDeadlinesAnswer"),
        },
        {
          id: "faq6",
          question: t("paymentConfirmation"),
          answer: t("paymentConfirmationAnswer"),
        },
        {
          id: "faq7",
          question: t("missedPayment"),
          answer: t("missedPaymentAnswer"),
        },
      ],
    },
    {
      id: "documents",
      title: t("documentQuestions"),
      faqs: [
        {
          id: "faq8",
          question: t("downloadDocuments"),
          answer: t("downloadDocumentsAnswer"),
        },
        {
          id: "faq9",
          question: t("uploadDocuments"),
          answer: t("uploadDocumentsAnswer"),
        },
        {
          id: "faq10",
          question: t("documentTypes"),
          answer: t("documentTypesAnswer"),
        },
      ],
    },
    {
      id: "taxRules",
      title: t("taxRulesQuestions"),
      faqs: [
        {
          id: "faq11",
          question: t("taxRateCalculation"),
          answer: t("taxRateCalculationAnswer"),
        },
        {
          id: "faq12",
          question: t("taxDeductions"),
          answer: t("taxDeductionsAnswer"),
        },
        {
          id: "faq13",
          question: t("annualFilingRequirements"),
          answer: t("annualFilingRequirementsAnswer"),
        },
      ],
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqCategories.map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((category) => category.faqs.length > 0)
    : faqCategories;

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
        <BreadcrumbItem active>{t("faqs")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("frequentlyAskedQuestions")}</h1>
        <p className="mt-1 text-neutral-600">{t("findAnswersToCommonQuestions")}</p>
      </div>

      {/* Search bar */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder={t("searchFAQs")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Content */}
      {filteredFaqs.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">
              {t("noResultsFound")}
            </h3>
            <p className="text-neutral-500 max-w-md mb-6">
              {t("tryDifferentSearchTerms")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {filteredFaqs.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-4">
                  {category.faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-md px-4">
                      <AccordionTrigger className="text-left py-4 hover:no-underline font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pt-1 text-neutral-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Still have questions section */}
      <Card className="mt-8 bg-primary-50 border-primary-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <div className="text-center md:text-left md:flex-1">
              <h3 className="text-lg font-medium text-primary-800 mb-2">{t("stillHaveQuestions")}</h3>
              <p className="text-primary-700 mb-4 md:mb-0">{t("cantFindAnswer")}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <a href="/support" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                {t("contactSupport")}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
