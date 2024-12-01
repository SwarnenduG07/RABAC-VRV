'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing');
        return;
      }

      try {
        console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify-email`);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStatus('success');
        setMessage('Email verified successfully!');
        setTimeout(() => {
          router.push('/signin');
        }, 3000);

      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error instanceof Error 
          ? `Verification failed: ${error.message}`
          : 'An error occurred during verification. Please try again or contact support.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Email Verification
        </h2>
        
        <div className="mt-4">
          {status === 'loading' && (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
          )}

          <p className={`mt-2 text-sm ${
            status === 'success' 
              ? 'text-green-600 dark:text-green-400' 
              : status === 'error' 
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
          }`}>
            {message}
          </p>

          {status === 'error' && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please try:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                <li>Checking if the verification link is correct</li>
                <li>Requesting a new verification email</li>
                <li>Contacting support if the issue persists</li>
              </ul>
              <Link 
                href="/signin"
                className="block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Return to Sign In
              </Link>
            </div>
          )}

          {status === 'success' && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Redirecting to login page...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

