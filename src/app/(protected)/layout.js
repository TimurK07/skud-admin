'use client';

import AuthGuard from '../../components/AuthGuard/AuthGuard';
import MainLayout from '../../layout/MainLayout';

export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
