import React from 'react'
import UserDetail from './components/UserDetail';
import type { UserType } from './Type/UserType';

// Fake data
const users: UserType[] = [
  {
    user_id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    phone: '0912345678',
    cccd: '12345678901',
    full_name: 'John Doe',
    role: 'customer',
    is_student: true,
    student_expired_date: '2025-12-31',
    status: 'active',
    created_at: '2024-06-01T08:30:00',
    updated_at: '2025-05-25T12:00:00',
  },
  {
    user_id: 2,
    username: 'admin01',
    email: 'admin@example.com',
    phone: '0987654321',
    cccd: '10987654321',
    full_name: 'Admin User',
    role: 'admin',
    is_student: false,
    status: 'banned',
    created_at: '2023-12-15T10:00:00',
    updated_at: '2025-05-25T12:00:00',
  },

  // Add more fake users here...
];
export default function UserManagement() {

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      <div className="bg-gray-200 p-4 flex flex-col gap-4">
        <div className='flex w-full p-3 font-bold'>
          <div className='w-5/14'>User</div>
          <div className='w-2/14'>Status</div>
          <div className='w-3/14'>Phone</div>
          <div className='w-2/14'>Role</div>
          <div className='w-2/14'>Edit</div>
        </div>
        <UserDetail users={users} />
      </div>
    </div>
  )
}
