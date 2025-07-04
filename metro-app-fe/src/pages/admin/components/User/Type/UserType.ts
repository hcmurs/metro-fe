export interface UserType {
  user_id: number;
  username: string;
  email: string;
  phone: string;
  cccd: string;
  full_name: string;
  role: 'admin' | 'customer';
  is_student: boolean;
  student_expired_date: string; // dạng "YYYY-MM-DD"
  status: 'active' | 'banned';
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}
