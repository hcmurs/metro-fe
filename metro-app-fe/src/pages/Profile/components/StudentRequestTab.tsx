import { LeftOutlined, RightOutlined, UploadOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DatePicker, Form, Input, message, Modal, Typography, Upload } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Controller, set, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { apiCreateRequest, apiFindRequestByUserId } from '../../../apis/user.api';
import { useAuth } from '../../../contexts/AuthContext';
import type { StudentRequest } from '../../../types/user.type';
import { compressImage, convertFileToBase64 } from '../../../utils/common';

const { Title, Text } = Typography;

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const studentRequestFormSchema = z.object({
  content: z.string().min(1, 'Description is required'),
  endDate: z.string({
    required_error: 'Graduation date is required',
  }).pipe(z.string().datetime().nullable().refine(val => val !== null, {
    message: 'Graduation date is required',
  })),
  citizenIdentityCardImage: z.any()
    .refine((fileList) => fileList && fileList.length > 0, {
      message: 'Citizen Identity Card Image is required',
    })
    .refine((fileList) => {
      const file = fileList[0]?.originFileObj;
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE_BYTES;
    }, `Citizen Identity Card Image must be equal or less than ${MAX_FILE_SIZE_MB}MB.`)
    .transform((fileList) => fileList[0]),
  studentCardImage: z.any()
    .refine((fileList) => fileList && fileList.length > 0, {
      message: 'Student Card Image is required',
    })
    .refine((fileList) => {
      const file = fileList[0]?.originFileObj;
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE_BYTES;
    }, `Student Card Image must be equal or less than ${MAX_FILE_SIZE_MB}MB.`)
    .transform((fileList) => fileList[0]),
});

type StudentRequestFormData = z.infer<typeof studentRequestFormSchema>;

