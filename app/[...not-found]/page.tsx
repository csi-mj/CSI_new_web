import { redirect } from 'next/navigation';

export default async function NotFoundCatchAll({ params }: { params: Promise<{ notfound: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.notfound?.join('/') || 'unknown';
  
  // Log the 404 attempt on the server
  console.log(`[404 LOG] User attempted to access non-existent page: /${path}`);
  
  // Redirect to home
  redirect('/');
}
