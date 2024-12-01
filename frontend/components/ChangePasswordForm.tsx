// 'use client';
// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from './ui/button';


// export default function ChangePasswordForm() {
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (newPassword !== confirmPassword) {
//       setError('New passwords do not match');
//       return;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/change-password`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify({ currentPassword, newPassword }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage('Password changed successfully');
//         setCurrentPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//         setError('');
//       } else {
//         setError(data.message);
//         setMessage('');
//       }
//     } catch (err) {
//       setError('Failed to change password');
//       setMessage('');
//     }
//   };

//   return (
//     <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold">Change Password</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <Input
//             type="password"
//             placeholder="Current Password"
//             value={currentPassword}
//             onChange={(e) => setCurrentPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <Input
//             type="password"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <Input
//             type="password"
//             placeholder="Confirm New Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>
//         <Button type="submit" className="w-full">
//           Change Password
//         </Button>
//       </form>
//       {message && <p className="text-green-600 text-center">{message}</p>}
//       {error && <p className="text-red-600 text-center">{error}</p>}
//     </div>
//   );
// } 