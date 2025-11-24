import { useState } from 'react';
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '../faq.queries';
import { FaqForm } from '../components/FaqForm';
import { Button } from '@/components/ui/button';
import type { FAQ, CreateFaqDto } from '@baker/shared-types';

export function FaqRoute() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: faqs, isLoading, isError } = useFaqs();
  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq(editingId || '');
  const deleteMutation = useDeleteFaq();

  const editingFaq = editingId && faqs?.find((f) => f.id === editingId);

  const handleSubmit = async (data: CreateFaqDto) => {
    if (editingId) {
      await updateMutation.mutateAsync(data);
      setEditingId(null);
    } else {
      await createMutation.mutateAsync(data);
    }
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">FAQ Management</h1>
        <Button onClick={() => setShowForm(true)} disabled={showForm}>
          Add New FAQ
        </Button>
      </div>

      {showForm && (
        <div className="mb-8 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit FAQ' : 'Create New FAQ'}</h2>
          <FaqForm
            initialData={editingFaq}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onCancel={handleCancel}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-600">Loading FAQs...</p>
      ) : isError ? (
        <p className="text-red-600">Error loading FAQs</p>
      ) : faqs && faqs.length > 0 ? (
        <div className="grid gap-4">
          {faqs.map((faq: FAQ) => (
            <div key={faq.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600 text-sm mt-2">{faq.answer.substring(0, 100)}...</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${faq.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {faq.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(faq.id)}
                  disabled={showForm}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(faq.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No FAQs yet. Create one to get started.</p>
      )}
    </div>
  );
}


