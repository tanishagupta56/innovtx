import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const eventSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  category: z.string().min(1),
  status: z.enum(['draft', 'published']),
  venue: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  registrationStart: z.string().datetime().optional().nullable(),
  registrationEnd: z.string().datetime().optional().nullable(),
  maxParticipants: z.number().int().positive().optional().nullable(),
});

export const ticketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const ticketReplySchema = z.object({
  ticketId: z.string().uuid(),
  message: z.string().min(1, 'Message cannot be empty'),
  isInternal: z.boolean().optional().default(false),
});

export const ticketUpdateSchema = z.object({
  ticketId: z.string().uuid(),
  status: z.enum(['open', 'in_progress', 'awaiting_response', 'resolved']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

export const opportunitySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  type: z.enum(['internship', 'job', 'fellowship', 'competition', 'workshop', 'other']),
  company: z.string().optional(),
  location: z.string().optional(),
  applyUrl: z.string().url().optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
  isPublished: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type TicketReplyInput = z.infer<typeof ticketReplySchema>;
export type OpportunityInput = z.infer<typeof opportunitySchema>;
