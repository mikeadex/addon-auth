import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user has admin or moderator role
  if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
