import { PrismaClient } from '@baker/database';
import type { CreateFaqDto, FAQ, UpdateFaqDto, ReorderFaqDto } from '@baker/shared-types';

export class FaqRepository {
  constructor(private prisma: PrismaClient) {}

  // Find all FAQs (admin)
  async findAll(): Promise<FAQ[]> {
    return this.prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // Find published FAQs only (public)
  async findPublished(): Promise<FAQ[]> {
    return this.prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });
  }

  // Find by ID
  async findById(id: string): Promise<FAQ | null> {
    return this.prisma.faq.findUnique({
      where: { id },
    });
  }

  // Create
  async create(data: CreateFaqDto): Promise<FAQ> {
    return this.prisma.faq.create({
      data: {
        question: data.question,
        answer: data.answer,
        isPublished: data.isPublished ?? false,
        order: 0,
      },
    });
  }

  // Update
  async update(id: string, data: UpdateFaqDto): Promise<FAQ> {
    return this.prisma.faq.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer,
        isPublished: data.isPublished,
      },
    });
  }

  // Delete
  async delete(id: string): Promise<void> {
    await this.prisma.faq.delete({
      where: { id },
    });
  }

  // Reorder (bulk update)
  async reorder(items: ReorderFaqDto): Promise<void> {
    await Promise.all(
      items.map((item) =>
        this.prisma.faq.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
  }

  // Count total FAQs
  async count(): Promise<number> {
    return this.prisma.faq.count();
  }
}

