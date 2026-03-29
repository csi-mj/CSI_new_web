import { redirect } from 'next/navigation';

export default function NotFoundCatchAll({ params }: { params: { notfound: string[] } }) {
  const path = params.notfound?.join('/') || 'unknown';
  
  // Log the 404 attempt on the server
  console.log(`[404 LOG] User attempted to access non-existent page: /${path}`);
  
  // Redirect to home
  redirect('/home');
}
