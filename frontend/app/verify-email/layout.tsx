'use client';

import { Suspense } from 'react';

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
} 