import { CalendarOutlined, CheckOutlined, CloseOutlined, CreditCardOutlined, ExclamationCircleOutlined, EyeOutlined, FileTextOutlined, FilterOutlined, ReadOutlined, SearchOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Col, Form, Image, Input, Layout, message, Modal, notification, Row, Select, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiVerifyRequest } from '../../apis/user.api';
import { useAdminStore } from '../../stores/admin.store';
import type { StudentRequest, User } from '../../types/user.type';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const rejectSchema = z.object({
  rejectionReason: z.string().min(1, "Lí do từ chối là bắt buộc").max(500, "Lí do từ chối không được quá 500 ký tự"),
});

type RejectFormInputs = z.infer<typeof rejectSchema>;

export default function VerifyRequestPage() {
  const [filteredRequests, setFilteredRequests] = useState<StudentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { isFetched, requests, updateRequest, users } = useAdminStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<RejectFormInputs>({
    resolver: zodResolver(rejectSchema),
    mode: "onChange",
    defaultValues: {
      rejectionReason: "",
    },
  });

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.requestId
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.createdAt.includes(searchTerm.toLowerCase()) ||
          request.endDate.includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (request) => request.requestStatus === statusFilter
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const handleViewRequest = async (record: StudentRequest) => {
    setSelectedRequest(record);
    setShowModal(true);

    const user: User | null = users.find(u => u.userId === record.userId) || null;
    setSelectedUser(user);
  };

  const showApproveConfirm = (record: StudentRequest) => {
    Modal.confirm({
      title: "Xác nhận duyệt yêu cầu này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này sẽ duyệt yêu cầu giảm giá dành cho sinh viên",
      okText: "Duyệt",
      okType: "primary",
      cancelText: "Hủy",
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
      notification.success({ message: "Approved successfully" });
      setShowModal(false);
      updateRequest(res.data);
    } else {
      message.error("Something wen't wrong");
    }

    setIsSubmitting(false);
  };

  const handleRejectRequest = async (data: RejectFormInputs) => {
    if (!selectedRequest) return;
    setIsSubmitting(true);

    const res = await apiVerifyRequest(
      selectedRequest.requestId,
      false,
      data.rejectionReason
    );
    if (res && res.status === 200) {
      notification.success({ message: "Rejected successfully" });
      setShowRejectModal(false);
      setShowModal(false);
      updateRequest(res.data);
      reset();
    } else {
      message.error("Something went wrong");
    }
    setIsSubmitting(false);
  };

  const columns = [
    {
      title: "Thông tin yêu cầu",
      dataIndex: "requestId",
      key: "requestId",
      render: (text: string, record: StudentRequest) => (
        <div>
          <div className="font-bold">Yêu cầu #{text}</div>
          <div className="text-[#888] max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
            {record.content}
          </div>
        </div>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'userId',
      key: 'userId',
      render: (text: string, record: StudentRequest) => (
        <div>{users.find((user: User) => user.userId === record.userId)?.email}</div>
      ),
    },
    {
      title: "Ngày tốt nghiệp",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => (
        <Space>
          <ReadOutlined className="!text-[#888]" />
          {text}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "requestStatus",
      key: "requestStatus",
      render: (status: string) => (
        <Tag color={getStatusTagColor(status)}>
          {status === "PENDING"
            ? "Chờ duyệt"
            : status === "APPROVED"
              ? "Thành công"
              : "Từ chối"}
        </Tag>
      ),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: StudentRequest) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewRequest(record)}
            title="Xem chi tiết"
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout className="!min-h-screen !bg-[#f0f2f5] !p-6">
      <Content className="!w-full !max-w-[1200px] !mx-auto">
        <div className="mb-6">
          <h1 className="text-[2em] font-bold text-[#333] mb-2">
            Quản lí yêu cầu sinh viên
          </h1>
          <p className="text-[#666]">
            Xem và quản lí các yêu cầu sinh viên để cấp thẻ giảm giá
          </p>
        </div>

        <Row gutter={[24, 24]} className="!mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="m-0 text-[#666]">Tổng yêu cầu</p>
                  <p className="font-bold text-[1.5em] m-0 text-[#333]">
                    {requests.length}
                  </p>
                </div>
                <FileTextOutlined className="!text-[2em] !text-[#1890ff]" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="m-0 text-[#666]">Chờ duyệt</p>
                  <p className="font-bold text-[1.5em] m-0 text-[#faad14]">
                    {
                      requests.filter((r) => r.requestStatus === "PENDING")
                        .length
                    }
                  </p>
                </div>
                <CalendarOutlined className="!text-[2em] !text-[#faad14]" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="m-0 text-[#666]">Thành công</p>
                  <p className="font-bold text-[1.5em] m-0 text-[#52c41a]">
                    {
                      requests.filter((r) => r.requestStatus === "APPROVED")
                        .length
                    }
                  </p>
                </div>
                <CheckOutlined className="!text-[2em] !text-[#52c41a]" />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="m-0 text-[#666]">Từ chối</p>
                  <p className="font-bold text-[1.5em] m-0 text-[#ff4d4f]">
                    {
                      requests.filter((r) => r.requestStatus === "REJECTED")
                        .length
                    }
                  </p>
                </div>
                <CloseOutlined className="!text-[2em] !text-[#ff4d4f]" />
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="!mb-6 !shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={18}>
              <Search
                placeholder="Tìm kiếm theo ID, nội dung, ngày tạo..."
                onSearch={(value) => setSearchTerm(value)}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!w-full"
                prefix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} md={6}>
              <Space className="!w-full !justify-end" wrap>
                <FilterOutlined className="!text-[rgba(0, 0, 0, 0.45)]" />
                <Select
                  defaultValue="ALL"
                  className="!w-[120px]"
                  onChange={(value) => setStatusFilter(value)}
                >
                  <Option value="ALL">Tất cả</Option>
                  <Option value="PENDING">Chờ duyệt</Option>
                  <Option value="APPROVED">Thành công</Option>
                  <Option value="REJECTED">Từ chối</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
          <Table
            loading={!isFetched}
            columns={columns}
            dataSource={filteredRequests}
            rowKey="requestId"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              total: filteredRequests.length,
            }}
            scroll={{ x: "max-content" }}
          />
        </Card>

        <Modal
          open={showModal}
          onCancel={() => setShowModal(false)}
          width={800}
          centered
          footer={
            selectedRequest && selectedRequest.requestStatus === "PENDING" ? (
              <div className="flex justify-end gap-3 pt-4 border-t border-solid border-[#f0f0f0]">
                <Button
                  onClick={() => showApproveConfirm(selectedRequest)}
                  disabled={isSubmitting}
                  className="!bg-teal-600 !text-white hover:!bg-teal-700"
                >
                  Duyệt
                </Button>
                <Button
                  danger
                  onClick={() => setShowRejectModal(true)}
                  disabled={isSubmitting}
                  className="!bg-red-600 !text-white hover:!bg-red-700"
                >
                  Từ chối
                </Button>
              </div>
            ) : null
          }
        >
          {selectedRequest && selectedUser && (
            <div className="relative">
              <div className="py-6 px-0">
                <Row gutter={[24, 24]} className="!mb-6">
                  <Col xs={24} md={12}>
                    <h3 className="text-[1.2em] font-medium mb-4 text-center">
                      Thông tin yêu cầu
                    </h3>
                    <Space
                      direction="vertical"
                      size="middle"
                      className="!w-full"
                    >
                      <div className="font-bold">
                        Id: {selectedRequest.requestId}
                      </div>
                      <div>
                        <span className="font-bold">Trạng thái: </span>
                        <Tag color={getStatusTagColor(selectedRequest.requestStatus)}>
                          {selectedRequest.requestStatus === "PENDING"
                            ? "Chờ duyệt"
                            : selectedRequest.requestStatus === "APPROVED"
                              ? "Thành công"
                              : "Từ chối"}
                        </Tag>
                      </div>
                      <div>
                        <span className="font-bold">Mô tả:</span>{" "}
                        {selectedRequest.content}
                      </div>
                      <div>
                        <span className="font-bold">Ngày tốt nghiệp:</span>{" "}
                        {selectedRequest.endDate}
                      </div>
                      <div>
                        <span className="font-bold">Thời gian tạo:</span>{" "}
                        {selectedRequest.createdAt}
                      </div>
                    </Space>
                  </Col>

                  <Col xs={24} md={12}>
                    <h3 className="text-[1.2em] font-medium mb-4 text-center">
                      Thông tin người dùng
                    </h3>
                    <Space
                      direction="vertical"
                      size="middle"
                      className="!w-full"
                    >
                      <div className="font-bold">
                        Id: {selectedRequest.userId}
                      </div>
                      <div>
                        <span className="font-bold">Tên:</span>{" "}
                        {selectedUser.name}
                      </div>
                      <div>
                        <span className="font-bold">Email:</span>{" "}
                        {selectedUser.email}
                      </div>
                      <div>
                        <span className="font-bold">CCCD:</span>{" "}
                        {selectedRequest.citizenIdNumber}
                      </div>
                      <div>
                        <span className="font-bold">Thời gian tạo tài khoản:</span>{" "}
                        {selectedUser.createdAt}
                      </div>
                    </Space>
                  </Col>
                </Row>

                <Row gutter={[24, 24]} className="!mb-6">
                  <Col xs={24} md={12}>
                    <div className="text-[#888] text-[0.9em] mb-2">
                      <CreditCardOutlined className="!mr-1" />
                      CCCD
                    </div>
                    <div className="border border-[#f0f0f0] rounded-lg p-4 bg-[#fafafa] flex justify-center items-center">
                      {selectedRequest.citizenIdentityCardImage &&
                        selectedRequest.citizenIdentityCardImage.startsWith(
                          "data:image"
                        ) ? (
                        <Image
                          src={selectedRequest.citizenIdentityCardImage}
                          alt="CCCD"
                          className="!w-full !h-[192px] !object-contain"
                        />
                      ) : (
                        <div className="w-full h-[192px] bg-[#e8e8e8] rounded-[4px] flex items-center justify-center text-[#888]">
                          No Image Available
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="text-[#888] text-[0.9em] mb-2">
                      <ReadOutlined className="!mr-1" />
                      Thẻ sinh viên
                    </div>
                    <div className="border border-[#f0f0f0] rounded-lg p-4 bg-[#fafafa] flex justify-center items-center">
                      {selectedRequest.studentCardImage &&
                        selectedRequest.studentCardImage.startsWith(
                          "data:image"
                        ) ? (
                        <Image
                          src={selectedRequest.studentCardImage}
                          alt="Thẻ sinh viên"
                          className="!w-full !h-[192px] !object-contain"
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
                  <div className="mb-6">
                    <div className="text-[#888] text-[0.9em] mb-2">
                      Rejection Reason
                    </div>
                    <div className="p-3 bg-[#fff0f6] border border-[#ffadd2] rounded-lg">
                      <p className="m-0 text-[#cf1322]">
                        {selectedRequest.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        <Modal
          open={showRejectModal}
          onCancel={() => {
            setShowRejectModal(false);
            clearErrors();
          }}
          title={
            <>
              <ExclamationCircleOutlined
                style={{ color: "#faad14", marginRight: 8 }}
              />
              Từ chối yêu cầu
            </>
          }
          footer={null}
          centered
        >
          <Form layout="vertical" onFinish={handleSubmit(handleRejectRequest)}>
            <Form.Item
              label="Lí do từ chối"
              name="rejectionReason"
              validateStatus={errors.rejectionReason ? "error" : ""}
              help={errors.rejectionReason?.message}
              required
            >
              <Controller
                name="rejectionReason"
                control={control}
                rules={{ required: "Rejection Reason is required" }}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    rows={4}
                    placeholder="Ghi lí do từ chối tại đây..."
                  />
                )}
              />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Gửi
              </Button>
            </div>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
