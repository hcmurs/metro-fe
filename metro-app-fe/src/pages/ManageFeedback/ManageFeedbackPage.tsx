import { CheckOutlined, ExclamationCircleOutlined, EyeOutlined, FileImageOutlined, FilterOutlined, MessageOutlined, QuestionCircleOutlined, SearchOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Col, Form, Image, Input, Layout, message, Modal, notification, Row, Select, Space, Spin, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiFindAllFeedbacks, apiFindUserById, apiReplyFeedback } from '../../apis/user.api';
import { useAuth } from '../../contexts/AuthContext';
import type { Feedback, User } from '../../types/user.type';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const responseSchema = z.object({
  replyContent: z.string().min(1, 'Response is required'),
});

type ResponseFormInputs = z.infer<typeof responseSchema>;

export default function ManageFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { contextUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { control, handleSubmit, reset, formState: { errors }, clearErrors } = useForm<ResponseFormInputs>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      replyContent: ''
    }
  });

  const fetchFeedbacks = async () => {
    if (!contextUser || !contextUser.userId) {
      return;
    }

    const res = await apiFindAllFeedbacks();
    if (res && res.status === 200) {
      setFeedbacks(res.data);
    } else {
      message.error('Failed to fetch feedbacks. Please try again later.');
    }
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;

    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        feedback.feedbackId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.userId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(feedback => {
        const status = feedback.reply ? 'RESPONDED' : 'PENDING';
        return status === statusFilter;
      });
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(feedback => feedback.category === categoryFilter);
    }

    setFilteredFeedbacks(filtered);
  }, [searchTerm, statusFilter, categoryFilter, feedbacks]);

  const getStatusFromFeedback = (feedback: Feedback): 'PENDING' | 'RESPONDED' => {
    return feedback.reply ? 'RESPONDED' : 'PENDING';
  };

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case 'RESPONDED':
        return 'success';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'App Issue':
        return <ExclamationCircleOutlined className='!text-[#ff4d4f]' />;
      case 'Suggestion':
        return <QuestionCircleOutlined className='!text-[#1890ff]' />;
      case 'Compliment':
        return <CheckOutlined className='!text-[#52c41a]' />;
      default:
        return <MessageOutlined className='!text-[#666]' />;
    }
  };

  const handleViewFeedback = async (record: Feedback) => {
    setSelectedFeedback(record);
    setShowModal(true);

    const res = await apiFindUserById(record.userId);
    if (res && res.status === 200) {
      setSelectedUser(res.data as User);
    } else {
      message.error('Cannot load user data');
    }
  };

  const handleReplyFeedback = async (data: ResponseFormInputs) => {
    if (!selectedFeedback) return;
    setIsSubmitting(true);

    const res = await apiReplyFeedback({
      feedbackId: selectedFeedback.feedbackId,
      content: data.replyContent,
    })
    if (res && res.status === 200) {
      notification.success({ message: 'Reply successfully' });
      setShowModal(false);
      setShowResponseModal(false);
      await fetchFeedbacks();
    } else {
      message.error("Something wen't wrong");
    }
    
    setIsSubmitting(false);
  };

  const columns = [
    {
      title: 'Feedback Info',
      dataIndex: 'feedbackId',
      key: 'feedbackId',
      render: (id: number) => (
        <div className='font-bold'>Feedback #{id}</div>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: number) => (
        <div className='flex items-center'>
          <div className="w-10 h-10 rounded-full bg-[#e0f7fa] flex items-center justify-center mr-[10px]">
            <UserOutlined className='!text-[#00838f]' />
          </div>
          <div className='font-bold'>#{userId}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Space>
          {getCategoryIcon(category)}
          <span className="capitalize">{category}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: Feedback) => {
        const status = getStatusFromFeedback(record);
        return (
          <Tag color={getStatusTagColor(status)}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Feedback) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewFeedback(record)}
            title="View Details"
          />
        </Space>
      ),
    },
  ];

  const getStatusStats = () => {
    const pending = feedbacks.filter(f => !f.reply).length;
    const responded = feedbacks.filter(f => f.reply).length;

    return {
      total: feedbacks.length,
      pending,
      responded,
    };
  };

  const stats = getStatusStats();

  return (
    <Layout className='!min-h-screen !bg-[#f0f2f5] !p-6'>
      <Content className="!w-full !max-w-[1200px] !mx-auto">
        <div className='mb-6'>
          <h1 className="text-[2em] font-bold text-[#333] mb-2">Feedback Management</h1>
          <p className='text-[#666]'>Manage and respond to user feedback</p>
        </div>

        <Row gutter={[24, 24]} className='!mb-6'>
          <Col xs={24} sm={12} md={8}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className='flex items-center justify-between'>
                <div>
                  <p className='m-0 text-[#666]'>Total Feedback</p>
                  <p className='font-bold text-[1.5em] m-0 text-[#333]'>{stats.total}</p>
                </div>
                <MessageOutlined className='!text-[2em] !text-[#1890ff]' />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className='flex items-center justify-between'>
                <div>
                  <p className='m-0 text-[#666]'>Pending</p>
                  <p className='font-bold text-[1.5em] m-0 text-[#faad14]'>{stats.pending}</p>
                </div>
                <ExclamationCircleOutlined className='!text-[2em] !text-[#faad14]' />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className='flex items-center justify-between'>
                <div>
                  <p className='m-0 text-[#666]'>Responded</p>
                  <p className='font-bold text-[1.5em] m-0 text-[#52c41a]'>{stats.responded}</p>
                </div>
                <CheckOutlined className='!text-[2em] !text-[#52c41a]' />
              </div>
            </Card>
          </Col>
        </Row>

        <Card className='!mb-6 !shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]'>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <Search
                placeholder="Search by user, subject, or feedback ID..."
                onSearch={(value) => setSearchTerm(value)}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='!w-full'
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} md={12}>
              <Space className='!w-full !justify-end' wrap>
                <FilterOutlined className='!text-[rgba(0, 0, 0, 0.45)]' />
                <Select
                  defaultValue="ALL"
                  onChange={(value) => setStatusFilter(value)}
                >
                  <Option value="ALL">All Status</Option>
                  <Option value="PENDING">Pending</Option>
                  <Option value="RESPONDED">Responded</Option>
                </Select>
                <Select
                  defaultValue="ALL"
                  onChange={(value) => setCategoryFilter(value)}
                >
                  <Option value="ALL">All Categories</Option>
                  <Option value="Compliment">Compliment</Option>
                  <Option value="App Issue">App Issue</Option>
                  <Option value="Suggestion">Suggestion</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
          <Table
            columns={columns}
            dataSource={filteredFeedbacks}
            rowKey="feedbackId"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              total: filteredFeedbacks.length,
            }}
            scroll={{ x: 'max-content' }}
          />
        </Card>

        <Modal
          open={showModal}
          onCancel={() => setShowModal(false)}
          width={800}
          centered
          footer={
            selectedFeedback && !selectedFeedback.reply ? (
              <div className='flex justify-end gap-3 pt-4 border-t border-solid border-[#f0f0f0]'>
                <Button
                  type="primary"
                  onClick={() => setShowResponseModal(true)}
                  disabled={isSubmitting}
                  className='!bg-teal-600 !text-white hover:!bg-teal-700'
                >
                  Send Response
                </Button>
              </div>
            ) : null
          }
        >
          {selectedFeedback && selectedUser && (
            <div className="relative">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white flex items-center z-1 opacity-55 justify-center rounded-lg">
                  <Spin size="large" />
                </div>
              )}

              <div className="py-6 px-0">
                <Row gutter={[24, 24]} className='!mb-6'>
                  <Col xs={24} md={12}>
                    <h3 className='text-[1.2em] font-medium mb-4 text-center'>Feedback Information</h3>
                    <Space direction="vertical" size="middle" className='!w-full'>
                      <div className='font-bold'>
                        Feedback #{selectedFeedback.feedbackId}
                      </div>
                      <div>
                        <span className='font-bold'>Status: </span>
                        <Tag color={getStatusTagColor(getStatusFromFeedback(selectedFeedback))} className='!mt-1'>
                          {getStatusFromFeedback(selectedFeedback)}
                        </Tag>
                      </div>
                      <div>
                        <span className='font-bold'>Category: </span>
                        <Space>
                          <span className="capitalize">{selectedFeedback.category}</span>
                        </Space>
                      </div>
                      <div>
                        <span className='font-bold'>Submitted On:</span> {selectedFeedback.createdAt}
                      </div>
                    </Space>
                  </Col>

                  <Col xs={24} md={12}>
                    <h3 className='text-[1.2em] font-medium mb-4 text-center'>User Information</h3>
                    <Space direction="vertical" size="middle" className='!w-full'>
                      <div className='font-bold'>
                        User #{selectedFeedback.userId}
                      </div>
                      <div>
                        <span className='font-bold'>Name:</span> {selectedUser.name}
                      </div>
                      <div>
                        <span className='font-bold'>Email:</span> {selectedUser.email}
                      </div>
                      <div>
                        <span className='font-bold'>Created at:</span> {selectedUser.createdAt}
                      </div>
                    </Space>
                  </Col>
                </Row>

                <Row gutter={[24, 24]} className='!mb-6'>
                  <Col xs={24}>
                    <div className='text-[#888] text-[0.9em] mb-2'>
                      <MessageOutlined className='!mr-1' />
                      Feedback Message
                    </div>
                    <div className="border border-[#f0f0f0] rounded-lg p-4 bg-[#fafafa]">
                      <p className='m-0 text-[#333] whitespace-pre-wrap'>{selectedFeedback.content}</p>
                    </div>
                  </Col>

                  {selectedFeedback.image && (
                    <Col xs={24}>
                      <div className='text-[#888] text-[0.9em] mb-2'>
                        <FileImageOutlined className='!mr-1' />
                        Image
                      </div>
                      <Image
                        src={selectedFeedback.image}
                        alt="image"
                        className='!w-full !h-[192px] !object-contain'
                      />
                    </Col>
                  )}
                </Row>

                {selectedFeedback.reply && (
                  <div className='mb-6'>
                    <div className='text-[#888] text-[0.9em] mb-2'>Admin Response</div>
                    <div className="p-3 bg-[#f0f9ff] border border-[#91d5ff] rounded-lg">
                      <p className='m-0 text-[#0050b3]'>{selectedFeedback.reply}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        <Modal
          open={showResponseModal}
          onCancel={() => { setShowResponseModal(false); clearErrors() }}
          title={
            <>
              <SendOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              Send Response
            </>
          }
          footer={null}
          centered
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit(handleReplyFeedback)}
          >
            <Form.Item
              label="Response"
              name="replyContent"
              validateStatus={errors.replyContent ? 'error' : ''}
              help={errors.replyContent?.message}
              required
            >
              <Controller
                name="replyContent"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={6}
                    placeholder="Type your response here..."
                  />
                )}
              />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button type='primary' htmlType="submit" loading={isSubmitting} className='!bg-teal-600 !text-white hover:!bg-teal-700'>
                Submit
              </Button>
            </div>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}