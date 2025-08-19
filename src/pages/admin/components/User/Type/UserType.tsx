export type UserType = {
  user_id: number;
  username: string;
  email: string;
  phone: string;
  cccd: string;
  full_name: string;
  role: 'customer' | 'admin' | 'staff';
  is_student: boolean;
  student_expired_date?: string;
  status: 'active' | 'banned';
  created_at: string;
  updated_at: string;
};