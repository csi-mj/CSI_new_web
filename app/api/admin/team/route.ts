import { makeCrudHandlers } from '@/lib/adminCrud';

const h = makeCrudHandlers('csi_team', 'sno', true);
export const GET = h.GET;
export const POST = h.POST;
export const PUT = h.PUT;
export const DELETE = h.DELETE;
