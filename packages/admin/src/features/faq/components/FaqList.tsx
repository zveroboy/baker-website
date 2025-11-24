import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { useFaqs, useReorderFaqs, useUpdateFaq, useDeleteFaq } from '../faq.queries';
import type { FAQ } from '@baker/shared-types';

function SortableFaqItem({
  faq,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  faq: FAQ;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, isPublished: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 inline-block"
            title="Drag to reorder"
          >
            ⋮⋮
          </div>
          <h3 className="text-lg font-semibold text-gray-900 inline-block ml-2">{faq.question}</h3>
          <p className="text-gray-600 text-sm mt-1 ml-10">{faq.answer.substring(0, 80)}...</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onTogglePublish(faq.id, !faq.isPublished)}
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              faq.isPublished
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            title={faq.isPublished ? 'Click to unpublish' : 'Click to publish'}
          >
            {faq.isPublished ? '✓ Published' : 'Draft'}
          </button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(faq.id)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(faq.id)}
            className="text-red-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FaqList({
  onEdit,
  onDelete,
}: {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { data: faqs = [] } = useFaqs();
  const reorderMutation = useReorderFaqs();
  const updateMutation = useUpdateFaq('');
  const [localFaqs, setLocalFaqs] = useState(faqs);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localFaqs.findIndex((faq) => faq.id === active.id);
      const newIndex = localFaqs.findIndex((faq) => faq.id === over.id);

      const newOrder = arrayMove(localFaqs, oldIndex, newIndex);
      setLocalFaqs(newOrder);

      // Update server with new order
      const reorderData = newOrder.map((faq, index) => ({
        id: faq.id,
        order: index,
      }));

      await reorderMutation.mutateAsync(reorderData);
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    const faq = localFaqs.find((f) => f.id === id);
    if (faq) {
      await updateMutation.mutateAsync({
        question: faq.question,
        answer: faq.answer,
        isPublished,
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localFaqs.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {localFaqs.map((faq) => (
            <SortableFaqItem
              key={faq.id}
              faq={faq}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}


