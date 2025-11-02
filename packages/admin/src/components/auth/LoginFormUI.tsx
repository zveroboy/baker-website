"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FAQFormProps = {
  initialData?: {
    id: string;
    question: string;
    answer: string;
  };
  mode: "create" | "edit";
};

export function FAQForm({ initialData, mode }: FAQFormProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: { question?: string; answer?: string } = {};

    if (!question.trim()) {
      newErrors.question = "Question is required";
    } else if (question.trim().length < 10) {
      newErrors.question = "Question must be at least 10 characters";
    }

    if (!answer.trim()) {
      newErrors.answer = "Answer is required";
    } else if (answer.trim().length < 20) {
      newErrors.answer = "Answer must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call (replace with actual database operation later)
    setTimeout(() => {
      console.log("[v0] FAQ item saved:", { question, answer, mode });
      router.push("/admin/faq");
    }, 500);
  };

  const handleCancel = () => {
    router.push("/admin/faq");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New FAQ Item" : "Edit FAQ Item"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Add a new frequently asked question and answer"
            : "Update the question and answer"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">
              Question <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question"
              placeholder="e.g., What are your opening hours?"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errors.question) {
                  setErrors({ ...errors, question: undefined });
                }
              }}
              disabled={isLoading}
              className={errors.question ? "border-destructive" : ""}
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">
              Answer <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="answer"
              placeholder="Provide a detailed answer to the question..."
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (errors.answer) {
                  setErrors({ ...errors, answer: undefined });
                }
              }}
              disabled={isLoading}
              rows={6}
              className={errors.answer ? "border-destructive" : ""}
            />
            {errors.answer && (
              <p className="text-sm text-destructive">{errors.answer}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {answer.length} characters
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : mode === "create"
                  ? "Create FAQ Item"
                  : "Update FAQ Item"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
