'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';

import { User, Settings, LogOut, Key } from 'lucide-react';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface User {
  email: string;
  role: string;
}

export const NavBar = () => {
  const router = useRouter();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.email && parsedUser.role) {
          setUser(parsedUser as User);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

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
    <>
      <nav className="border border-neutral-800 rounded-2xl flex items-center justify-between lg:mx-4 md:mx-24 mx-4 px-3 py-1.5 backdrop-blur-sm bg-neutral-800/80">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl text-gray-200 font-bold">RABAC</div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 bg-neutral-700 hover:bg-zinc-800 cursor-pointer">
                  <User className="h-8 w-8 text-red-500" />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </DropdownMenuItem>
                
                {user?.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/roles" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Role Management
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <ChangePasswordModal 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
      />
    </>
  );
};
