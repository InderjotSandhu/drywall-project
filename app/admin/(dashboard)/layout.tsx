import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminNav from '../../../component/AdminNav';
import PushNotificationSetup from '../../../component/PushNotificationSetup';

export const dynamic = 'force-dynamic';

function checkEnvironmentVariables() {
  const missingVars: string[] = [];
  
  if (!process.env.DATABASE_URL) missingVars.push('DATABASE_URL');
  if (!process.env.DIRECT_URL) missingVars.push('DIRECT_URL');
  if (!process.env.AUTH_SECRET) missingVars.push('AUTH_SECRET');
  if (!process.env.ADMIN_PASSWORD) missingVars.push('ADMIN_PASSWORD');
  
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  checkEnvironmentVariables();
  
  const authenticated = await getSession();
  if (!authenticated) redirect('/admin/login');

  return (
    <div style={{ minHeight: '100vh', background: '#0f0d0b', color: '#f0e6d3', fontFamily: 'sans-serif' }}>
      <AdminNav />
      <div style={{ padding: '12px 24px 0' }}>
        <PushNotificationSetup />
      </div>
      <main style={{ padding: 24 }}>
        {children}
      </main>
    </div>
  );
}
