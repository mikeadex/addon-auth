import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import EditProfileClient from '@/components/dashboard/edit-profile-client';

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <EditProfileClient user={session.user} />;
}