export default function StudentRequestTab() {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { contextUser } = useAuth();
  const [requestList, setRequestList] = useState<StudentRequest[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const handleBeforeUpload = (file: File, fieldName: keyof StudentRequestFormData) => {
    clearErrors(fieldName);

    if (file.size && file.size > MAX_FILE_SIZE_BYTES) {
      setError(fieldName, {
        type: 'manual',
        message: `${fieldName === 'citizenIdentityCardImage' ? 'Citizen Identity Card Image' : 'Student Card Image'} must be less than ${MAX_FILE_SIZE_MB}MB.`,
      });
      message.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB!`);
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const fetchRequests = async () => {
    if (!contextUser || !contextUser.userId) {
      return;
    }

    const res = await apiFindRequestByUserId(contextUser.userId);
    if (res && res.status === 200) {
      setRequestList(res.data as StudentRequest[]);

      const hasPendingOrApproved = res.data.some(
        (item: StudentRequest) => item.requestStatus === 'PENDING' || item.requestStatus === 'APPROVED'
      );
      if (hasPendingOrApproved) {
        setCanSubmit(false);
      }
    } else {
      message.error('Failed to fetch requests. Please try again later.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [contextUser]);

  const { control, handleSubmit, formState: { errors }, reset, setError, clearErrors } = useForm<StudentRequestFormData>({
    resolver: zodResolver(studentRequestFormSchema),
    defaultValues: {
      content: '',
      endDate: '',
      citizenIdentityCardImage: [],
      studentCardImage: [],
    },
  });

  const onSubmit: SubmitHandler<StudentRequestFormData> = async (data) => {
    setSubmitting(true);
    data.endDate = dayjs(data.endDate).format('DD/MM/YYYY');

    data.citizenIdentityCardImage = await compressImage(data.citizenIdentityCardImage.originFileObj);
    data.citizenIdentityCardImage = await convertFileToBase64(data.citizenIdentityCardImage);

    data.studentCardImage = await compressImage(data.studentCardImage.originFileObj);
    data.studentCardImage = await convertFileToBase64(data.studentCardImage);

    const res = await apiCreateRequest({
      content: data.content,
      endDate: data.endDate,
      citizenIdentityCardImage: data.citizenIdentityCardImage,
      studentCardImage: data.studentCardImage,
    });

    if (res && res.status === 200) {
      reset();
      setShowForm(false);
      fetchRequests();
      setSubmitting(false);
    } else {
      setSubmitting(false);
      message.error('Failed to submit request. Please try again later.');
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '!bg-[#e6fffd]/30 !text-teal-800 !border-teal-200';
      case 'REJECTED':
        return '!bg-red-50 !text-red-800 !border-red-200';
      default:
        return '!bg-yellow-50 !text-yellow-800 !border-yellow-200';
    }
  };

  const paginatedRequests = useMemo(() => {
    return requestList.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [requestList, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(requestList.length / itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#e6fffd] flex justify-between items-center">
        <div>
          <Title level={2} className="!text-2xl !font-semibold !text-teal-900 !mb-0">
            Student Discount Request
          </Title>
          <Text className="mt-2 text-sm text-teal-600 block">
            Submit your student information to get special discounts on metro tickets
          </Text>
        </div>
        <Button
          type="primary"
          onClick={() => setShowForm(true)}
          className="!px-4 !py-2 !h-auto !rounded-lg !bg-teal-600 !text-white hover:!bg-teal-700 !transition-colors disabled:!opacity-55"
          disabled={!canSubmit}
        >
          New Request
        </Button>
      </div>

      <Modal
        title="Submit Student Discount Request"
        open={showForm}
        onCancel={() => setShowForm(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Description"
                validateStatus={errors.content ? 'error' : ''}
                help={errors.content?.message}
                required
              >
                <Input.TextArea
                  {...field}
                  rows={4}
                  className="!rounded-lg !border-[#e6fffd] !shadow-sm focus:!border-teal-500 focus:!ring-teal-500 !transition-colors !duration-200"
                />
              </Form.Item>
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <Form.Item
                label="Graduation Date"
                validateStatus={errors.endDate ? 'error' : ''}
                help={errors.endDate?.message}
                required
              >
                <DatePicker
                  {...restField}
                  value={value ? dayjs(value) : null}
                  onChange={(date) => onChange(date ? date.toISOString() : null)}
                  format="DD/MM/YYYY"
                  className="!w-full !rounded-lg !border-[#e6fffd] !shadow-sm focus:!border-teal-500 focus:!ring-teal-500 !transition-colors !duration-200"
                />
              </Form.Item>
            )}
          />

          <Controller
            name="citizenIdentityCardImage"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Form.Item
                label="Citizen Identity Card Image"
                validateStatus={errors.citizenIdentityCardImage ? 'error' : ''}
                help={errors.citizenIdentityCardImage?.message?.toString()}
                required
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={(file) => handleBeforeUpload(file, 'citizenIdentityCardImage')}
                  onChange={({ fileList }) => onChange(fileList)}
                  fileList={value as any}
                  className="!rounded-lg !border-[#e6fffd] !shadow-sm focus:!border-teal-500 focus:!ring-teal-500 !transition-colors !duration-200"
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                <Text type="secondary" className="mt-1 block text-sm">Please upload a photo of the front side of your citizen identity card</Text>
              </Form.Item>
            )}
          />

          <Controller
            name="studentCardImage"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Form.Item
                label="Student Card Image"
                validateStatus={errors.studentCardImage ? 'error' : ''}
                help={errors.studentCardImage?.message?.toString()}
                required
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={(file) => handleBeforeUpload(file, 'studentCardImage')}
                  onChange={({ fileList }) => onChange(fileList)}
                  fileList={value as any}
                  className="!rounded-lg !border-[#e6fffd] !shadow-sm focus:!border-teal-500 focus:!ring-teal-500 !transition-colors !duration-200"
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                <Text type="secondary" className="mt-1 block text-sm">Please upload a valid student ID card</Text>
              </Form.Item>
            )}
          />

          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            disabled={submitting}
            className="!w-full !bg-teal-600 !text-white !py-3 !px-4 !rounded-lg hover:!bg-teal-700 focus:!outline-none focus:!ring-2 focus:!ring-teal-500 focus:!ring-offset-2 !transition-colors !duration-200"
          >
            Submit Request
          </Button>
        </Form>
      </Modal>

      <div className="space-y-4">
        <Title level={3} className="!text-xl !font-medium !text-teal-900 !pb-4">
          Previous Requests
        </Title>
        <div className="space-y-4">
          {paginatedRequests.length > 0 ? (
            paginatedRequests.map((request) => (
              <div
                key={request.requestId}
                className={`rounded-lg border p-6 transition-all duration-200 ${getStatusStyles(request.requestStatus)}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="!text-lg !font-medium !mb-1">{request.title}</h4>
                    <p className="text-sm mt-1 block">Description: {request.content}</p>
                    {request.endDate && (
                      <p className="text-sm block">Graduate on: {request.endDate}</p>
                    )}
                    <p className="text-xs mt-2 block">
                      Submitted on {request.createdAt}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${request.requestStatus === 'APPROVED' ? 'bg-teal-100 text-teal-800' : request.requestStatus === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {request.requestStatus}
                  </span>
                </div>
                {request.rejectionReason && (
                  <Text className="!mt-3 !text-sm !text-red-600 !bg-red-50 !p-3 !rounded block">
                    Reject reason: {request.rejectionReason}
                  </Text>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 p-8 border rounded-lg bg-gray-50">
              No requests found.
            </div>
          )}
        </div>

        {requestList.length > itemsPerPage && (
          <div className="flex items-center justify-between border-t border-[#e6fffd] pt-4 mt-8">
            <div className="flex items-center gap-2">
              <Button
                type="text"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="!p-2 !rounded-lg hover:!bg-[#e6fffd]/30 disabled:!opacity-50 disabled:!cursor-not-allowed !transition-colors !duration-200"
                icon={<LeftOutlined className="!w-5 !h-5 !text-teal-600" />}
              />
              <Text className="text-sm text-teal-600">
                Trang {currentPage} trên {totalPages}
              </Text>
              <Button
                type="text"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="!p-2 !rounded-lg hover:!bg-[#e6fffd]/30 disabled:!opacity-50 disabled:!cursor-not-allowed !transition-colors !duration-200"
                icon={<RightOutlined className="!w-5 !h-5 !text-teal-600" />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}