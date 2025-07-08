import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
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
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiCreateFareMatrix, apiUpdateFareMatrix } from '../../apis/fare.api';
import { apiCreateTicketType, apiUpdateTicketType } from '../../apis/tickettype.api';
import { useAdminStore } from '../../stores/admin.store';
import type { FareMatrix, FareMatrixRequest } from '../../types/fare.type';
import type { TicketType, TicketTypeRequest } from '../../types/tickettype.type';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const ticketTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  price: z.number().min(1000, 'Price must be greater than 1000'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  validityDuration:
    z.number({
      required_error: "Validity duration is required",
      invalid_type_error: "Validity duration is required"
    })
      .min(1, 'Validity duration must be equal or greater than 1 day')
      .max(365, 'Validity duration cannot exceed 365'),
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
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('ALL');

  const [filteredFareMatrix, setFilteredFareMatrix] = useState<FareMatrix[]>([]);
  const [fareSearchTerm, setFareSearchTerm] = useState('');
  const [fareStatusFilter, setFareStatusFilter] = useState<string>('ALL');

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showFareModal, setShowFareModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [editingFare, setEditingFare] = useState<FareMatrix | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ticketSortBy, setTicketSortBy] = useState<string>('id');
  const [fareSortBy, setFareSortBy] = useState<string>('id');

  const { ticketTypes, fareMatrices, stations, setTicketTypes, setFareMatrices, updateTicketType, updateFareMatrix, isFetched } = useAdminStore();

  const ticketForm = useForm<TicketTypeFormInputs>({
    resolver: zodResolver(ticketTypeSchema),
    mode: 'onChange',
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
    mode: 'onChange',
    defaultValues: {
      name: '',
      price: 0,
      startStationId: 0,
      endStationId: 0,
      isActive: true
    }
  });

  const sortTickets = (tickets: TicketType[], sortBy: string) => {
    return [...tickets].sort((a, b) => {
      switch (sortBy) {
        case 'id':
          return a.id - b.id;
        case 'price':
          return a.price - b.price;
        case 'created':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  };

  const sortFares = (fares: FareMatrix[], sortBy: string) => {
    return [...fares].sort((a, b) => {
      switch (sortBy) {
        case 'id':
          return a.fareMatrixId - b.fareMatrixId;
        case 'price':
          return a.price - b.price;
        case 'created':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  };

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

    const sorted = sortTickets(filtered, ticketSortBy);

    setFilteredTickets(sorted);
  }, [ticketSearchTerm, ticketStatusFilter, ticketTypes, ticketSortBy]);

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

    const sorted = sortFares(filtered, fareSortBy);

    setFilteredFareMatrix(sorted);
  }, [fareSearchTerm, fareStatusFilter, fareMatrices, fareSortBy]);

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
    fareForm.reset({
      name: '',
      price: 0,
      startStationId: 1,
      endStationId: 1,
      isActive: true
    });
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

  const handleTicketTypeSubmit = async (data: TicketTypeFormInputs) => {
    let isError = false;
    setIsSubmitting(true);
    const ticketTypeRequest: TicketTypeRequest = {
      description: data.description || '',
      isActive: data.isActive,
      name: data.name,
      price: data.price,
      validityDuration: data.validityDuration
    };

    try {
      if (editingTicket) {
        const res = await apiUpdateTicketType(ticketTypeRequest, editingTicket.id);
        if (res && res.status === 200) {
          const updatedTicketType: TicketType = res.data;
          updateTicketType(updatedTicketType);
          notification.success({ message: 'Update successfully' });
        } else {
          isError = true;
          notification.error({ message: 'Fail to update, try again later' });
        }
      } else {
        const res = await apiCreateTicketType(ticketTypeRequest);
        if (res && res.status === 200) {
          const newTicketType: TicketType = res.data;
          setTicketTypes([...ticketTypes, newTicketType]);
          notification.success({ message: 'Create successfully' });
        } else {
          isError = true;
          notification.error({ message: 'Fail to create, try again later' });
        }
      }
    } finally {
      if (!isError) {
        setShowTicketModal(false);
      }
      setIsSubmitting(false);
    }
  };

  const handleFareSubmit = async (data: FareMatrixFormInputs) => {
    if (data.startStationId === data.endStationId) {
      message.error('Start and end stations must be different');
      return;
    }

    let isError = false;
    setIsSubmitting(true);
    const fareMatrixRequest: FareMatrixRequest = {
      name: data.name,
      endStationId: data.endStationId,
      startStationId: data.startStationId,
      isActive: data.isActive,
      price: data.price
    };

    try {
      if (editingFare) {
        const res = await apiUpdateFareMatrix(fareMatrixRequest, editingFare.fareMatrixId);
        if (res && res.status === 200) {
          const updatedFareMatrix: FareMatrix = res.data;
          updateFareMatrix(updatedFareMatrix);
          notification.success({ message: 'Update successfully' });
        } else {
          isError = true;
          notification.error({ message: 'Fail to update, try again later' });
        }
      } else {
        const res = await apiCreateFareMatrix(fareMatrixRequest);
        if (res && res.status === 200) {
          const newFareMatrix: FareMatrix = res.data;
          setFareMatrices([...fareMatrices, newFareMatrix]);
          notification.success({ message: 'Create successfully' });
        } else {
          isError = true;
          notification.error({ message: 'Fail to create, try again later' });
        }
      }
    } finally {
      if (!isError) {
        setShowFareModal(false);
      }
      setIsSubmitting(false);
    }
  };

  const handleToggleTicketTypeStatus = async (data: TicketType) => {
    setIsSubmitting(true);
    const ticketTypeRequest: TicketTypeRequest = {
      description: data.description || '',
      isActive: !data.isActive,
      name: data.name,
      price: data.price,
      validityDuration: data.validityDuration
    };

    try {
      const res = await apiUpdateTicketType(ticketTypeRequest, data.id);
      if (res && res.status === 200) {
        const updatedTicketType: TicketType = res.data;
        updateTicketType(updatedTicketType);
        notification.success({ message: `${!data.isActive ? 'Activated' : 'Deactivated'} successfully` });
      } else {
        notification.error({ message: 'Failed to update status, try again later' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFareStatus = async (data: FareMatrix) => {
    setIsSubmitting(true);
    const fareMatrixRequest: FareMatrixRequest = {
      name: data.name,
      endStationId: data.endStationId,
      startStationId: data.startStationId,
      isActive: !data.isActive,
      price: data.price
    };

    try {
      const res = await apiUpdateFareMatrix(fareMatrixRequest, data.fareMatrixId);
      if (res && res.status === 200) {
        const updatedFareMatrix: FareMatrix = res.data;
        updateFareMatrix(updatedFareMatrix);
        notification.success({ message: `${!data.isActive ? 'Activated' : 'Deactivated'} successfully` });
      } else {
        notification.error({ message: 'Failed to update status, try again later' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStationName = (stationId: number) => {
    const station = stations.find(s => s.stationId === stationId);
    return station ? station.name : `Station #${stationId}`;
  };

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
          onChange={() => handleToggleTicketTypeStatus(record)}
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
                    className='!w-25'
                    defaultValue="ALL"
                    onChange={(value) => setTicketStatusFilter(value)}
                  >
                    <Option value="ALL">All Status</Option>
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                  </Select>
                  <Select
                    className='!w-32'
                    defaultValue="id"
                    onChange={(value) => setTicketSortBy(value)}
                    placeholder="Sort by"
                  >
                    <Option value="id">Sort by ID</Option>
                    <Option value="price">Sort by Price</Option>
                    <Option value="created">Sort by Created Date</Option>
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
              loading={!isFetched}
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
                    className='!w-25'
                    defaultValue="ALL"
                    onChange={(value) => setFareStatusFilter(value)}
                  >
                    <Option value="ALL">All Status</Option>
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                  </Select>
                  <Select
                    className='!w-32'
                    defaultValue="id"
                    onChange={(value) => setFareSortBy(value)}
                    placeholder="Sort by"
                  >
                    <Option value="id">Sort by ID</Option>
                    <Option value="price">Sort by Price</Option>
                    <Option value="created">Sort by Created Date</Option>
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
              loading={!isFetched}
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
          <h1 className="text-[2em] font-bold text-[#333] mb-2">Ticket Management</h1>
          <p className='text-[#666]'>Manage ticket types and fare matrix for the system</p>
        </div>

        <Tabs defaultActiveKey="tickets" size="large" items={items} />

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
            onFinish={ticketForm.handleSubmit(handleTicketTypeSubmit)}
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
                  <InputNumber
                    {...field}
                    placeholder="Enter validity duration"
                    step={1}
                    className="!w-full"
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

            {!editingTicket && (
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
            )}

            <Form.Item className="!mb-0 !mt-6">
              <Space className="!w-full !justify-end">
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

            {!editingFare && (
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
            )}

            <Form.Item className="!mb-0 !mt-6">
              <Space className="!w-full !justify-end">
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