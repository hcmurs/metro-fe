import { Typography } from 'antd';
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import type { User } from '../../../types/user.type';

const { Text, Title } = Typography;

export default function UserInfoTab() {
  const { contextUser } = useAuth();

  const { name, email, isStudent, studentExpiredDate } = contextUser as User;

  const FieldDisplay: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="mb-4">
      <Text strong className="block text-base text-gray-700 mb-1">
        {label}
      </Text>
      <div className="p-3 bg-white rounded-md border border-gray-200">
        <Text className="text-gray-800 text-base">{value || 'Not update yet'}</Text>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-400">
        <Title level={4} className="!mb-0 text-emerald-700">
          Thông tin cá nhân
        </Title>
      </div>

      <div className="space-y-4">
        <FieldDisplay label="Họ và Tên" value={name} />
        <FieldDisplay label="Địa chỉ email" value={email} />

        {isStudent && (
          <>
            <FieldDisplay label="Trạng thái sinh viên" value={isStudent ? 'Đã duyệt ' : 'Chưa duyệt'} />
            {studentExpiredDate && (
              <FieldDisplay
                label="Ngày hết hạn sinh viên"
                value={studentExpiredDate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};