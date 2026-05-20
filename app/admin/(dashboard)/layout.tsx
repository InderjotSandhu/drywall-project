import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminNav from '../../../component/AdminNav';
import PushNotificationSetup from '../../../component/PushNotificationSetup';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
