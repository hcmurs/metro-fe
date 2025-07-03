import {
  CheckOutlined,
  CloseOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
} from 'antd';
import { CircleDollarSign, ClockPlus, Route, Ticket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiGetStations } from '../../apis/station.api';
import { apiGetTicketTypes } from '../../apis/tickettype.api';
import { useAuth } from '../../contexts/AuthContext';
import type { Station } from '../../types/station.type';
import type { TicketType } from '../../types/tickettype.type';
import type { FareMatrix } from '../../types/fare.type';
import { apiGetFareMatrices } from '../../apis/fare.api';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const ticketTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  price: z.number().min(1000, 'Price must be greater than 1000'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  validityDuration: z.number().min(1, 'Validity duration must be equal or greater than 1 day'),
  isActive: z.boolean()
});

const fareMatrixSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  price: z.number().min(1000, 'Price must be greater than 1000'),
  startStationId: z.number().min(1, 'Start station is required'),
  endStationId: z.number().min(1, 'End station is required'),
  isActive: z.boolean()
});

type TicketTypeFormInputs = z.infer<typeof ticketTypeSchema>;
type FareMatrixFormInputs = z.infer<typeof fareMatrixSchema>;

export default function ManageTicketPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('ALL');

  const [fareMatrices, setFareMatrices] = useState<FareMatrix[]>([]);
  const [filteredFareMatrix, setFilteredFareMatrix] = useState<FareMatrix[]>([]);
  const [fareSearchTerm, setFareSearchTerm] = useState('');
  const [fareStatusFilter, setFareStatusFilter] = useState<string>('ALL');

  const [stations, setStations] = useState<Station[]>([]);

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showFareModal, setShowFareModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [editingFare, setEditingFare] = useState<FareMatrix | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { contextUser } = useAuth();

  const ticketForm = useForm<TicketTypeFormInputs>({
    resolver: zodResolver(ticketTypeSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      validityDuration: 1,
      isActive: true
    },
  });

  const fareForm = useForm<FareMatrixFormInputs>({
    resolver: zodResolver(fareMatrixSchema),
    defaultValues: {
      name: '',
      price: 0,
      startStationId: 0,
      endStationId: 0,
      isActive: true
    }
  });

  const fetchTicketTypes = async () => {
    const res = await apiGetTicketTypes();
    if (res && res.status === 200) {
      setTicketTypes(res.data);
    } else {
      notification.error({
        message: "Cannot fetch data of ticket types"
      });
    }
  };

  const fetchFareMatrix = async () => {
    const res = await apiGetFareMatrices();
    if (res && res.status === 200) {
      setFareMatrices(res.data);
    } else {
      notification.error({
        message: "Cannot fetch data of fare matrices"
      });
    }
  };

  const fetchStations = async () => {
    const res = await apiGetStations();
    if (res && res.status === 200) {
      setStations(res.data);
    } else {
      notification.error({
        message: "Cannot fetch data of ticket types"
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchTicketTypes(),
          fetchFareMatrix(),
          fetchStations()
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = ticketTypes;

    if (ticketSearchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.name.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
        ticket.id.toString().includes(ticketSearchTerm.toLowerCase())
      );
    }

    if (ticketStatusFilter !== 'ALL') {
      const isActive = ticketStatusFilter === 'ACTIVE';
      filtered = filtered.filter(ticket => ticket.isActive === isActive);
    }

    setFilteredTickets(filtered);
  }, [ticketSearchTerm, ticketStatusFilter, ticketTypes]);

  useEffect(() => {
    let filtered = fareMatrices;

    if (fareSearchTerm) {
      filtered = filtered.filter(fare =>
        fare.name.toLowerCase().includes(fareSearchTerm.toLowerCase()) ||
        fare.fareMatrixId.toString().includes(fareSearchTerm.toLowerCase()) ||
        fare.startStationId.toString().includes(fareSearchTerm.toLowerCase()) ||
        fare.endStationId.toString().includes(fareSearchTerm.toLowerCase())
      );
    }

    if (fareStatusFilter !== 'ALL') {
      const isActive = fareStatusFilter === 'ACTIVE';
      filtered = filtered.filter(fare => fare.isActive === isActive);
    }

    setFilteredFareMatrix(filtered);
  }, [fareSearchTerm, fareStatusFilter, fareMatrices]);

  const handleAddTicket = () => {
    setEditingTicket(null);
    ticketForm.reset({
      name: '',
      price: 0,
      description: '',
      validityDuration: 1,
      isActive: true
    });
    setShowTicketModal(true);
  };

  const handleEditTicket = (ticket: TicketType) => {
    setEditingTicket(ticket);
    ticketForm.reset({
      name: ticket.name,
      price: ticket.price,
      description: ticket.description || '',
      validityDuration: ticket.validityDuration,
      isActive: ticket.isActive
    });
    setShowTicketModal(true);
  };

  const handleAddFare = () => {
    setEditingFare(null);
    fareForm.reset();
    setShowFareModal(true);
  };

  const handleEditFare = (fare: FareMatrix) => {
    setEditingFare(fare);
    fareForm.reset({
      name: fare.name,
      price: fare.price,
      startStationId: fare.startStationId,
      endStationId: fare.endStationId,
      isActive: fare.isActive
    });
    setShowFareModal(true);
  };

  const handleTicketSubmit = async (data: TicketTypeFormInputs) => {
    setIsSubmitting(true);
    console.log(data)
    try {
      if (editingTicket) {
        // TODO: Implement update API call

        notification.success({ message: 'Ticket type updated successfully' });
      } else {
        // TODO: Implement create API call

        notification.success({ message: 'Ticket type created successfully' });
      }
      setShowTicketModal(false);
      await fetchTicketTypes();
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFareSubmit = async (data: FareMatrixFormInputs) => {
    if (data.startStationId === data.endStationId) {
      message.error('Start and end stations must be different');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFare) {
        // TODO: Implement update API call
        // const res = await apiUpdateFareMatrix(editingFare.fareMatrixId, data);
        notification.success({ message: 'Fare matrix updated successfully' });
      } else {
        // TODO: Implement create API call
        // const res = await apiCreateFareMatrix(data);
        notification.success({ message: 'Fare matrix created successfully' });
      }
      setShowFareModal(false);
      await fetchFareMatrix();
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handlers
  const handleDeleteTicket = (ticket: TicketType) => {
    Modal.confirm({
      title: 'Delete ticket type?',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${ticket.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          // TODO: Implement delete API call
          // await apiDeleteTicketType(ticket.ticketTypeId);
          notification.success({ message: 'Ticket type deleted successfully' });
          await fetchTicketTypes();
        } catch (error) {
          message.error('Failed to delete ticket type');
        }
      },
    });
  };

  const handleDeleteFare = (fare: FareMatrix) => {
    Modal.confirm({
      title: 'Delete fare matrix?',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${fare.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          // TODO: Implement delete API call
          // await apiDeleteFareMatrix(fare.fareMatrixId);
          notification.success({ message: 'Fare matrix deleted successfully' });
          await fetchFareMatrix();
        } catch (error) {
          message.error('Failed to delete fare matrix');
        }
      },
    });
  };

  // Toggle status handlers
  const handleToggleTicketStatus = async (ticket: TicketType) => {
    try {
      // TODO: Implement toggle status API call
      // await apiToggleTicketTypeStatus(ticket.ticketTypeId, !ticket.isActive);
      notification.success({ message: `Ticket type ${!ticket.isActive ? 'activated' : 'deactivated'}` });
      await fetchTicketTypes();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const handleToggleFareStatus = async (fare: FareMatrix) => {
    try {
      // TODO: Implement toggle status API call
      // await apiToggleFareMatrixStatus(fare.fareMatrixId, !fare.isActive);
      notification.success({ message: `Fare matrix ${!fare.isActive ? 'activated' : 'deactivated'}` });
      await fetchFareMatrix();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  // Get station name helper
  const getStationName = (stationId: number) => {
    const station = stations.find(s => s.stationId === stationId);
    return station ? station.name : `Station #${stationId}`;
  };

  // Table columns
  const ticketTypeColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: TicketType) => (
        <div>
          <div className='font-bold'>{name}</div>
          <div className="text-[#888] text-[0.9em]">ID: #{record.id}</div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        if (price !== 0) {
          return (
            <span className='font-bold text-[#52c41a]'>{price.toLocaleString('vi-VN')} VNĐ</span>
          )
        } else {
          return (
            <span className='font-bold text-[#52c41a]'>Depend</span>
          )
        }
      },
    },
    {
      title: 'Duration',
      dataIndex: 'validityDuration',
      key: 'validityDuration',
      render: (duration: number) => {
        if (duration !== 0) {
          return `${duration} DAYS`;
        } else {
          return "SINGLE"
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: TicketType) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleTicketStatus(record)}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: TicketType) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTicket(record)}
            title="Edit"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTicket(record)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  const fareColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: FareMatrix) => (
        <div>
          <div className='font-bold'>{name}</div>
          <div className="text-[#888] text-[0.9em]">ID: #{record.fareMatrixId}</div>
        </div>
      ),
    },
    {
      title: 'Route',
      key: 'route',
      render: (record: FareMatrix) => (
        <div className='flex items-center'>
          <Route className='!text-[#1890ff] !mr-2' />
          <span>{getStationName(record.startStationId)} → {getStationName(record.endStationId)}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span className='font-bold text-[#52c41a]'>{price.toLocaleString('vi-VN')} VNĐ</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: FareMatrix) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleFareStatus(record)}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: FareMatrix) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditFare(record)}
            title="Edit"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteFare(record)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  const getTicketStats = () => {
    const active = ticketTypes.filter(t => t.isActive).length;
    const inactive = ticketTypes.filter(t => !t.isActive).length;
    return { total: ticketTypes.length, active, inactive };
  };

  const getFareStats = () => {
    const active = fareMatrices.filter(f => f.isActive).length;
    const inactive = fareMatrices.filter(f => !f.isActive).length;
    return { total: fareMatrices.length, active, inactive };
  };

  const ticketStats = getTicketStats();
  const fareStats = getFareStats();

  const items = [
    {
      label: (
        <span>
          Ticket Types
        </span>
      ),
      key: 'tickets',
      children: (
        <>
          <Row gutter={[24, 24]} className='!mb-6'>
            <Col xs={24} sm={8} md={8}>
              <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='m-0 text-[#666]'>Total Tickets</p>
                    <p className='font-bold text-[1.5em] m-0 text-[#333]'>{ticketStats.total}</p>
                  </div>
                  <Ticket className='!text-[2em] !text-[#1890ff]' />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8}>
              <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='m-0 text-[#666]'>Active</p>
                    <p className='font-bold text-[1.5em] m-0 text-[#52c41a]'>{ticketStats.active}</p>
                  </div>
                  <CheckOutlined className='!text-[2em] !text-[#52c41a]' />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8}>
              <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='m-0 text-[#666]'>Inactive</p>
                    <p className='font-bold text-[1.5em] m-0 text-[#ff4d4f]'>{ticketStats.inactive}</p>
                  </div>
                  <CloseOutlined className='!text-[2em] !text-[#ff4d4f]' />
                </div>
              </Card>
            </Col>
          </Row>

          <Card className='!mb-6 !shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]'>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Search
                  placeholder="Search by name, description, or ID..."
                  onSearch={(value) => setTicketSearchTerm(value)}
                  onChange={(e) => setTicketSearchTerm(e.target.value)}
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
                    onChange={(value) => setTicketStatusFilter(value)}
                  >
                    <Option value="ALL">All Status</Option>
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                  </Select>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddTicket}
                    className='!bg-teal-600 !text-white hover:!bg-teal-700'
                  >
                    Add Ticket Type
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
            <Table
              loading={isLoading}
              columns={ticketTypeColumns}
              dataSource={filteredTickets}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                total: filteredTickets.length,
              }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </>
      ),
    },
    {
      label: (
        <span>
          Fare Matrix
        </span>
      ),
      key: 'fare',
      children: (
        <>
          <Row gutter={[24, 24]} className='!mb-6'>
            <Col xs={24} sm={8} md={8}>
              <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='m-0 text-[#666]'>Total Routes</p>
                    <p className='font-bold text-[1.5em] m-0 text-[#333]'>{fareStats.total}</p>
                  </div>
                  <Route className='!text-[2em] !text-[#1890ff]' />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8}>
              <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='m-0 text-[#666]'>Active</p>
                    <p className='font-bold text-[1.5em] m-0 text-[#52c41a]'>{fareStats.active}</p>
                  </div>
                  <CheckOutlined className='!text-[2em] !text-[#52c41a]' />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={8}>
              <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='m-0 text-[#666]'>Inactive</p>
                    <p className='font-bold text-[1.5em] m-0 text-[#ff4d4f]'>{fareStats.inactive}</p>
                  </div>
                  <CloseOutlined className='!text-[2em] !text-[#ff4d4f]' />
                </div>
              </Card>
            </Col>
          </Row>

          <Card className='!mb-6 !shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]'>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Search
                  placeholder="Search by name, stations, or ID..."
                  onSearch={(value) => setFareSearchTerm(value)}
                  onChange={(e) => setFareSearchTerm(e.target.value)}
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
                    onChange={(value) => setFareStatusFilter(value)}
                  >
                    <Option value="ALL">All Status</Option>
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                  </Select>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddFare}
                    className='!bg-teal-600 !text-white hover:!bg-teal-700'
                  >
                    Add Fare Route
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
            <Table
              loading={isLoading}
              columns={fareColumns}
              dataSource={filteredFareMatrix}
              rowKey="fareMatrixId"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                total: filteredFareMatrix.length,
              }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </>
      ),
    },
  ];

  return (
    <Layout className='!min-h-screen !bg-[#f0f2f5] !p-6'>
      <Content className="!w-full !max-w-[1400px] !mx-auto">
        <div className='mb-6'>
          <h1 className="text-[2em] font-bold text-[#333] mb-2">Ticket & Fare Management</h1>
          <p className='text-[#666]'>Manage ticket types and fare matrix for the system</p>
        </div>

        <Tabs defaultActiveKey="tickets" size="large" items={items} />

        {/* Ticket Type Modal */}
        <Modal
          open={showTicketModal}
          onCancel={() => setShowTicketModal(false)}
          title={editingTicket ? 'Edit Ticket Type' : 'Add New Ticket Type'}
          footer={null}
          centered
          width={600}
        >
          <Form
            layout="vertical"
            onFinish={ticketForm.handleSubmit(handleTicketSubmit)}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  validateStatus={ticketForm.formState.errors.name ? 'error' : ''}
                  help={ticketForm.formState.errors.name?.message}
                  required
                >
                  <Controller
                    name="name"
                    control={ticketForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter ticket type name"
                        prefix={<Ticket size={20} />}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Price"
                  validateStatus={ticketForm.formState.errors.price ? 'error' : ''}
                  help={ticketForm.formState.errors.price?.message}
                  required
                >
                  <Controller
                    name="price"
                    control={ticketForm.control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        placeholder="Enter price"
                        min={0}
                        step={1}
                        className="!w-full"
                        prefix={<CircleDollarSign size={20} />}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => Number(value!.replace(/\./g, ''))}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Validity Duration (Day)"
              validateStatus={ticketForm.formState.errors.validityDuration ? 'error' : ''}
              help={ticketForm.formState.errors.validityDuration?.message}
              required
            >
              <Controller
                name="validityDuration"
                control={ticketForm.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter route name"
                    prefix={<ClockPlus size={20} />}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              validateStatus={ticketForm.formState.errors.description ? 'error' : ''}
              help={ticketForm.formState.errors.description?.message}
            >
              <Controller
                name="description"
                control={ticketForm.control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    placeholder="Enter ticket description (optional)"
                    rows={3}
                    maxLength={500}
                    showCount
                  />
                )}
              />
            </Form.Item>

            <Form.Item label="Status">
              <Controller
                name="isActive"
                control={ticketForm.control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                )}
              />
              <span className="ml-2">
                {ticketForm.watch('isActive') ? 'Active' : 'Inactive'}
              </span>
            </Form.Item>

            <Form.Item className="!mb-0 !mt-6">
              <Space className="!w-full !justify-end">
                <Button
                  onClick={() => setShowTicketModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="!bg-teal-600 !text-white hover:!bg-teal-700"
                >
                  {editingTicket ? 'Update' : 'Create'} Ticket Type
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Fare Matrix Modal */}
        <Modal
          open={showFareModal}
          onCancel={() => setShowFareModal(false)}
          title={editingFare ? 'Edit Fare Matrix' : 'Add New Fare Matrix'}
          footer={null}
          centered
          width={600}
        >
          <Form
            layout="vertical"
            onFinish={fareForm.handleSubmit(handleFareSubmit)}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Route Name"
                  validateStatus={fareForm.formState.errors.name ? 'error' : ''}
                  help={fareForm.formState.errors.name?.message}
                  required
                >
                  <Controller
                    name="name"
                    control={fareForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter route name"
                        prefix={<Route size={20} />}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Price"
                  validateStatus={fareForm.formState.errors.price ? 'error' : ''}
                  help={fareForm.formState.errors.price?.message}
                  required
                >
                  <Controller
                    name="price"
                    control={fareForm.control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        placeholder="0.00"
                        min={0}
                        step={0.01}
                        precision={2}
                        className="!w-full"
                        prefix={<CircleDollarSign size={20} />}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Start Station"
                  validateStatus={fareForm.formState.errors.startStationId ? 'error' : ''}
                  help={fareForm.formState.errors.startStationId?.message}
                  required
                >
                  <Controller
                    name="startStationId"
                    control={fareForm.control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select start station"
                        className="!w-full"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {stations.map(station => (
                          <Option key={station.stationId} value={station.stationId}>
                            {station.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="End Station"
                  validateStatus={fareForm.formState.errors.endStationId ? 'error' : ''}
                  help={fareForm.formState.errors.endStationId?.message}
                  required
                >
                  <Controller
                    name="endStationId"
                    control={fareForm.control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select end station"
                        className="!w-full"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {stations.map(station => (
                          <Option key={station.stationId} value={station.stationId}>
                            {station.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Status">
              <Controller
                name="isActive"
                control={fareForm.control}
                render={({ field }) => (
                  <Switch
                    {...field}
                    checked={field.value}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                )}
              />
              <span className="ml-2">
                {fareForm.watch('isActive') ? 'Active' : 'Inactive'}
              </span>
            </Form.Item>

            <Form.Item className="!mb-0 !mt-6">
              <Space className="!w-full !justify-end">
                <Button
                  onClick={() => setShowFareModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="!bg-teal-600 !text-white hover:!bg-teal-700"
                >
                  {editingFare ? 'Update' : 'Create'} Fare Matrix
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}