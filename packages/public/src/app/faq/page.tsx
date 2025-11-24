import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

async function getFAQs(): Promise<FAQ[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/faqs`, {
      revalidate: 3600, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch FAQs');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export const metadata = {
  title: 'FAQ - Baker Personal Website',
  description: 'Frequently asked questions about our bakery and services',
};

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our bakery, products, and services.
          </p>
        </div>

        {/* FAQ Accordion */}
        {faqs.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-200">
                  <AccordionTrigger className="text-left py-4 hover:no-underline hover:text-blue-600 transition-colors">
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4 pt-0">
                    <p className="leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No FAQs available at the moment.</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Contact us directly for more information about our products and services.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
