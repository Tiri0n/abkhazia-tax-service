import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { formatRussianDate } from "@/lib/utils";
import { Search, Download, FileText, File, FileSpreadsheet, FilePlus, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Document type icon mapping
const documentTypeIcons: { [key: string]: React.ReactNode } = {
  tax_return: <FileText className="h-5 w-5" />,
  receipt: <File className="h-5 w-5" />,
  assessment: <FileSpreadsheet className="h-5 w-5" />,
  statement: <FileText className="h-5 w-5" />,
  debt_notice: <FileText className="h-5 w-5 text-red-500" />,
  ndfl_2: <FileText className="h-5 w-5 text-blue-500" />,
};

export default function DocumentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Fetch documents data
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["/api/documents"],
    enabled: !!user,
  });

  // Create list of available years from documents
  const availableYears = Array.from(
    new Set(documents.map((doc: any) => doc.year))
  ).sort((a, b) => b - a); // Sort descending

  // Filter documents based on search term, year, and type
  const filteredDocuments = documents.filter((doc: any) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === "all" || doc.year.toString() === yearFilter;
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    
    return matchesSearch && matchesYear && matchesType;
  });

  // Group documents by type for the tabbed view
  const documentsByType: { [key: string]: any[] } = {};
  
  filteredDocuments.forEach((doc: any) => {
    if (!documentsByType[doc.type]) {
      documentsByType[doc.type] = [];
    }
    documentsByType[doc.type].push(doc);
  });

  // Get the document icon based on type
  const getDocumentIcon = (type: string) => {
    return documentTypeIcons[type] || <File className="h-5 w-5" />;
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
        <BreadcrumbItem active>{t("taxDocuments")}</BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{t("taxDocuments")}</h1>
          <p className="mt-1 text-neutral-600">{t("viewAndDownloadDocuments")}</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600">
          <FilePlus className="mr-2 h-4 w-4" />
          {t("uploadDocument")}
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder={t("searchDocuments")}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterByYear")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allYears")}</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTypes")}</SelectItem>
                <SelectItem value="tax_return">{t("documentTypes.tax_return")}</SelectItem>
                <SelectItem value="receipt">{t("documentTypes.receipt")}</SelectItem>
                <SelectItem value="assessment">{t("documentTypes.assessment")}</SelectItem>
                <SelectItem value="statement">{t("documentTypes.statement")}</SelectItem>
                <SelectItem value="debt_notice">{t("documentTypes.debt_notice")}</SelectItem>
                <SelectItem value="ndfl_2">{t("documentTypes.ndfl_2")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="h-16 w-16 text-neutral-300 mb-4" />
            <h3 className="text-lg font-medium text-neutral-800 mb-2">
              {t("noDocumentsFound")}
            </h3>
            <p className="text-neutral-500 max-w-md mb-6">
              {searchTerm || yearFilter !== "all" || typeFilter !== "all"
                ? t("noDocumentsMatchFilters")
                : t("noDocumentsYet")}
            </p>
            {searchTerm || yearFilter !== "all" || typeFilter !== "all" ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setYearFilter("all");
                  setTypeFilter("all");
                }}
              >
                {t("clearFilters")}
              </Button>
            ) : (
              <Button>
                <FilePlus className="mr-2 h-4 w-4" />
                {t("uploadFirstDocument")}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-0">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">{t("allDocuments")}</TabsTrigger>
                {Object.keys(documentsByType).map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {t(`documentTypes.${type.toLowerCase()}`)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="all" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("type")}</TableHead>
                    <TableHead>{t("year")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell className="flex items-center">
                        {getDocumentIcon(doc.type)}
                        <span className="ml-2">{doc.title}</span>
                      </TableCell>
                      <TableCell>{t(`documentTypes.${doc.type.toLowerCase()}`)}</TableCell>
                      <TableCell>{doc.year}</TableCell>
                      <TableCell>{formatRussianDate(new Date(doc.uploadDate))}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" />
                            {t("download")}
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Tabs for each document type */}
            {Object.keys(documentsByType).map((type) => (
              <TabsContent key={type} value={type} className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("name")}</TableHead>
                      <TableHead>{t("year")}</TableHead>
                      <TableHead>{t("date")}</TableHead>
                      <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentsByType[type].map((doc: any) => (
                      <TableRow key={doc.id}>
                        <TableCell className="flex items-center">
                          {getDocumentIcon(doc.type)}
                          <span className="ml-2">{doc.title}</span>
                        </TableCell>
                        <TableCell>{doc.year}</TableCell>
                        <TableCell>{formatRussianDate(new Date(doc.uploadDate))}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-1" />
                              {t("download")}
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
}
