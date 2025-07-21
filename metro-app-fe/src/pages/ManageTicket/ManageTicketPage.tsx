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
  Modal,
  notification,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
} from 'antd';
import { Calculator, CircleDollarSign, ClockPlus, Route, Ruler, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiCreateFarePricing, apiGetFareMatrices, apiUpdateFareMatrix, apiUpdateFarePricing, apiUpdateStatusFareMatrix } from '../../apis/fare.api';
import { apiCreateTicketType, apiUpdateTicketType } from '../../apis/tickettype.api';
import { useAdminStore } from '../../stores/admin.store';
import type { FareMatrix, FareMatrixRequest, FarePricing, FarePricingRequest } from '../../types/fare.type';
import type { TicketType, TicketTypeRequest } from '../../types/tickettype.type';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const ticketTypeSchema = z.object({
  name: z.string().min(1, 'Loại vé là bắt buộc').max(100, 'Không được vượt quá 100 kí tự'),
  price: z.number().min(1000, 'Giá phải lớn hơn 1000'),
  description: z.string().max(500, 'Mô tả không được vượt quá 500 kí tự').optional(),
  validityDuration:
    z.number({
      required_error: "Thời gian là bắt buộc",
      invalid_type_error: "Thời gian là bắt buộc"
    })
      .min(1, 'Thời gian phải từ 1 ngày trở lên')
      .max(365, 'Thời gian không được vượt quá 365 ngày'),
  isActive: z.boolean()
});

const farePricingSchema = z.object({
  minDistanceKm:
    z.number({
      required_error: "Khoảng cách là bắt buộc",
      invalid_type_error: "Khoảng cách là bắt buộc"
    })
      .min(0, 'Min distance must be greater than or equal to 0'),
  maxDistanceKm:
    z.number({
      required_error: "Khoảng cách là bắt buộc",
      invalid_type_error: "Khoảng cách là bắt buộc"
    })
      .min(1, 'Max distance must be greater than 0'),
  price: z.number().min(1000, 'Price must be greater than 1000'),
  isActive: z.boolean()
}).refine((data) => data.maxDistanceKm > data.minDistanceKm, {
  message: "Max distance must be greater than min distance",
  path: ["maxDistanceKm"],
});

type TicketTypeFormInputs = z.infer<typeof ticketTypeSchema>;
type FarePricingFormInputs = z.infer<typeof farePricingSchema>;

