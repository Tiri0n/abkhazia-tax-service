import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { FileText, BookOpen, Download, ExternalLink } from "lucide-react";

export default function EducationPage() {
  const { t } = useTranslation();

  // Tax guide categories with resources
  const taxGuides = [
    {
      id: "individual",
      title: t("individualTaxation"),
      description: t("individualTaxationDescription"),
      resources: [
        {
          id: "guide1",
          title: t("incomeDeclarationGuide"),
          description: t("incomeDeclarationGuideDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          id: "guide2",
          title: t("deductionsCreditsGuide"),
          description: t("deductionsCreditsGuideDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          id: "guide3",
          title: t("filingSelfEmployed"),
          description: t("filingSelfEmployedDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
    {
      id: "property",
      title: t("propertyTaxation"),
      description: t("propertyTaxationDescription"),
      resources: [
        {
          id: "guide4",
          title: t("propertyAssessmentGuide"),
          description: t("propertyAssessmentGuideDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          id: "guide5",
          title: t("propertyTaxDeductions"),
          description: t("propertyTaxDeductionsDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
    {
      id: "vehicle",
      title: t("vehicleTaxation"),
      description: t("vehicleTaxationDescription"),
      resources: [
        {
          id: "guide6",
          title: t("vehicleRegistrationFees"),
          description: t("vehicleRegistrationFeesDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          id: "guide7",
          title: t("vehicleImportDuties"),
          description: t("vehicleImportDutiesDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
    {
      id: "business",
      title: t("businessTaxation"),
      description: t("businessTaxationDescription"),
      resources: [
        {
          id: "guide8",
          title: t("corporateTaxGuide"),
          description: t("corporateTaxGuideDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          id: "guide9",
          title: t("vatRegistrationGuide"),
          description: t("vatRegistrationGuideDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          id: "guide10",
          title: t("employerResponsibilities"),
          description: t("employerResponsibilitiesDescription"),
          type: "pdf",
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
  ];

  // Educational videos
  const educationalVideos = [
    {
      id: "video1",
      title: t("taxFilingBasics"),
      description: t("taxFilingBasicsDescription"),
      duration: "15:24",
      thumbnail: "bg-neutral-200",
    },
    {
      id: "video2",
      title: t("understandingDeductions"),
      description: t("understandingDeductionsDescription"),
      duration: "12:18",
      thumbnail: "bg-neutral-200",
    },
    {
      id: "video3",
      title: t("propertyTaxExplained"),
      description: t("propertyTaxExplainedDescription"),
      duration: "08:45",
      thumbnail: "bg-neutral-200",
    },
    {
      id: "video4",
      title: t("taxPlanningStrategies"),
      description: t("taxPlanningStrategiesDescription"),
      duration: "17:32",
      thumbnail: "bg-neutral-200",
    },
  ];

  // Tax calculators and tools
  const taxTools = [
    {
      id: "tool1",
      title: t("incomeTaxCalculator"),
      description: t("incomeTaxCalculatorDescription"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mb-2 text-primary-500"><path d="M5 9h14M5 15h14M17 3v18M7 3v18" /></svg>,
    },
    {
      id: "tool2",
      title: t("propertyTaxEstimator"),
      description: t("propertyTaxEstimatorDescription"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mb-2 text-primary-500"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    },
    {
      id: "tool3",
      title: t("vehicleFeeCalculator"),
      description: t("vehicleFeeCalculatorDescription"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mb-2 text-primary-500"><path d="m7 11 4.5-4.5a2 2 0 0 1 3 3L10 14l-3 1 1-3Z" /><path d="M20.01 15.01A7 7 0 1 1 15 10" /></svg>,
    },
    {
      id: "tool4",
      title: t("businessTaxPlanner"),
      description: t("businessTaxPlannerDescription"),
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 mb-2 text-primary-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
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
        <BreadcrumbItem active>{t("taxEducation")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">{t("taxEducationAndResources")}</h1>
        <p className="mt-1 text-neutral-600">{t("learnAboutTaxLawsAndRegulations")}</p>
      </div>

      {/* Tax Education Tabs */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <Tabs defaultValue="guides" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="guides">{t("taxGuides")}</TabsTrigger>
              <TabsTrigger value="videos">{t("educationalVideos")}</TabsTrigger>
              <TabsTrigger value="tools">{t("calculatorsAndTools")}</TabsTrigger>
            </TabsList>
            
            {/* Tax Guides Tab */}
            <TabsContent value="guides" className="space-y-6">
              {taxGuides.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {category.resources.map((resource) => (
                        <Card key={resource.id} className="overflow-hidden">
                          <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                              {resource.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-neutral-800">{resource.title}</h4>
                              <p className="text-xs text-neutral-500">{resource.type.toUpperCase()} • {t("document")}</p>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <p className="text-sm text-neutral-600 mb-4">{resource.description}</p>
                            <Button variant="outline" size="sm" className="w-full justify-center">
                              <Download className="mr-2 h-4 w-4" />
                              {t("downloadGuide")}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* Educational Videos Tab */}
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educationalVideos.map((video) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className={`aspect-video ${video.thumbnail} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary-600 ml-1">
                            <polygon points="6 3 20 12 6 21" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-lg mb-1">{video.title}</h3>
                      <p className="text-sm text-neutral-600 mb-4">{video.description}</p>
                      <Button variant="outline" className="w-full justify-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {t("watchVideo")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Tax Calculators and Tools Tab */}
            <TabsContent value="tools">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {taxTools.map((tool) => (
                  <Card key={tool.id} className="p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                      {tool.icon}
                      <h3 className="font-medium text-lg mb-1">{tool.title}</h3>
                      <p className="text-sm text-neutral-600">{tool.description}</p>
                    </div>
                    <Button className="w-full bg-primary-500 hover:bg-primary-600">
                      {t("useTool")}
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tax Calendar Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("taxCalendar")}</CardTitle>
          <CardDescription>{t("importantTaxDeadlines")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex-shrink-0 bg-primary-100 text-primary-700 h-12 w-12 rounded-lg flex flex-col items-center justify-center font-medium mb-3 md:mb-0 md:mr-4">
                <span className="text-xs">APR</span>
                <span className="text-lg">15</span>
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{t("individualIncomeTaxDeadline")}</h4>
                <p className="text-sm text-neutral-600">{t("individualIncomeTaxDeadlineDescription")}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-3 md:mt-0 md:ml-4">
                <Calendar className="mr-2 h-4 w-4" />
                {t("addToCalendar")}
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex-shrink-0 bg-primary-100 text-primary-700 h-12 w-12 rounded-lg flex flex-col items-center justify-center font-medium mb-3 md:mb-0 md:mr-4">
                <span className="text-xs">JUN</span>
                <span className="text-lg">15</span>
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{t("estimatedTaxPayment")}</h4>
                <p className="text-sm text-neutral-600">{t("estimatedTaxPaymentDescription")}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-3 md:mt-0 md:ml-4">
                <Calendar className="mr-2 h-4 w-4" />
                {t("addToCalendar")}
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex-shrink-0 bg-primary-100 text-primary-700 h-12 w-12 rounded-lg flex flex-col items-center justify-center font-medium mb-3 md:mb-0 md:mr-4">
                <span className="text-xs">SEP</span>
                <span className="text-lg">15</span>
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">{t("corporateTaxDeadline")}</h4>
                <p className="text-sm text-neutral-600">{t("corporateTaxDeadlineDescription")}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-3 md:mt-0 md:ml-4">
                <Calendar className="mr-2 h-4 w-4" />
                {t("addToCalendar")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Resources */}
      <Card>
        <CardHeader>
          <CardTitle>{t("externalResources")}</CardTitle>
          <CardDescription>{t("additionalLearningResources")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">{t("taxCodeLibrary")}</h3>
                <p className="text-sm text-neutral-600 mb-4">{t("taxCodeLibraryDescription")}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t("visit")}
                </Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h10" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">{t("taxBlog")}</h3>
                <p className="text-sm text-neutral-600 mb-4">{t("taxBlogDescription")}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t("visit")}
                </Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" x2="8" y1="13" y2="13" />
                    <line x1="16" x2="8" y1="17" y2="17" />
                    <line x1="10" x2="8" y1="9" y2="9" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">{t("formDownloads")}</h3>
                <p className="text-sm text-neutral-600 mb-4">{t("formDownloadsDescription")}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t("visit")}
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
