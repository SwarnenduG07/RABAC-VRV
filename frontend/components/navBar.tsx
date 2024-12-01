'use client';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const NavBar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.log('No token found');
        router.push('/login');
        return;
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/signin');
      }
    } catch (error: any) {
      console.error('Logout failed:', error.response?.data || error);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/');
      }
    }
  };

  return (
    <nav className="border border-neutral-800 rounded-2xl flex items-center justify-between lg:mx-48 md:mx-24 mx-4 mt-4 px-4 py-2 backdrop-blur-sm bg-neutral-800/80">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">RABAC </div>
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600  text-white px-4 py-2 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
