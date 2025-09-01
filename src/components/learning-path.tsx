
"use client";

import { useState } from "react";
import { getTopicsForLanguage } from "@/ai/flows/get-topics-for-language";
import { getTopicInformation } from "@/ai/flows/get-topic-information";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, GraduationCap, X, ArrowLeft, BookCopy } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { CodeBlock } from "./code-block";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const languages = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Dart"
];

interface LearningPathProps {
    onExit: () => void;
}

export function LearningPath({ onExit }: LearningPathProps) {
  const [step, setStep] = useState<"language" | "topic" | "content">("language");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [topicContent, setTopicContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageSelect = async () => {
    if (!selectedLanguage) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTopicsForLanguage({ language: selectedLanguage });
      setTopics(result.topics);
      setStep("topic");
    } catch (err) {
      setError("Failed to fetch topics. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTopicInformation({ language: selectedLanguage, topic });
      setTopicContent(result);
      setStep("content");
    } catch (err) {
      setError("Failed to fetch topic information. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    if (step === 'content') {
        setStep('topic');
        setTopicContent(null);
        setSelectedTopic("");
    } else if (step === 'topic') {
        setStep('language');
        setTopics([]);
    }
  }


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
                {step === 'topic' ? `Fetching topics for ${selectedLanguage}...` : `Fetching content for ${selectedTopic}...`}
            </p>
        </div>
      )
    }

    if (error) {
         return (
             <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={handleBack} variant="outline" className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>
            </div>
         )
    }

    if (step === "language") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex flex-col items-center justify-center">
                <div className="p-3 mb-4 bg-primary/10 rounded-full">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Start Your Learning Path</CardTitle>
                <CardDescription className="mt-2">Select a programming language to see available topics.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language..." />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleLanguageSelect} disabled={!selectedLanguage || isLoading}>
                  Fetch Topics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (step === "topic") {
      return (
          <div className="p-8">
              <h2 className="text-3xl font-bold mb-1">Topics for {selectedLanguage}</h2>
              <p className="text-muted-foreground mb-6">Select a topic to learn more about it.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map(topic => (
                    <Card key={topic} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTopicSelect(topic)}>
                        <CardContent className="p-6 flex items-center gap-4">
                            <BookCopy className="h-6 w-6 text-primary" />
                            <h3 className="text-lg font-semibold">{topic}</h3>
                        </CardContent>
                    </Card>
                ))}
              </div>
          </div>
      );
    }

    if (step === "content" && topicContent) {
        return (
            <ScrollArea className="h-full">
                <div className="p-8 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">{topicContent.title}</h1>
                    <p className="text-lg text-muted-foreground mb-8">{topicContent.introduction}</p>

                    {topicContent.sections.map((section: any, index: number) => (
                        <div key={index} className="mb-8">
                            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">{section.title}</h2>
                            <p className="mb-4 whitespace-pre-line">{section.explanation}</p>
                            {section.codeExample && (
                                <CodeBlock code={section.codeExample} language={selectedLanguage.toLowerCase()} />
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        )
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full relative">
        <div className="absolute top-4 right-4 flex gap-2">
            {(step === 'topic' || step === 'content') && (
                <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit learning path">
                <X className="h-5 w-5" />
            </Button>
        </div>
        {renderContent()}
    </div>
  )
}
