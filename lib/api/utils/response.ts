import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types/events';

export function successResponse<T>(data: T, status: number = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  return NextResponse.json(response, { status });
}
export function errorResponse(
    message: string,
    code: string = 'ERROR',
    status: number = 500,
    details?: Record<string, any>
){
    const response: ApiResponse<never> = {
        success: false,
        error: {
            code,
            message,
            details
        }
    };
    return NextResponse.json(response, { status });
}