export default function ManageTicketPage() {
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('ALL');

  const [filteredFareMatrix, setFilteredFareMatrix] = useState<FareMatrix[]>([]);
  const [fareSearchTerm, setFareSearchTerm] = useState('');
  const [fareStatusFilter, setFareStatusFilter] = useState<string>('ALL');

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filteredFarePricing, setFilteredFarePricing] = useState<FarePricing[]>([]);
  const [pricingSearchTerm, setPricingSearchTerm] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editingPricing, setEditingPricing] = useState<FarePricing | null>(null);
  const [pricingSortBy, setPricingSortBy] = useState<string>('id');

  const [ticketSortBy, setTicketSortBy] = useState<string>('id');
  const [fareSortBy, setFareSortBy] = useState<string>('id');

  const { ticketTypes, fareMatrices, farePricings, setTicketTypes, setFareMatrices, setFarePricings, updateTicketType, updateFareMatrix, updateFarePricing, isFetched } = useAdminStore();

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

  const pricingForm = useForm<FarePricingFormInputs>({
    resolver: zodResolver(farePricingSchema),
    mode: 'onChange',
    defaultValues: {
      minDistanceKm: 0,
      maxDistanceKm: 1,
      price: 0,
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

  const sortFarePricing = (pricings: FarePricing[], sortBy: string) => {
    return [...pricings].sort((a, b) => {
      switch (sortBy) {
        case 'id':
          return a.id - b.id;
        case 'price':
          return a.price - b.price;
        case 'distance':
          return a.minDistanceKm - b.minDistanceKm;
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

    filtered = filtered.filter((ticketType: TicketType) => ticketType.name !== "Vé đơn");

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

  useEffect(() => {
    let filtered = farePricings;

    if (pricingSearchTerm) {
      filtered = filtered.filter(pricing =>
        pricing.id.toString().includes(pricingSearchTerm.toLowerCase()) ||
        pricing.minDistanceKm.toString().includes(pricingSearchTerm.toLowerCase()) ||
        pricing.maxDistanceKm.toString().includes(pricingSearchTerm.toLowerCase()) ||
        pricing.price.toString().includes(pricingSearchTerm.toLowerCase())
      );
    }

    const sorted = sortFarePricing(filtered, pricingSortBy);
    setFilteredFarePricing(sorted);
  }, [pricingSearchTerm, farePricings, pricingSortBy]);

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
          notification.success({ message: 'Cập nhật thành công' });
        } else {
          isError = true;
          notification.error({ message: 'Có lỗi không mong muốn, vui lòng thử lại sau' });
        }
      } else {
        const res = await apiCreateTicketType(ticketTypeRequest);
        if (res && res.status === 200) {
          const newTicketType: TicketType = res.data;
          setTicketTypes([...ticketTypes, newTicketType]);
          notification.success({ message: 'Tạo thành công' });
        } else {
          isError = true;
          notification.error({ message: 'Có lỗi không mong muốn, vui lòng thử lại sau' });
        }
      }
    } finally {
      if (!isError) {
        setShowTicketModal(false);
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
      } else {
        notification.error({ message: 'Có lỗi không mong muốn, vui lòng thử lại sau' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFareStatus = async (data: FareMatrix) => {
    setIsSubmitting(true);

    try {
      const res = await apiUpdateStatusFareMatrix(data.fareMatrixId, !data.isActive);
      if (res && res.status === 200) {
        const updatedFareMatrix: FareMatrix = res.data;
        updateFareMatrix(updatedFareMatrix);
      } else {
        notification.error({ message: 'Có lỗi không mong muốn, vui lòng thử lại sau' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverlapping = (
    min: number,
    max: number,
    existing: FarePricing[],
    editingId?: number
  ): boolean => {
    return existing.some(rule => {
      if (rule.id === editingId) return false;
      return Math.max(min, rule.minDistanceKm) < Math.min(max, rule.maxDistanceKm);
    });
  };

  const handleAddPricing = () => {
    setEditingPricing(null);
    pricingForm.reset({
      minDistanceKm: 0,
      maxDistanceKm: 1,
      price: 0,
      isActive: true
    });
    setShowPricingModal(true);
  };

  const handleEditPricing = (pricing: FarePricing) => {
    setEditingPricing(pricing);
    pricingForm.reset({
      minDistanceKm: pricing.minDistanceKm,
      maxDistanceKm: pricing.maxDistanceKm,
      price: pricing.price,
      isActive: pricing.isActive
    });
    setShowPricingModal(true);
  };

  const handlePricingSubmit = async (data: FarePricingFormInputs) => {
    if (isOverlapping(data.minDistanceKm, data.maxDistanceKm, farePricings, editingPricing?.id)) {
      notification.error({ message: "Khoảng cách này bị trùng hoặc lồng với một khoảng đã có." });
      return;
    }

    let isError = false;
    setIsSubmitting(true);
    const farePricingRequest: FarePricingRequest = {
      minDistanceKm: data.minDistanceKm,
      maxDistanceKm: data.maxDistanceKm,
      price: data.price,
      isActive: data.isActive
    };

    try {
      if (editingPricing) {
        const res = await apiUpdateFarePricing(farePricingRequest, editingPricing.id);
        if (res && res.status === 200) {
          const updatedFarePricing: FarePricing = res.data;
          updateFarePricing(updatedFarePricing);
          const fareMatricesRes = await apiGetFareMatrices();
          if (fareMatricesRes && fareMatricesRes.data) {
            setFareMatrices(fareMatricesRes.data);
          }
          notification.success({ message: 'Cập nhật thành công' });
        } else {
          isError = true;
          notification.error({ message: 'Có lỗi không mong muốn, vui lòng thử lại sau' });
        }
      } else {
        const res = await apiCreateFarePricing(farePricingRequest);
        if (res && res.status === 200) {
          const newFarePricing: FarePricing = res.data;
          setFarePricings([...farePricings, newFarePricing]);
          notification.success({ message: 'Tạo thành công' });
        } else {
          isError = true;
          notification.error({ message: 'Có lỗi không mong muốn, vui lòng thử lại sau' });
        }
      }
    } finally {
      if (!isError) {
        setShowPricingModal(false);
      }
      setIsSubmitting(false);
    }
  };

  const ticketTypeColumns = [
    {
      title: 'Loại vé',
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
      title: 'Giá',
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
      title: 'Thời gian',
      dataIndex: 'validityDuration',
      key: 'validityDuration',
      render: (duration: number) => {
        if (duration !== 0) {
          return `${duration} ngày`;
        } else {
          return "Vé đơn"
        }
      },
    },
    {
      title: 'Trạng thái',
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Hành động',
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
      title: 'Tên tuyến',
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
      title: 'Khoảng cách',
      dataIndex: 'distanceInKm',
      key: 'distanceInKm',
      render: (distanceInKm: number) => (
        <span>{distanceInKm} km</span>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span className='font-bold text-[#52c41a]'>{price.toLocaleString('vi-VN')} VNĐ</span>
      ),
    },
    {
      title: 'Trạng thái',
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const pricingColumns = [
    {
      title: 'Khoảng cách',
      key: 'distance',
      render: (record: FarePricing) => (
        <div>
          <div className='font-bold flex items-center'>
            <Ruler className='!text-[#1890ff] !mr-2' size={16} />
            {record.minDistanceKm} - {record.maxDistanceKm} km
          </div>
          <div className="text-[#888] text-[0.9em]">ID: #{record.id}</div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span className='font-bold text-[#52c41a]'>{price.toLocaleString('vi-VN')} VNĐ</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: FarePricing) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditPricing(record)}
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

  const getPricingStats = () => {
    const active = farePricings.filter(p => p.isActive).length;
    const inactive = farePricings.filter(p => !p.isActive).length;
    return { total: farePricings.length, active, inactive };
  };

  const ticketStats = getTicketStats();
  const fareStats = getFareStats();
  const pricingStats = getPricingStats();

  const items = [
    {
      label: (
        <span>
          Loại vé
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
                    <p className='m-0 text-[#666]'>Tổng số loại vé</p>
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
                    <p className='m-0 text-[#666]'>Đang hoạt động</p>
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
                    <p className='m-0 text-[#666]'>Không hoạt động</p>
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
                  placeholder="Tìm kiếm..."
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
                    <Option value="ALL">Tất cả trạng thái</Option>
                    <Option value="ACTIVE">Đang hoạt động</Option>
                    <Option value="INACTIVE">Không hoạt động</Option>
                  </Select>
                  <Select
                    defaultValue="id"
                    onChange={(value) => setTicketSortBy(value)}
                    placeholder="Sort by"
                  >
                    <Option value="id">Sắp xếp theo ID</Option>
                    <Option value="price">Sắp xếp theo giá</Option>
                    <Option value="created">Sắp xếp theo ngày tạo</Option>
                  </Select>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddTicket}
                    className='!bg-teal-600 !text-white hover:!bg-teal-700'
                  >
                    Thêm loại vé mới
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
          Các tuyến xe
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
                    <p className='m-0 text-[#666]'>Tổng các tuyến xe</p>
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
                    <p className='m-0 text-[#666]'>Đang hoạt động</p>
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
                    <p className='m-0 text-[#666]'>Không hoạt động</p>
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
                  placeholder="Tìm kiếm..."
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
                    <Option value="ALL">Tất cả trạng thái</Option>
                    <Option value="ACTIVE">Đang hoạt động</Option>
                    <Option value="INACTIVE">Không hoạt động</Option>
                  </Select>
                  <Select
                    defaultValue="id"
                    onChange={(value) => setFareSortBy(value)}
                    placeholder="Sort by"
                  >
                    <Option value="id">Sắp xếp theo ID</Option>
                    <Option value="price">Sắp xếp theo giá</Option>
                    <Option value="created">Sắp xếp theo ngày tạo</Option>
                  </Select>
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
    {
      label: (
        <span>
          Giá vé
        </span>
      ),
      key: 'pricing',
      children: (
        <>
          <Row gutter={[24, 24]} className='!mb-6'>
            <Col xs={24} sm={8} md={8}>
              <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='m-0 text-[#666]'>Tổng số</p>
                    <p className='font-bold text-[1.5em] m-0 text-[#333]'>{pricingStats.total}</p>
                  </div>
                  <Calculator className='!text-[2em] !text-[#1890ff]' />
                </div>
              </Card>
            </Col>
          </Row>

          <Card className='!mb-6 !shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]'>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Search
                  placeholder="Tìm kiếm..."
                  onSearch={(value) => setPricingSearchTerm(value)}
                  onChange={(e) => setPricingSearchTerm(e.target.value)}
                  className='!w-full'
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Col>
              <Col xs={24} md={12}>
                <Space className='!w-full !justify-end' wrap>
                  <FilterOutlined className='!text-[rgba(0, 0, 0, 0.45)]' />
                  <Select
                    defaultValue="id"
                    onChange={(value) => setPricingSortBy(value)}
                    placeholder="Sort by"
                  >
                    <Option value="id">Sắp xép theo ID</Option>
                    <Option value="price">Sắp xép theo giá</Option>
                    <Option value="distance">Sắp xép theo khoảng cách</Option>
                  </Select>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddPricing}
                    className='!bg-teal-600 !text-white hover:!bg-teal-700'
                  >
                    Thêm giá vé mới
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Card className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]">
            <Table
              loading={!isFetched}
              columns={pricingColumns}
              dataSource={filteredFarePricing}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                total: filteredFarePricing.length,
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
          <h1 className="text-[2em] font-bold text-[#333] mb-2">Quản lí vé</h1>
          <p className='text-[#666]'>Quản lí chi tiết vé cho hệ thống</p>
        </div>

        <Tabs defaultActiveKey="tickets" size="large" items={items} />

        <Modal
          open={showTicketModal}
          onCancel={() => setShowTicketModal(false)}
          title={editingTicket ? 'Cập nhật vé' : 'Thêm loại vé mới'}
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
                  label="Loại vé"
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
                  label="Giá"
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
                        placeholder="Nhập giá"
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
              label="Thời gian (Ngày)"
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
              label="Mô tả chi tiết"
              validateStatus={ticketForm.formState.errors.description ? 'error' : ''}
              help={ticketForm.formState.errors.description?.message}
            >
              <Controller
                name="description"
                control={ticketForm.control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    placeholder="Thêm mô tả cho loại vé (tùy chọn)"
                    rows={3}
                    maxLength={500}
                    showCount
                  />
                )}
              />
            </Form.Item>

            {!editingTicket && (
              <Form.Item label="Trạng thái">
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
                  {ticketForm.watch('isActive') ? 'Hoạt động' : 'Không hoạt động'}
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
                  {editingTicket ? 'Cập nhật' : 'Xác nhận'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          open={showPricingModal}
          onCancel={() => setShowPricingModal(false)}
          title={editingPricing ? 'Cập nhật giá vé' : 'Thêm giá vé mới'}
          footer={null}
          centered
          width={600}
        >
          <Form
            layout="vertical"
            onFinish={pricingForm.handleSubmit(handlePricingSubmit)}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Từ (km)"
                  validateStatus={pricingForm.formState.errors.minDistanceKm ? 'error' : ''}
                  help={pricingForm.formState.errors.minDistanceKm?.message}
                  required
                >
                  <Controller
                    name="minDistanceKm"
                    control={pricingForm.control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        step={1}
                        className="!w-full"
                        prefix={<Ruler size={20} />}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Đến (km)"
                  validateStatus={pricingForm.formState.errors.maxDistanceKm ? 'error' : ''}
                  help={pricingForm.formState.errors.maxDistanceKm?.message}
                  required
                >
                  <Controller
                    name="maxDistanceKm"
                    control={pricingForm.control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        placeholder="Enter max distance"
                        min={1}
                        step={1}
                        className="!w-full"
                        prefix={<Ruler size={20} />}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Giá"
              validateStatus={pricingForm.formState.errors.price ? 'error' : ''}
              help={pricingForm.formState.errors.price?.message}
              required
            >
              <Controller
                name="price"
                control={pricingForm.control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    placeholder="Nhập giá"
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

            <Form.Item className="!mb-0 !mt-6">
              <Space className="!w-full !justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="!bg-teal-600 !text-white hover:!bg-teal-700"
                >
                  {editingPricing ? 'Cập nhật' : 'Xác nhận'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}