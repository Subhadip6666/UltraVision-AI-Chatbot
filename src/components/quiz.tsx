
"use client";

import { useState } from "react";
import { generateQuiz, type QuizQuestion } from "@/ai/flows/generate-quiz";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Loader2, BookOpenCheck, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

const languages = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Dart"
];

interface QuizProps {
    onExitQuiz: () => void;
}

export function Quiz({ onExitQuiz }: QuizProps) {
  const [language, setLanguage] = useState<string>("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleStartQuiz = async () => {
    if (!language) return;

    setIsLoading(true);
    setError(null);
    setQuiz([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);

    try {
      const result = await generateQuiz({ language });
      setQuiz(result.questions);
    } catch (err) {
      setError("Failed to generate the quiz. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      // End of quiz
      handleFinishQuiz();
    }
  };
  
  const handleFinishQuiz = () => {
    setQuiz([]);
    setLanguage("");
  }


  const currentQuestion = quiz[currentQuestionIndex];

  if (quiz.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex flex-col items-center justify-center">
                  <div className="p-3 mb-4 bg-primary/10 rounded-full">
                    <BookOpenCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Programming Quiz</CardTitle>
                  <CardDescription className="mt-2">Select a language to test your knowledge.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                <Select onValueChange={setLanguage} value={language}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select a language..." />
                    </SelectTrigger>
                    <SelectContent>
                    {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <div className="flex gap-2">
                    <Button onClick={handleStartQuiz} disabled={!language || isLoading} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Start Quiz"}
                    </Button>
                     <Button variant="outline" onClick={onExitQuiz} className="w-full">
                        Exit
                    </Button>
                </div>
                </div>
                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
        <Card className="w-full max-w-2xl relative">
             <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onExitQuiz}>
                <X className="h-4 w-4" />
                <span className="sr-only">Exit Quiz</span>
            </Button>
            <CardHeader>
                <CardTitle>Quiz: {language}</CardTitle>
                <CardDescription>Question {currentQuestionIndex + 1} of {quiz.length}</CardDescription>
            </CardHeader>
            <CardContent>
                <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
                
                <RadioGroup 
                  value={selectedAnswer ?? ''}
                  onValueChange={setSelectedAnswer}
                  disabled={showAnswer}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {showAnswer && (
                  <div className={cn("mt-4 p-4 rounded-md", selectedAnswer === currentQuestion.correctAnswer ? "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300")}>
                    <h4 className="font-bold">
                        {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}
                    </h4>
                    <p>The correct answer is: <strong>{currentQuestion.correctAnswer}</strong></p>
                    <p className="mt-2 text-sm">{currentQuestion.explanation}</p>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end gap-2">
                    {showAnswer ? (
                         <Button onClick={handleNextQuestion}>
                            {currentQuestionIndex < quiz.length - 1 ? "Next Question" : "Finish Quiz"}
                        </Button>
                    ) : (
                        <Button onClick={() => setShowAnswer(true)} disabled={!selectedAnswer}>
                            Check Answer
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
