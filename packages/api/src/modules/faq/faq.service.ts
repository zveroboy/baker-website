import { injectable, inject } from 'inversify';
import type { CreateFaqDto, FAQ, UpdateFaqDto, ReorderFaqDto } from '@baker/shared-types';
import { FaqRepository } from './faq.repository';

@injectable()
export class FaqService {
  constructor(@inject(FaqRepository) private repository: FaqRepository) {}

  // Public API
  async getPublicFaqs(): Promise<FAQ[]> {
    return this.repository.findPublished();
  }

  // Admin API - get all FAQs
  async getAllFaqs(): Promise<FAQ[]> {
    return this.repository.findAll();
  }

  // Admin API - create
  async createFaq(data: CreateFaqDto): Promise<FAQ> {
    // Get the max order and set new order to max + 1
    const allFaqs = await this.repository.findAll();
    const maxOrder = allFaqs.length > 0 ? Math.max(...allFaqs.map((f) => f.order)) : 0;

    const created = await this.repository.create(data);

    // Update with proper order
    return this.repository.update(created.id, { order: maxOrder + 1 });
  }

  // Admin API - update
  async updateFaq(id: string, data: UpdateFaqDto): Promise<FAQ> {
    return this.repository.update(id, data);
  }

  // Admin API - delete
  async deleteFaq(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  // Admin API - reorder
  async reorderFaqs(items: ReorderFaqDto): Promise<void> {
    return this.repository.reorder(items);
  }

  // Utility - get by ID
  async getFaqById(id: string): Promise<FAQ | null> {
    return this.repository.findById(id);
  }
}


