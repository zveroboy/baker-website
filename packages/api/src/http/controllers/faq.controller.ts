import { inject } from 'inversify';
import { Controller, Get, Post, Patch, Delete, Put, Bind } from '@inversifyjs/http-core';
import type { Request, Response } from 'express';
import { FaqService } from '../../modules/faq/faq.service';
import type { CreateFaqDto, UpdateFaqDto, ReorderFaqDto } from '@baker/shared-types';

@Controller('/api')
export class FaqController {
  constructor(@inject(FaqService) private faqService: FaqService) {}

  // Public: Get all published FAQs
  @Get('/faqs')
  public async getPublicFaqs() {
    try {
      const faqs = await this.faqService.getPublicFaqs();
      return { success: true, data: faqs };
    } catch (error) {
      return { success: false, error: 'Failed to fetch FAQs' };
    }
  }

  // Admin: Get all FAQs (including unpublished)
  @Get('/admin/faqs')
  public async getAllFaqs() {
    try {
      const faqs = await this.faqService.getAllFaqs();
      return { success: true, data: faqs };
    } catch (error) {
      return { success: false, error: 'Failed to fetch FAQs' };
    }
  }

  // Admin: Create FAQ
  @Post('/admin/faqs')
  @Bind()
  public async createFaq(req: Request, res: Response) {
    try {
      const { question, answer, isPublished } = req.body as CreateFaqDto;

      if (!question || !answer) {
        res.status(400).json({ success: false, error: 'Question and answer are required' });
        return;
      }

      const faq = await this.faqService.createFaq({
        question,
        answer,
        isPublished,
      });

      res.status(201).json({ success: true, data: faq });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create FAQ' });
    }
  }

  // Admin: Update FAQ
  @Patch('/admin/faqs/:id')
  @Bind()
  public async updateFaq(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { question, answer, isPublished } = req.body as UpdateFaqDto;

      const faq = await this.faqService.updateFaq(id, {
        question,
        answer,
        isPublished,
      });

      res.status(200).json({ success: true, data: faq });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update FAQ' });
    }
  }

  // Admin: Delete FAQ
  @Delete('/admin/faqs/:id')
  @Bind()
  public async deleteFaq(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.faqService.deleteFaq(id);
      res.status(200).json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete FAQ' });
    }
  }

  // Admin: Reorder FAQs
  @Put('/admin/faqs/reorder')
  @Bind()
  public async reorderFaqs(req: Request, res: Response) {
    try {
      const items = req.body as ReorderFaqDto;

      if (!Array.isArray(items)) {
        res.status(400).json({ success: false, error: 'Request body must be an array' });
        return;
      }

      await this.faqService.reorderFaqs(items);
      res.status(200).json({ success: true, message: 'FAQs reordered' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to reorder FAQs' });
    }
  }
}


