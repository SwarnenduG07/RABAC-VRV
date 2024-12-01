'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;

  role: string;
  userPermissions?: {
    permission: {
      id: number;
      name: string;
    }
  }[];
}

export default function RoleManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('Fetched users data:', data);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/roles/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          role: newRole
        })
      });

      if (response.ok) {
        toast.success('Role updated successfully');
        fetchUsers(); // Refresh the user list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                  <p className="font-medium">{user.username || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{user.email || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Current Role: {user.role || 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    className="border rounded p-2"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MODERATOR">Moderator</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <div>No users found</div>
          )}
        </div>
      )}
    </div>
  );
} 