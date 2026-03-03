"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, FileText, Download, Calendar, Users, Hash, Tag, Info } from 'lucide-react';
import { summarizePdfContent, type SummarizePdfContentOutput } from '@/ai/flows/summarize-pdf-content-flow';
import { extractKeyInformationFromPdf, type ExtractKeyInformationFromPdfOutput } from '@/ai/flows/extract-key-information-from-pdf';
import { useToast } from '@/hooks/use-toast';

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    summary?: string;
    keyInfo?: ExtractKeyInformationFromPdfOutput['keyInformation'];
  } | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFile(files[0] || null);
    setResult(null);
  };

  const readFileAsDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async (type: 'summary' | 'info') => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const pdfDataUri = await readFileAsDataUri(selectedFile);
      
      if (type === 'summary') {
        const output = await summarizePdfContent({ pdfDataUri });
        setResult({ summary: output.summary });
      } else {
        const output = await extractKeyInformationFromPdf({ pdfDataUri });
        setResult({ summary: output.summary, keyInfo: output.keyInformation });
      }
      
      toast({
        title: "Analysis complete",
        description: "Your document has been analyzed successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "There was an error processing your PDF document.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg mb-2">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">AI Content Analysis</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get instant summaries and extract vital information from any PDF document using advanced AI.
            </p>
          </div>

          {!result ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <FileDropzone 
                onFilesSelected={handleFilesSelected} 
                maxFiles={1} 
                isLoading={isLoading} 
              />
              
              {selectedFile && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => handleAnalyze('summary')}
                    disabled={isLoading}
                    className="w-full sm:w-auto min-w-[200px]"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Summarize Only
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => handleAnalyze('info')}
                    disabled={isLoading}
                    className="w-full sm:w-auto min-w-[200px] border-accent text-accent hover:bg-accent/5"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Info className="mr-2 h-4 w-4" />}
                    Extract Full Info
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{selectedFile?.name}</h2>
                    <p className="text-sm text-muted-foreground">Processed with PDF Spark AI</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setResult(null)}>Analyze New File</Button>
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="details" disabled={!result.keyInfo}>Detailed Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-headline">Document Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {result.summary}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {result.keyInfo && (
                  <TabsContent value="details" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                          <Users className="h-5 w-5 text-accent" />
                          <CardTitle className="text-lg">Names & Organizations</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          {result.keyInfo.names.map((name, i) => (
                            <Badge key={i} variant="secondary" className="px-3 py-1">{name}</Badge>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                          <Calendar className="h-5 w-5 text-accent" />
                          <CardTitle className="text-lg">Important Dates</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          {result.keyInfo.dates.map((date, i) => (
                            <Badge key={i} variant="outline" className="px-3 py-1">{date}</Badge>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                          <Hash className="h-5 w-5 text-accent" />
                          <CardTitle className="text-lg">Critical Figures</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          {result.keyInfo.figures.map((figure, i) => (
                            <Badge key={i} className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1">{figure}</Badge>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                          <Tag className="h-5 w-5 text-accent" />
                          <CardTitle className="text-lg">Keywords</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          {result.keyInfo.keywords.map((kw, i) => (
                            <Badge key={i} variant="outline" className="px-3 py-1">{kw}</Badge>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    {result.keyInfo.other.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Other Significant Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {result.keyInfo.other.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                )}
              </Tabs>
              
              <div className="flex justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download Analysis Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}