import { CalendarOutlined, CheckOutlined, CloseOutlined, CreditCardOutlined, ExclamationCircleOutlined, EyeOutlined, FileTextOutlined, FilterOutlined, ReadOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Image, Input, Layout, message, Modal, notification, Row, Select, Space, Spin, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { apiFindAllRequests, apiFindUserById, apiVerifyRequest } from '../../apis/user.api';
import { useAuth } from '../../contexts/AuthContext';
import type { StudentRequest, User } from '../../types/user.type';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const rejectSchema = z.object({
  rejectionReason: z.string().min(1, 'Rejection Reason is required'),
});

type RejectFormInputs = z.infer<typeof rejectSchema>;

export default function VerifyRequestPage() {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<StudentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { contextUser } = useAuth();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { control, handleSubmit, reset, formState: { errors }, clearErrors } = useForm<RejectFormInputs>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      rejectionReason: ''
    }
  });

  const fetchRequests = async () => {
    if (!contextUser || !contextUser.userId) {
      return;
    }

    const res = await apiFindAllRequests();
    if (res && res.status === 200) {
      setRequests(res.data);
    } else {
      message.error('Failed to fetch student requests. Please try again later.');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchRequests()
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.requestId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.createdAt.includes(searchTerm.toLowerCase()) ||
        request.endDate.includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(request => request.requestStatus === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleViewRequest = async (record: StudentRequest) => {
    setSelectedRequest(record);
    setShowModal(true);

    const res = await apiFindUserById(record.userId);
    if (res && res.status === 200) {
      setSelectedUser(res.data as User);
    } else {
      message.error('Cannot load user data');
    }
  };

  const showApproveConfirm = (record: StudentRequest) => {
    Modal.confirm({
      title: 'Approve this request?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action will approve the student\'s discount request.',
      okText: 'Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        await handleApproveRequest(record);
      },
    });
  };

  const handleApproveRequest = async (record: StudentRequest) => {
    if (!selectedRequest) return;
    setIsSubmitting(true);

    const res = await apiVerifyRequest(record.requestId, true);
    if (res && res.status === 200) {
      notification.success({ message: 'Approved successfully' });
      setShowModal(false);
      await fetchRequests();
    } else {
      message.error("Something wen't wrong");
    }

    setIsSubmitting(false);
  };

  const handleRejectRequest = async (data: RejectFormInputs) => {
    if (!selectedRequest) return;
    setIsSubmitting(true);

    const res = await apiVerifyRequest(selectedRequest.requestId, false, data.rejectionReason);
    if (res && res.status === 200) {
      notification.success({ message: 'Rejected successfully' });
      setShowRejectModal(false);
      setShowModal(false);
      await fetchRequests();
      reset();
    } else {
      message.error("Something went wrong");
    }
    setIsSubmitting(false);
  };

  const columns = [
    {
      title: 'Request Info',
      dataIndex: 'requestId',
      key: 'requestId',
      render: (text: string, record: StudentRequest) => (
        <div>
          <div className='font-bold'>Request #{text}</div>
          <div className="text-[#888] max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">{record.content}</div>
        </div>
      ),
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (text: string) => (
        <div className='flex items-center'>
          <div className="w-10 h-10 rounded-full bg-[#e0f7fa] flex items-center justify-center mr-[10px]">
            <UserOutlined className='!text-[#00838f]' />
          </div>
          <div>
            <div className='font-bold'>#{text}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Graduation Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text: string) => (
        <Space>
          <ReadOutlined className='!text-[#888]' />
          {text}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      render: (status: string) => (
        <Tag color={getStatusTagColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: StudentRequest) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewRequest(record)}
            title="View Details"
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout className='!min-h-screen !bg-[#f0f2f5] !p-6'>
      <Content className="!w-full !max-w-[1200px] !mx-auto">
        <div className='mb-6'>
          <h1 className="text-[2em] font-bold text-[#333] mb-2">Student Request Verification</h1>
          <p className='text-[#666]'>Review and manage student discount requests</p>
        </div>

        <Row gutter={[24, 24]} className='!mb-6'>
          <Col xs={24} sm={12} md={6}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className='flex items-center justify-between'>
                <div>
                  <p className='m-0 text-[#666]'>Total Requests</p>
                  <p className='font-bold text-[1.5em] m-0 text-[#333]'>{requests.length}</p>
                </div>
                <FileTextOutlined className='!text-[2em] !text-[#1890ff]' />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className='flex items-center justify-between'>
                <div>
                  <p className='m-0 text-[#666]'>Pending</p>
                  <p className='font-bold text-[1.5em] m-0 text-[#faad14]'>{requests.filter(r => r.requestStatus === 'PENDING').length}</p>
                </div>
                <CalendarOutlined className='!text-[2em] !text-[#faad14]' />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className='flex items-center justify-between'>
                <div>
                  <p className='m-0 text-[#666]'>Approved</p>
                  <p className='font-bold text-[1.5em] m-0 text-[#52c41a]'>{requests.filter(r => r.requestStatus === 'APPROVED').length}</p>
                </div>
                <CheckOutlined className='!text-[2em] !text-[#52c41a]' />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className='flex items-center justify-between'>
                <div>
                  <p className='m-0 text-[#666]'>Rejected</p>
                  <p className='font-bold text-[1.5em] m-0 text-[#ff4d4f]'>{requests.filter(r => r.requestStatus === 'REJECTED').length}</p>
                </div>
                <CloseOutlined className='!text-[2em] !text-[#ff4d4f]' />
              </div>
            </Card>
          </Col>
        </Row>

        <Card className='!mb-6 !shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]'>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={18}>
              <Search
                placeholder="Search by user ID, request ID, or content..."
                onSearch={(value) => setSearchTerm(value)}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='!w-full'
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} md={6}>
              <Space className='!w-full !justify-end' wrap>
                <FilterOutlined className='!text-[rgba(0, 0, 0, 0.45)]' />
                <Select
                  defaultValue="ALL"
                  className='!w-[120px]'
                  onChange={(value) => setStatusFilter(value)}
                >
                  <Option value="ALL">All Status</Option>
                  <Option value="PENDING">Pending</Option>
                  <Option value="APPROVED">Approved</Option>
                  <Option value="REJECTED">Rejected</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={filteredRequests}
            rowKey="requestId"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              total: filteredRequests.length,
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
            selectedRequest && selectedRequest.requestStatus === 'PENDING' ? (
              <div className='flex justify-end gap-3 pt-4 border-t border-solid border-[#f0f0f0]'>
                <Button
                  onClick={() => showApproveConfirm(selectedRequest)}
                  disabled={isSubmitting}
                  className='!bg-teal-600 !text-white hover:!bg-teal-700'
                >
                  Approve
                </Button>
                <Button
                  danger
                  onClick={() => setShowRejectModal(true)}
                  disabled={isSubmitting}
                  className='!bg-red-600 !text-white hover:!bg-red-700'
                >
                  Reject
                </Button>
              </div>
            ) : null
          }
        >
          {selectedRequest && selectedUser && (
            <div className="relative">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white flex items-center z-1 opacity-55 justify-center rounded-lg">
                  <Spin size="large" />
                </div>
              )}

              <div className="py-6 px-0">
                <Row gutter={[24, 24]} className='!mb-6'>
                  <Col xs={24} md={12}>
                    <h3 className='text-[1.2em] font-medium mb-4 text-center'>Request Information</h3>
                    <Space direction="vertical" size="middle" className='!w-full'>
                      <div className='font-bold'>
                        Request #{selectedRequest.requestId}
                      </div>
                      <div>
                        <span className='font-bold'>Status: </span>
                        <Tag color={getStatusTagColor(selectedRequest.requestStatus)} className='!mt-1'>
                          {selectedRequest.requestStatus}
                        </Tag>
                      </div>
                      <div>
                        <span className='font-bold'>Description:</span> {selectedRequest.content}
                      </div>
                      <div>
                        <span className='font-bold'>Graduation Date:</span> {selectedRequest.endDate}
                      </div>
                      <div>
                        <span className='font-bold'>Submitted On:</span> {selectedRequest.createdAt}
                      </div>
                    </Space>
                  </Col>

                  <Col xs={24} md={12}>
                    <h3 className='text-[1.2em] font-medium mb-4 text-center'>User Information</h3>
                    <Space direction="vertical" size="middle" className='!w-full'>
                      <div className='font-bold'>
                        User #{selectedRequest.userId}
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
                  <Col xs={24} md={12}>
                    <div className='text-[#888] text-[0.9em] mb-2'>
                      <CreditCardOutlined className='!mr-1' />
                      Citizen Identity Card
                    </div>
                    <div className="border border-[#f0f0f0] rounded-lg p-4 bg-[#fafafa] flex justify-center items-center">
                      {selectedRequest.citizenIdentityCardImage && selectedRequest.citizenIdentityCardImage.startsWith('data:image') ? (
                        <Image
                          src={selectedRequest.citizenIdentityCardImage}
                          alt="Citizen Identity Card"
                          className='!w-full !h-[192px] !object-contain'
                        />
                      ) : (
                        <div className="w-full h-[192px] bg-[#e8e8e8] rounded-[4px] flex items-center justify-center text-[#888]">
                          No Image Available
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className='text-[#888] text-[0.9em] mb-2'>
                      <ReadOutlined className='!mr-1' />
                      Student Card
                    </div>
                    <div className="border border-[#f0f0f0] rounded-lg p-4 bg-[#fafafa] flex justify-center items-center">
                      {selectedRequest.studentCardImage && selectedRequest.studentCardImage.startsWith('data:image') ? (
                        <Image
                          src={selectedRequest.studentCardImage}
                          alt="Student Card"
                          className='!w-full !h-[192px] !object-contain'
                        />
                      ) : (
                        <div className="w-full h-[192px] bg-[#e8e8e8] rounded-[4px] flex items-center justify-center text-[#888]">
                          No Image Available
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                {selectedRequest.rejectionReason && (
                  <div className='mb-6'>
                    <div className='text-[#888] text-[0.9em] mb-2'>Rejection Reason</div>
                    <div className="p-3 bg-[#fff0f6] border border-[#ffadd2] rounded-lg">
                      <p className='m-0 text-[#cf1322]'>{selectedRequest.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        <Modal
          open={showRejectModal}
          onCancel={() => {setShowRejectModal(false); clearErrors()}}
          title={
            <>
              <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
              Reject Request
            </>
          }
          footer={null}
          centered
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit(handleRejectRequest)}
          >
            <Form.Item
              label="Rejection Reason"
              name="rejectionReason"
              validateStatus={errors.rejectionReason ? 'error' : ''}
              help={errors.rejectionReason?.message}
              required
            >
              <Controller
                name="rejectionReason"
                control={control}
                rules={{ required: 'Rejection Reason is required' }}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    rows={4}
                    placeholder="Provide a clear reason for rejection..."
                  />
                )}
              />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Submit
              </Button>
            </div>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}