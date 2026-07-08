import { makeCrudHandlers } from '@/lib/adminCrud';

const h = makeCrudHandlers('magazines', 'sort_order', true);
export const GET = h.GET;
export const POST = h.POST;
export const PUT = h.PUT;
export const DELETE = h.DELETE;
