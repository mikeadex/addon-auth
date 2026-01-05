import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {session.user.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{session.user.role.toLowerCase()}</div>
              <p className="text-xs text-muted-foreground">Your current role</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium truncate">{session.user.email}</div>
              <p className="text-xs text-muted-foreground">Verified account</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Active Member</div>
              <p className="text-xs text-muted-foreground">Account in good standing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">Complete</div>
              <p className="text-xs text-muted-foreground">All information up to date</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and settings</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <a
              href="/dashboard/profile"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold">Edit Profile</h3>
                <p className="text-sm text-gray-600">Update your personal information</p>
              </div>
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold">Security Settings</h3>
                <p className="text-sm text-gray-600">Manage passwords and authentication</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
