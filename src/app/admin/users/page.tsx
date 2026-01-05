import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import UsersManagementClient from '@/components/admin/users-management';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  return (
    <DashboardLayout user={session!.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-1">View and manage all users</p>
        </div>

        <UsersManagementClient />
      </div>
    </DashboardLayout>
  );
}
