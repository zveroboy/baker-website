import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FAQ, CreateFaqDto } from '@baker/shared-types';

// Validation schema
const faqFormSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters').max(255),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  isPublished: z.boolean().optional().default(false),
});

interface FaqFormProps {
  initialData?: FAQ;
  onSubmit: (data: CreateFaqDto) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function FaqForm({ initialData, onSubmit, isLoading = false, onCancel }: FaqFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      question: initialData?.question || '',
      answer: initialData?.answer || '',
      isPublished: initialData?.isPublished || false,
    },
    onSubmit: async (values) => {
      try {
        setSubmitError(null);
        await onSubmit(values);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'An error occurred');
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: faqFormSchema,
    },
  });

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Question Field */}
        <div className="space-y-2">
          <form.Field
            name="question"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Question</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter FAQ question"
                  className="w-full"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm">{field.state.meta.errors[0]}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Answer Field */}
        <div className="space-y-2">
          <form.Field
            name="answer"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Answer</Label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter FAQ answer"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm">{field.state.meta.errors[0]}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Publish Checkbox */}
        <div className="flex items-center space-x-2">
          <form.Field
            name="isPublished"
            children={(field) => (
              <>
                <input
                  id="isPublished"
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <Label htmlFor="isPublished" className="cursor-pointer">
                  Publish this FAQ
                </Label>
              </>
            )}
          />
        </div>

        {/* Error Message */}
        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

        {/* Action Buttons */}
        <div className="flex space-x-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
}


