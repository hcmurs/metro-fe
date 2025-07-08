import { UploadOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, message, Modal, Select, Typography, Upload } from 'antd';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { apiCreateFeedback } from '../../../apis/user.api';
import { useUserStore } from '../../../stores/user.store';
import { compressImage, convertFileToBase64 } from '../../../utils/common';

const { Title, Text } = Typography;
const { Option } = Select;

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const feedbackFormSchema = z.object({
  content: z.string().min(1, 'Feedback message cannot be blank.'),
  category: z.string().min(1, 'Please select a category.'),
  image: z.any()
    .refine((fileList) => !fileList || fileList.length <= 1, {
      message: 'Only one image can be uploaded.',
    })
    .refine((fileList) => {
      const file = fileList?.[0]?.originFileObj;
      if (!file) return true;
      return file.size <= MAX_IMAGE_SIZE_BYTES;
    }, `Image must be equal or less than ${MAX_IMAGE_SIZE_MB}MB.`)
    .transform((fileList) => fileList?.[0] || null)
    .optional(),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

export default function FeedbackTab() {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [submitting, setSubmitting] = useState(false);

  const { feedbacks, addFeedback } = useUserStore();

  const handleBeforeUpload = (file: File) => {
    clearErrors('image');

    if (file.size && file.size > MAX_IMAGE_SIZE_BYTES) {
      setError('image', {
        type: 'manual',
        message: `Image must be less than ${MAX_IMAGE_SIZE_MB}MB.`,
      });
      message.error(`File size exceeds ${MAX_IMAGE_SIZE_MB}MB!`);
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const { control, handleSubmit, formState: { errors }, reset, clearErrors, setError } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    mode: 'onChange',
    defaultValues: {
      content: '',
      category: '',
      image: [],
    },
  });

  const onSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    setSubmitting(true);
    if (data.image) {
      data.image = await compressImage(data.image.originFileObj);
      data.image = await convertFileToBase64(data.image);
    }

    const res = await apiCreateFeedback({
      category: data.category,
      content: data.content,
      image: data.image ? data.image : null
    });

    if (res && res.status === 200) {
      reset();
      setShowForm(false);
      setSubmitting(false);
      addFeedback(res.data);
    } else {
      setSubmitting(false);
      message.error('Failed to submit request. Please try again later.');
    }
  };

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const paginatedFeedbacks = useMemo(() => {
    return feedbacks.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [feedbacks, currentPage, itemsPerPage]);

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#e6fffd] flex justify-between items-center">
        <div>
          <Title level={2} className="!text-2xl !font-semibold !text-teal-900 !mb-0">
            Feedback
          </Title>
          <Text className="mt-2 text-sm text-teal-600 block">
            Share your thoughts about our service or report any issues.
          </Text>
        </div>
        <Button
          type="primary"
          onClick={() => setShowForm(true)}
          className="!px-4 !py-2 !h-auto !rounded-lg !bg-teal-600 !text-white hover:!bg-teal-700 !transition-colors !duration-200"
        >
          New Feedback
        </Button>
      </div>

      <Modal
        open={showForm}
        onCancel={() => setShowForm(false)}
        title="Submit Feedback"
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Category"
                validateStatus={errors.category ? 'error' : ''}
                help={errors.category?.message}
                required
              >
                <Select
                  {...field}
                  placeholder="Select a category"
                  className="!w-full !rounded-lg !shadow-sm focus:!border-teal-500 focus:!ring-teal-500 !transition-colors !duration-200"
                  onChange={value => field.onChange(value)}
                  value={field.value || undefined}
                >
                  <Option value="Compliment">Compliment</Option>
                  <Option value="App Issue">Application Issue</Option>
                  <Option value="Suggestion">Suggestion</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            )}
          />

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Feedback Message"
                validateStatus={errors.content ? 'error' : ''}
                help={errors.content?.message}
                required
              >
                <Input.TextArea
                  {...field}
                  rows={4}
                  placeholder="Type your feedback here..."
                  className="!mt-1 !block !w-full !rounded-lg !border-[#e6fffd] !shadow-sm focus:!border-teal-500 focus:!ring-teal-500 !transition-colors !duration-200"
                />
              </Form.Item>
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Form.Item
                label="Upload Image"
                validateStatus={errors.image ? 'error' : ''}
                help={errors.image?.message?.toString()}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={(file) => handleBeforeUpload(file)}
                  onChange={({ fileList }) => onChange(fileList)}
                  fileList={value as any}
                  className="!rounded-lg !border-[#e6fffd] !shadow-sm focus:!border-teal-500 focus:!ring-teal-500 !transition-colors !duration-200"
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
                <Text type="secondary" className="mt-1 block text-sm">You can upload an image related to your feedback (Max {MAX_IMAGE_SIZE_MB}MB)</Text>
              </Form.Item>
            )}
          />

          <Button
            type="primary"
            htmlType="submit"
            className="!w-full !bg-teal-600 !text-white !py-3 !px-4 !rounded-lg hover:!bg-teal-700 focus:!outline-none focus:!ring-2 focus:!ring-teal-500 focus:!ring-offset-2 !transition-colors !duration-200"
            loading={submitting}
            disabled={submitting}
          >
            Submit Feedback
          </Button>
        </Form>
      </Modal>

      <div className="space-y-4">
        <Title level={3} className="!text-xl !font-medium !text-teal-900 !pb-4">
          Previous Feedback
        </Title>
        <div className="space-y-4">
          {paginatedFeedbacks.length > 0 ? (
            paginatedFeedbacks.map((feedback) => (
              <div
                key={feedback.feedbackId}
                className="bg-[#e6fffd]/20 rounded-lg p-6 space-y-3 transition-all duration-200 hover:bg-[#e6fffd]/30"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-teal-900">{feedback.content}</p>
                  <span className="bg-teal-100 text-teal-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {feedback.category}
                  </span>
                </div>

                {feedback.image && (
                  <div className="mt-3">
                    <img
                      src={feedback.image}
                      alt="Feedback Image"
                      className="w-full h-auto max-h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/100x100/E0E0E0/ADADAD?text=Image+Error`;
                      }}
                    />
                  </div>
                )}

                <p className="text-xs text-teal-600">
                  Submitted on {feedback.createdAt}
                </p>
                {feedback.reply && (
                  <div className="mt-3 pl-4 border-l-2 border-teal-300">
                    <p className="text-sm text-teal-800">{feedback.reply}</p>
                    <p className="text-xs text-teal-600">Admin Response</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 p-8 border rounded-lg bg-gray-50">
              No feedback submitted yet.
            </div>
          )}
        </div>

        {feedbacks.length > itemsPerPage && (
          <div className="flex items-center justify-between border-t border-[#e6fffd] pt-4 mt-8">
            <div className="flex items-center gap-2">
              <Button
                type="text"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="!p-2 !rounded-lg hover:!bg-[#e6fffd]/30 disabled:!opacity-50 disabled:!cursor-not-allowed !transition-colors !duration-200"
                icon={<ChevronLeftIcon className="!w-5 !h-5 !text-teal-600" />}
              />
              <Text className="text-sm text-teal-600">
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                type="text"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="!p-2 !rounded-lg hover:!bg-[#e6fffd]/30 disabled:!opacity-50 disabled:!cursor-not-allowed !transition-colors !duration-200"
                icon={<ChevronRightIcon className="!w-5 !h-5 !text-teal-600" />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}