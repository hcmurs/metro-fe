import React from 'react';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import type { User } from '../../../types/user.type';
import { useAuth } from '../../../contexts/AuthContext';

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
          Personal Information
        </Title>
      </div>

      <div className="space-y-4">
        <FieldDisplay label="Full Name" value={name} />
        <FieldDisplay label="Email Address" value={email} />

        {isStudent && (
          <>
            <FieldDisplay label="Student Status" value={isStudent ? 'Verified ' : 'Not verified'} />
            {studentExpiredDate && (
              <FieldDisplay
                label="Student Verification Expiry"
                value={dayjs(studentExpiredDate).format('DD/MM/YYYY')}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};