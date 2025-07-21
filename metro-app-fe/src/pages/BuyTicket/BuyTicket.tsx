import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tabs, Select, Row, Col, Typography, Divider } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import { CreditCardOutlined, EnvironmentOutlined, ClockCircleOutlined, NodeIndexOutlined } from '@ant-design/icons';
import Button from '../../components/Minh/Button';
import type { TicketType } from '../../types/tickettype.type';
import { apiGetTicketTypes } from '../../apis/tickettype.api';
import { apiGetStations } from '../../apis/station.api';
import type { Station, StationRouteResponse } from '../../types/station.type';
import type { FareMatrix,FindFareRequest } from '../../types/fare.type';
import { apiFindFareMatrix } from '../../apis/fare.api';
import { apiGetPaymentMethods } from '../../apis/payment.api';
import type { PaymentMethodResponse, OrderTicketSingleRequest, OrderTicketDaysRequest } from '../../types/order.type';
import { FE_PATH } from '../../constants/path';
import { useAuth } from '../../contexts/AuthContext';
import { apiGetRoutes } from '../../apis/route.api';
import type { RoutesResponse } from '../../types/route.type';
import { apiGetStationRoutesByRouteId } from '../../apis/stationeroute.api';

const { Title, Text } = Typography;
const { Option } = Select;
export default function BuyTicket() {
  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pass');
  const [selectedPass, setSelectedPass] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [startStation, setStartStation] = useState<number | null>(null);
  const [endStation, setEndStation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [stationLoading, setStationLoading] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [routes, setRoutes] = useState<RoutesResponse[]>([]);
  const [stationRoutes, setStationRoutes] = useState<StationRouteResponse[]>([]);
  const [stations, setStation] = useState<Station[]>([]);
  const [fareMatrix, setFareMatrix] = useState<FareMatrix>();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch ticket types
        const ticketResponse = await apiGetTicketTypes();
        console.log(ticketResponse?.data)
        const filtered = ticketResponse?.data.filter((type) => 
          !type.name.toLowerCase().includes('single') && type.name !== 'Vé đơn'
        );
        if (filtered) {
          setTicketTypes(filtered);
        }

        // Fetch routes
        const routeResponse = await apiGetRoutes();
        if (routeResponse) {
          setRoutes(routeResponse.data);
        }

        // Fetch stations (keep for fallback or other purposes)
        const stationResponse = await apiGetStations();
        if (stationResponse) {
          setStation(stationResponse.data);
        }

        // Fetch payment methods
        const paymentResponse = await apiGetPaymentMethods();
        if (paymentResponse?.data) {
          const activeMethods = paymentResponse.data.filter(method => method.active);
          setPaymentMethods(activeMethods);
        }
      } catch (error) {
        toast.error((error as Error)?.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch station routes when route is selected
  useEffect(() => {
    const fetchStationRoutes = async () => {
      if (selectedRoute) {
        setStationLoading(true);
        try {
          console.log(`Fetching stations for route ID: ${selectedRoute}`);
          const response = await apiGetStationRoutesByRouteId(selectedRoute);
          if (response?.data) {
            // Sort by sequence order
            const sortedStationRoutes = response.data.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
            setStationRoutes(sortedStationRoutes);
            console.log(`Loaded ${sortedStationRoutes.length} stations for route ${selectedRoute}`);
            // toast.success(`Loaded ${sortedStationRoutes.length} stations for selected route`);
          } else {
            setStationRoutes([]);
            toast.warning('Không tìm thấy ga nào cho tuyến đường đã chọn');
          }
        } catch (error) {
          console.error('Error fetching station routes:', error);
          toast.error('Không thể tải ga cho tuyến đường đã chọn');
          setStationRoutes([]);
        } finally {
          setStationLoading(false);
        }
      } else {
        setStationRoutes([]);
        setStationLoading(false);
      }
      // Reset station selections when route changes
      setStartStation(null);
      setEndStation(null);
      setFareMatrix(undefined);
    };

    fetchStationRoutes();
  }, [selectedRoute]);

  // Clear selected stations if they become inactive
  useEffect(() => {
    if (stationRoutes.length > 0) {
      // Check if start station is still active
      if (startStation) {
        const startStationRoute = stationRoutes.find(sr => sr.id === startStation);
        if (startStationRoute && startStationRoute.status !== 'active') {
          setStartStation(null);
          toast.warning('Ga đi không còn hoạt động và đã được xóa');
        }
      }
      
      // Check if end station is still active
      if (endStation) {
        const endStationRoute = stationRoutes.find(sr => sr.id === endStation);
        if (endStationRoute && endStationRoute.status !== 'active') {
          setEndStation(null);
          toast.warning('Ga đến không còn hoạt động và đã được xóa');
        }
      }
    }
  }, [stationRoutes, startStation, endStation]);

    useEffect(() =>  {
      const fetchFareMatrix = async () => {
        if (startStation && endStation) {
          // Find the actual station IDs from station routes
          const startStationRoute = stationRoutes.find(sr => sr.id === startStation);
          const endStationRoute = stationRoutes.find(sr => sr.id === endStation);
          
          if (startStationRoute && endStationRoute) {
            const request: FindFareRequest = {
              startStationId: startStationRoute.stationsResponse.stationId,
              endStationId: endStationRoute.stationsResponse.stationId,
            }
            const response = await apiFindFareMatrix(request);
            console.log("test", response?.data)
            if(response){
              setFareMatrix(response.data);
            }
          }
        }
      }
      fetchFareMatrix();
    }, [startStation, endStation, stationRoutes])

  const handlePassPurchase = async (ticketType: TicketType) => {
    if (paymentMethods.length === 0) {
      toast.error('Không có phương thức thanh toán nào');
      return;
    }
    if (selectedPaymentMethod === null) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setLoading(true);
     if(!isAuthenticated) {
        navigate(FE_PATH.LOGIN);
         return;
       }
      // Create order for pass ticket
      const orderRequest: OrderTicketDaysRequest = {
        ticketId: { id: ticketType.id },
        paymentMethodId: selectedPaymentMethod
      };

      // Calculate order summary
      const subtotal = ticketType.price;
      const processingFee = 0;
      const total = subtotal + processingFee;

        // Navigate to order page with created order data
        navigate(FE_PATH.ORDER, {
          state: {
            orderType: 'pass',
            orderRequest: orderRequest,
            ticketType: ticketType,
            amount: ticketType.price,
            quantity: 1,
            selectedPaymentMethod: paymentMethods.find(p => p.paymentMethodId === selectedPaymentMethod),
            purchaseTimestamp: new Date().toISOString(),
            orderSummary: {
              subtotal: subtotal,
              processingFee: processingFee,
              total: total
            }
          }
        });
  };

  const handleSingleTicketPurchase = async () => {
    if (!startStation || !endStation) {
      toast.error('Vui lòng chọn cả ga đi và ga đến.');
      return;
    }
    if (startStation === endStation) {
      toast.error('Ga đi và ga đến không thể giống nhau.');
      return;
    }
    if (!fareMatrix) {
      toast.error('Thông tin giá vé không có sẵn.');
      return;
    }
    if (paymentMethods.length === 0) {
      toast.error('Không có phương thức thanh toán nào');
      return;
    }
    if (selectedPaymentMethod === null) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    // Validate that both stations are active
    const startStationRoute = stationRoutes.find(sr => sr.id === startStation);
    const endStationRoute = stationRoutes.find(sr => sr.id === endStation);
    
    if (startStationRoute && startStationRoute.status !== 'active') {
      toast.error('Không thể mua vé: Ga đi không hoạt động');
      return;
    }
    
    if (endStationRoute && endStationRoute.status !== 'active') {
      toast.error('Không thể mua vé: Ga đến không hoạt động');
      return;
    }

    setLoading(true);
    
    if(!isAuthenticated) {
      navigate(FE_PATH.LOGIN);
      return;
    }
      // Create order for single ticket
      const orderRequest: OrderTicketSingleRequest = {
        fareMatrixId: { id: fareMatrix.fareMatrixId },
        paymentMethodId: selectedPaymentMethod
      };

      // Get route information
      const selectedRouteInfo = routes.find(r => r.routeId === selectedRoute);
      
      // Calculate journey details
      const stopsCount = Math.abs((endStationRoute?.sequenceOrder || 0) - (startStationRoute?.sequenceOrder || 0));
      const estimatedDuration = stopsCount * 2; // Estimate 2 minutes per stop
      
      // Calculate order summary
      const subtotal = fareMatrix.price;
      const processingFee = 0;
      const total = subtotal + processingFee;

        // Navigate to order page with created order data
      navigate(FE_PATH.ORDER, {
          state: {
            orderType: 'single',
            orderRequest: orderRequest,
            fareMatrix: fareMatrix,
            startStation: startStationRoute?.stationsResponse,
            endStation: endStationRoute?.stationsResponse,
            amount: fareMatrix.price,
            quantity: 1,
            selectedPaymentMethod: paymentMethods.find(p => p.paymentMethodId === selectedPaymentMethod),
            routeInfo: selectedRouteInfo ? {
              routeId: selectedRouteInfo.routeId,
              routeName: selectedRouteInfo.routeName,
              routeCode: selectedRouteInfo.routeCode
            } : undefined,
            journeyDetails: {
              distance: fareMatrix.distanceInKm,
              estimatedDuration: estimatedDuration,
              stopsCount: stopsCount
            },
            purchaseTimestamp: new Date().toISOString(),
            orderSummary: {
              subtotal: subtotal,
              processingFee: processingFee,
              total: total
            }
          }
    })
  };  


  const PassTicketsTab = () => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title 
          level={3} 
          style={{ 
            color: '#059669', 
            marginBottom: '0.75rem',
            fontSize: '1.5rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ClockCircleOutlined style={{ marginRight: '0.5rem', fontSize: '1.25rem' }} />
          Vé Tháng Metro
        </Title>
        <Text style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.5' }}>
          Chọn từ các tùy chọn vé tháng tiện lợi của chúng tôi để di chuyển không giới hạn
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {ticketTypes.map((ticket) => (
          <Col xs={24} md={8} key={ticket.id}>
            <Card
              hoverable
              style={{
                height: '100%',
                transition: 'all 0.3s ease',
                border: selectedPass === ticket.id ? '2px solid #10b981' : '1px solid #e5e7eb',
                borderRadius: '16px',
                boxShadow: selectedPass === ticket.id 
                  ? '0 8px 32px rgba(16, 185, 129, 0.2), 0 0 0 4px rgba(16, 185, 129, 0.1)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                background: selectedPass === ticket.id 
                  ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' 
                  : '#ffffff'
              }}
              bodyStyle={{ padding: '2rem' }}
              onClick={() => setSelectedPass(ticket.id)}
            >
              <div style={{ textAlign: 'center' }}>
                <Title 
                  level={4} 
                  style={{ 
                    color: '#059669', 
                    marginBottom: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}
                >
                  {ticket.name}
                </Title>
                <div 
                  style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '0.75rem',
                    lineHeight: '1.2'
                  }}
                >
                  {ticket.price.toLocaleString('vi-VN')} VND
                </div>
                <Text 
                  style={{ 
                    color: '#6b7280', 
                    display: 'block', 
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                >
                  {ticket.description}
                </Text>
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid #6ee7b7'
                  }}
                >
                  <Text 
                    style={{ 
                      fontSize: '0.875rem', 
                      color: '#047857',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ClockCircleOutlined style={{ marginRight: '0.25rem', fontSize: '1rem' }} />
                    Có hiệu lực trong: {ticket.validityDuration} ngày
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedPass && (
        <Card 
          style={{
            marginTop: '2rem',
            border: '2px solid #a7f3d0',
            borderRadius: '16px',
           // background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)'
          }}
          bodyStyle={{ padding: '2rem' }}
        >
          <Title 
            level={4} 
            style={{ 
              color: '#059669', 
              marginBottom: '1.5rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}
          >
            Chi tiết mua hàng
          </Title>
          <Row gutter={[16, 16]} align="middle">
            <Col span={8}>
              <Text strong style={{ color: '#374151', fontSize: '1rem' }}>Vé tháng: </Text>
              <Text 
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#059669',
                  display: 'block',
                  marginTop: '0.25rem'
                }}
              >
                {(ticketTypes.find(t => t.id === selectedPass)!.name)}
              </Text>
            </Col>
            <Col span={8}>
              <Text strong style={{ color: '#374151', fontSize: '1rem' }}>Tổng cộng: </Text>
              <Text 
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#059669',
                  display: 'block',
                  marginTop: '0.25rem'
                }}
              >
                {(ticketTypes.find(t => t.id === selectedPass)!.price).toLocaleString('vi-VN')} VND
              </Text>
            </Col>
            <Col span={8}>
              <Button
                size="large"
                loading={loading}
                onClick={() => handlePassPurchase(ticketTypes.find(t => t.id === selectedPass)!)}
                icon={<CreditCardOutlined />}
                variant="primary"
                hoverEffect="scale"
                customStyle={{
                  width: '100%',
                  height: '3rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  borderRadius: '12px'
                }}
              >
                Mua ngay
              </Button>
            </Col>
          </Row>
          
          {/* Payment Method Selection */}
          <div style={{ marginTop: '2rem' }}>
            <Text 
              strong 
              style={{ 
                display: 'block', 
                marginBottom: '1rem', 
                color: '#059669',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}
            >
              Chọn phương thức thanh toán:
            </Text>
            <Row gutter={[12, 12]}>
              {paymentMethods.map((method) => (
                <Col xs={24} sm={12} md={8} key={method.paymentMethodId}>
                  <Card
                    hoverable
                    onClick={() => setSelectedPaymentMethod(method.paymentMethodId)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: selectedPaymentMethod === method.paymentMethodId
                        ? '2px solid #10b981'
                        : '1px solid #d1d5db',
                      background: selectedPaymentMethod === method.paymentMethodId
                        ? '#ffffff'
                        : '#ffffff',
                      borderRadius: '16px',
                      boxShadow: selectedPaymentMethod === method.paymentMethodId
                        ? '0 12px 40px rgba(16, 185, 129, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transform: selectedPaymentMethod === method.paymentMethodId ? 'translateY(-2px)' : 'translateY(0)'
                    }}
                    bodyStyle={{ padding: '2rem', textAlign: 'center' }}
                  >
                    <div 
                      style={{
                        background: selectedPaymentMethod === method.paymentMethodId
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <CreditCardOutlined 
                        style={{
                          fontSize: '1.5rem',
                          color: selectedPaymentMethod === method.paymentMethodId
                            ? '#ffffff'
                            : '#6b7280'
                        }}
                      />
                    </div>
                    <div 
                      style={{
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '0.5rem',
                        fontSize: '1.125rem'
                      }}
                    >
                      {method.paymentMethodName}
                    </div>
                    {selectedPaymentMethod === method.paymentMethodId && (
                      <div 
                        style={{
                          color: '#059669',
                          fontSize: '1rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span style={{ marginRight: '0.5rem' }}>✓</span>
                        Đã chọn
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      )}
    </div>
  );

  const SingleTicketTab = () => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div 
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
          }}
        >
          <EnvironmentOutlined style={{ fontSize: '2rem', color: '#ffffff' }} />
        </div>
        <Title 
          level={2} 
          style={{ 
            color: '#1f2937',
            marginBottom: '1rem',
            fontSize: '2rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}
        >
          Vé Đơn
        </Title>
        <Text style={{ 
          color: '#6b7280', 
          fontSize: '1.125rem', 
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto',
          display: 'block'
        }}>
          Lên kế hoạch cho hành trình của bạn bằng cách chọn tuyến đường và ga đích
        </Text>
      </div>

      <Card 
        style={{
          border: '3px solid #d1fae5',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
        }}
        bodyStyle={{ padding: '3rem' }}
      >
        {/* Route Selection */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div 
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
              }}
            >
              <NodeIndexOutlined style={{ fontSize: '1.5rem', color: '#ffffff' }} />
            </div>
            <Title 
              level={4}
              style={{ 
                color: '#1f2937',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}
            >
              Chọn Tuyến đường của bạn
            </Title>
            <Text style={{ color: '#6b7280', fontSize: '1rem' }}>
              Chọn tuyến metro cho hành trình của bạn
            </Text>
          </div>
          
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Select
              placeholder="Chọn một tuyến metro"
              value={selectedRoute}
              onChange={setSelectedRoute}
              style={{ 
                width: '100%',
                fontSize: '1.125rem'
              }}
              size="large"
              showSearch
              dropdownStyle={{
                borderRadius: '12px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e5e7eb'
              }}
              filterOption={(input, option) =>
                (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {routes.map(route => (
                <Option key={route.routeId} value={route.routeId}>
                  <div style={{ 
                    padding: '0.75rem 0.5rem',
                    borderRadius: '8px',
                    margin: '0.25rem 0'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#1f2937', 
                      fontSize: '1rem',
                      marginBottom: '0.25rem',
                      lineHeight: '1.4',
                      wordWrap: 'break-word',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {route.routeName} ({route.routeCode})
                    </div>
                   
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Station Selection - Only show when route is selected */}
        {!selectedRoute && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '16px',
            border: '2px dashed #cbd5e1',
            margin: '2rem 0'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <EnvironmentOutlined style={{ fontSize: '1.5rem', color: '#ffffff' }} />
            </div>
            <Title level={4} style={{ color: '#1f2937', marginBottom: '0.5rem' }}>
              Chọn Tuyến đường trước
            </Title>
            <Text style={{ color: '#6b7280', fontSize: '1rem' }}>
              Vui lòng chọn một tuyến metro ở trên để xem các ga có sẵn
            </Text>
          </div>
        )}
        
        {selectedRoute && stationRoutes.length > 0 && (
          <>
            <div 
              style={{
                height: '2px',
                background: 'linear-gradient(90deg, #d1fae5, #10b981, #d1fae5)',
                margin: '3rem 0',
                borderRadius: '1px'
              }}
            />
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title 
                  level={4}
                  style={{ 
                    color: '#1f2937',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}
                >
                  Chọn Ga của bạn
                </Title>
                <Text style={{ color: '#6b7280', fontSize: '1rem' }}>
                  Chọn ga đi và ga đến của bạn
                </Text>
              </div>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      padding: '2rem',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0',
                      height: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <EnvironmentOutlined style={{ fontSize: '1rem', color: '#ffffff' }} />
                      </div>
                      <Text 
                        strong 
                        style={{ 
                          color: '#1f2937',
                          fontSize: '1.125rem',
                          fontWeight: '700'
                        }}
                      >
                        Ga đi
                      </Text>
                    </div>
                    <Select
                      placeholder={stationLoading ? "Đang tải ga..." : "Chọn ga đi"}
                      value={startStation}
                      onChange={setStartStation}
                      style={{ width: '100%' }}
                      size="large"
                      showSearch
                      loading={stationLoading}
                      disabled={!selectedRoute || stationLoading}
                      filterOption={(input, option) =>
                        (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {stationRoutes.map(stationRoute => {
                        const isInactive = stationRoute.status !== 'active';
                        const isDisabled = stationRoute.id === endStation || isInactive;
                        
                        return (
                          <Option 
                            key={stationRoute.id} 
                            value={stationRoute.id} 
                            disabled={isDisabled}
                            style={{ 
                              opacity: isInactive ? 0.5 : 1,
                              color: isInactive ? '#9ca3af' : 'inherit'
                            }}
                          >
                            <div style={{ padding: '0.5rem 0' }}>
                              <div style={{ fontWeight: '600', color: '#1f2937' }}>
                                {stationRoute.stationsResponse.name} ({stationRoute.stationsResponse.stationCode})
                                {isInactive && ' (Không khả dụng)'}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>
                                {stationRoute.stationsResponse.address}
                              </div>
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: stationRoute.status === 'active' ? '#059669' : '#dc2626', 
                                marginTop: '1px',
                                fontWeight: '500'
                              }}>
                                ● {stationRoute.status.toUpperCase()}
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                      padding: '2rem',
                      borderRadius: '16px',
                      border: '2px solid #bbf7d0',
                      height: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '0.75rem',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <EnvironmentOutlined style={{ fontSize: '1rem', color: '#ffffff' }} />
                      </div>
                      <Text 
                        strong 
                        style={{ 
                          color: '#1f2937',
                          fontSize: '1.125rem',
                          fontWeight: '700'
                        }}
                      >
                        Ga đến
                      </Text>
                    </div>
                    <Select
                      placeholder={stationLoading ? "Đang tải ga..." : "Chọn ga đến"}
                      value={endStation}
                      onChange={setEndStation}
                      style={{ width: '100%' }}
                      size="large"
                      showSearch
                      loading={stationLoading}
                      disabled={!selectedRoute || stationLoading}
                      filterOption={(input, option) =>
                          (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {stationRoutes.map(stationRoute => {
                        const isInactive = stationRoute.status !== 'active';
                        const isDisabled = stationRoute.id === startStation || isInactive;
                        
                        return (
                          <Option 
                            key={stationRoute.id} 
                            value={stationRoute.id} 
                            disabled={isDisabled}
                            style={{ 
                              opacity: isInactive ? 0.5 : 1,
                              color: isInactive ? '#9ca3af' : 'inherit'
                            }}
                          >
                            <div style={{ padding: '0.5rem 0' }}>
                              <div style={{ fontWeight: '600', color: '#1f2937' }}>
                                {stationRoute.stationsResponse.name} ({stationRoute.stationsResponse.stationCode})
                                {isInactive && ' (Không khả dụng)'}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>
                                {stationRoute.stationsResponse.address}
                              </div>
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: stationRoute.status === 'active' ? '#059669' : '#dc2626', 
                                marginTop: '1px',
                                fontWeight: '500'
                              }}>
                                ● {stationRoute.status.toUpperCase()}
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        )}

        {startStation && endStation && (
          <>
            <div 
              style={{
                height: '2px',
                background: 'linear-gradient(90deg, #d1fae5, #10b981, #d1fae5)',
                margin: '3rem 0',
                borderRadius: '1px'
              }}
            />
            <Card
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '3px solid #a7f3d0',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.2)'
              }}
              bodyStyle={{ padding: '3rem' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <EnvironmentOutlined style={{ fontSize: '1.5rem', color: '#ffffff' }} />
                </div>
                <Title 
                  level={3} 
                  style={{ 
                    color: '#1f2937', 
                    marginBottom: '0.5rem',
                    fontSize: '1.75rem',
                    fontWeight: '700'
                  }}
                >
                  Tóm tắt Hành trình
                </Title>
                <Text style={{ color: '#6b7280', fontSize: '1rem' }}>
                  Xem lại chi tiết chuyến đi và hoàn tất việc mua
                </Text>
              </div>

              <Row gutter={[24, 24]} style={{ marginBottom: '3rem' }}>
                <Col xs={24} md={8}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '50%',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem',
                          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <EnvironmentOutlined style={{ fontSize: '1.25rem', color: '#ffffff' }} />
                      </div>
                      <Text 
                        strong 
                        style={{ 
                          display: 'block', 
                          color: '#374151',
                          fontSize: '1rem',
                          fontWeight: '600',
                          marginBottom: '1rem'
                        }}
                      >
                        Tuyến Hành trình
                      </Text>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div 
                        style={{ 
                          color: '#1f2937',
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          lineHeight: '1.4',
                          marginBottom: '0.75rem'
                        }}
                      >
                        {stationRoutes.find(sr => sr.id === startStation)?.stationsResponse.name}
                      </div>
                      <div style={{ margin: '0.5rem 0', color: '#10b981', fontSize: '1.5rem', fontWeight: '700' }}>
                        ↓
                      </div>
                      <div 
                        style={{ 
                          color: '#1f2937',
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          lineHeight: '1.4'
                        }}
                      >
                        {stationRoutes.find(sr => sr.id === endStation)?.stationsResponse.name}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                      Khoảng cách: {fareMatrix?.distanceInKm || 0} km
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          borderRadius: '50%',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem',
                          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        <NodeIndexOutlined style={{ fontSize: '1.25rem', color: '#ffffff' }} />
                      </div>
                      <Text 
                        strong 
                        style={{ 
                          display: 'block', 
                          color: '#374151',
                          fontSize: '1rem',
                          fontWeight: '600',
                          marginBottom: '1rem'
                        }}
                      >
                        Tuyến Metro
                      </Text>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div 
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: '#10b981',
                          marginBottom: '0.5rem',
                          lineHeight: '1.3'
                        }}
                      >
                        {routes.find(r => r.routeId === selectedRoute)?.routeName}
                      </div>
                      <div style={{ 
                        color: '#6b7280', 
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        background: '#f8fafc',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        display: 'inline-block'
                      }}>
                        {routes.find(r => r.routeId === selectedRoute)?.routeCode}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                      Tổng khoảng cách: {routes.find(r => r.routeId === selectedRoute)?.distanceInKm}km
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          borderRadius: '50%',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1rem',
                          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <CreditCardOutlined style={{ fontSize: '1.25rem', color: '#ffffff' }} />
                      </div>
                      <Text 
                        strong 
                        style={{ 
                          display: 'block', 
                          color: '#374151',
                          fontSize: '1rem',
                          fontWeight: '600',
                          marginBottom: '1rem'
                        }}
                      >
                        Giá Vé
                      </Text>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div 
                        style={{
                          fontSize: '2rem',
                          fontWeight: '800',
                          color: '#10b981',
                          lineHeight: '1.2',
                          marginBottom: '0.25rem'
                        }}
                      >
                        {(fareMatrix?.price || 0).toLocaleString('vi-VN')}
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280', 
                        fontWeight: '500',
                        background: '#f0fdf4',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        display: 'inline-block'
                      }}>
                        VND
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                      Hành trình Đơn
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Payment Method Selection */}
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <Title 
                    level={4}
                    style={{ 
                      color: '#1f2937',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Chọn Phương thức Thanh toán
                  </Title>
                  <Text style={{ color: '#6b7280', fontSize: '1rem' }}>
                    Chọn tùy chọn thanh toán ưa thích của bạn
                  </Text>
                </div>
                <Row gutter={[24, 24]} justify="center">
                  {paymentMethods.map((method) => (
                    <Col xs={24} sm={12} md={8} key={method.paymentMethodId}>
                      <Card
                        hoverable
                        onClick={() => setSelectedPaymentMethod(method.paymentMethodId)}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: selectedPaymentMethod === method.paymentMethodId
                            ? '3px solid #10b981'
                            : '2px solid #e5e7eb',
                          background: selectedPaymentMethod === method.paymentMethodId
                            ? 'linear-gradient(135deg, #f0fdf4, #ecfdf5)'
                            : '#ffffff',
                          borderRadius: '16px',
                          boxShadow: selectedPaymentMethod === method.paymentMethodId
                            ? '0 12px 40px rgba(16, 185, 129, 0.3)'
                            : '0 4px 20px rgba(0, 0, 0, 0.08)',
                          transform: selectedPaymentMethod === method.paymentMethodId ? 'translateY(-2px)' : 'translateY(0)'
                        }}
                        bodyStyle={{ padding: '2rem', textAlign: 'center' }}
                      >
                        <div 
                          style={{
                            background: selectedPaymentMethod === method.paymentMethodId
                              ? 'linear-gradient(135deg, #10b981, #059669)'
                              : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <CreditCardOutlined 
                            style={{
                              fontSize: '1.5rem',
                              color: selectedPaymentMethod === method.paymentMethodId
                                ? '#ffffff'
                                : '#6b7280'
                            }}
                          />
                        </div>
                        <div 
                          style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '0.5rem',
                            fontSize: '1.125rem'
                          }}
                        >
                          {method.paymentMethodName}
                        </div>
                        {selectedPaymentMethod === method.paymentMethodId && (
                          <div 
                            style={{
                              color: '#059669',
                              fontSize: '1rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <span style={{ marginRight: '0.5rem' }}>✓</span>
                            Đã chọn
                          </div>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Button
                  size="large"
                  loading={loading}
                  onClick={handleSingleTicketPurchase}
                  icon={<CreditCardOutlined />}
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: '4rem',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: '#ffffff',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  Mua Vé
                </Button>
              </div>
            </Card>
          </>
        )}
      </Card>
    </div>
  );

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        padding: '3rem 0'
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            padding: '1rem 1.5rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <div 
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)'
            }}
          >
            <CreditCardOutlined style={{ fontSize: '3rem', color: '#ffffff' }} />
          </div>
          <Title 
            level={1} 
            style={{ 
              color: '#1f2937', 
              marginBottom: '1rem',
              fontSize: '3.5rem',
              fontWeight: '800',
              letterSpacing: '-0.025em',
              lineHeight: '1.1'
            }}
          >
            Mua Vé Metro
          </Title>
          <Text 
            style={{ 
              fontSize: '1.5rem', 
              color: '#6b7280',
              fontWeight: '400',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto',
              display: 'block'
            }}
          >
            Mua vé nhanh chóng, tiện lợi và an toàn cho hành trình metro của bạn
          </Text>
        </div>

        <Card 
          style={{
            borderRadius: '32px',
            border: 'none',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.12)',
            background: '#ffffff',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '4rem' }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            centered
            style={{
              marginBottom: '2rem'
            }}
            items={[
              {
                key: 'pass',
                label: (
                  <div 
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ClockCircleOutlined style={{ fontSize: '1.5rem' }} />
                    Vé Tháng
                  </div>
                ),
                children: <PassTicketsTab />
              },
              {
                key: 'single',
                label: (
                  <div 
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <EnvironmentOutlined style={{ fontSize: '1.5rem' }} />
                    Hành trình Đơn
                  </div>
                ),
                children: <SingleTicketTab />
              }
            ]}
          />
        </Card>
      </div>
    </div>
  );
}