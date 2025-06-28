import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tabs, Select, InputNumber, Row, Col, Typography, Divider } from 'antd';
import toast, { Toaster } from 'react-hot-toast';
import { CreditCardOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { COLOR } from '../../constants/color';
import Button from '../../components/Minh/Button';
import type { TicketTypeResponse } from '../../types/tickettype.type';
import { apiGetTicketTypes } from '../../apis/tickettype.api';
import { apiGetStations } from '../../apis/station.api';
import type { StationResponse } from '../../types/station.type';
import type { FareMatrixResponse,FindFareRequest } from '../../types/fare.type';
import { apiFindFareMatrix } from '../../apis/fare.api';
import { apiCreateOrderSingle, apiCreateOrderDays } from '../../apis/order.api';
import { apiGetPaymentMethods } from '../../apis/payment.api';
import type { PaymentMethodResponse, OrderTicketSingleRequest, OrderTicketDaysRequest } from '../../types/order.type';
import { FE_PATH } from '../../constants/path';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
export default function BuyTicket() {
  const {isAuthenticated} = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pass');
  const [selectedPass, setSelectedPass] = useState<number | null>(null);
  const [startStation, setStartStation] = useState<number | null>(null);
  const [endStation, setEndStation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeResponse[]>([]);
  const [stations, setStation] = useState<StationResponse[]>([]);
  const [fareMatrix, setFareMatrix] = useState<FareMatrixResponse>();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch ticket types
        const ticketResponse = await apiGetTicketTypes();
        const filtered = ticketResponse?.data.filter((type) => type.name !== 'Single');
        if (filtered) {
          setTicketTypes(filtered);
        }

        // Fetch stations
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
      } catch (error: any) {
        toast.error(error?.response?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    useEffect(() =>  {
      const fetchFareMatrix = async () => {
        if (startStation && endStation) {
          const request: FindFareRequest = {
            startStationId: startStation,
            endStationId: endStation,
          }
          const response = await apiFindFareMatrix(request);
          if(response){
            setFareMatrix(response.data);
          }
        }
      }
      fetchFareMatrix();
    }, [startStation, endStation])

  const handlePassPurchase = async (ticketType: TicketTypeResponse) => {
    if (paymentMethods.length === 0) {
      toast.error('No payment methods available');
      return;
    }
    if (selectedPaymentMethod === null) {
      toast.error('Please select a payment method');
      return;
    }

    setLoading(true);
     if(!isAuthenticated) {
        navigate(FE_PATH.LOGIN);
       }
    try {
      // Create order for pass ticket
      const orderRequest: OrderTicketDaysRequest = {
        ticketId: { id: ticketType.id },
        paymentMethodId: selectedPaymentMethod
      };
      
      const response = await apiCreateOrderDays(orderRequest);
      
      if (response?.data) {
        // Navigate to order page with created order data
        navigate(FE_PATH.ORDER, {
          state: {
            orderType: 'pass',
            orderId: response.data.orderId,
            ticketType: ticketType,
            amount: ticketType.price,
            quantity: 1,
            selectedPaymentMethod: paymentMethods.find(p => p.paymentMethodId === selectedPaymentMethod)
          }
        });
      } else {
       toast.error(response?.message || 'Failed to create order. Please try again.');
      
      }
    } catch (error: any) {
      toast.error(error?.response?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSingleTicketPurchase = async () => {
    if (!startStation || !endStation) {
      toast.error('Please select both start and end stations.');
      return;
    }
    if (startStation === endStation) {
      toast.error('Start and end stations cannot be the same.');
      return;
    }
    if (!fareMatrix) {
      toast.error('Fare information not available.');
      return;
    }
    if (paymentMethods.length === 0) {
      toast.error('No payment methods available');
      return;
    }
    if (selectedPaymentMethod === null) {
      toast.error('Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      // Create order for single ticket
      const orderRequest: OrderTicketSingleRequest = {
        fareMatrixId: { id: fareMatrix.fareMatrixId },
        paymentMethodId: selectedPaymentMethod
      };
      
      const response = await apiCreateOrderSingle(orderRequest);
      
      if (response?.data) {
        // Navigate to order page with created order data
        navigate(FE_PATH.ORDER, {
          state: {
            orderType: 'single',
            orderId: response.data.orderId,
            fareMatrix: fareMatrix,
            startStation: stations.find(s => s.stationId === startStation),
            endStation: stations.find(s => s.stationId === endStation),
            amount: fareMatrix.price,
            quantity: 1,
            selectedPaymentMethod: paymentMethods.find(p => p.paymentMethodId === selectedPaymentMethod)
          }
        });
      } else {
        toast.error('Failed to create order');
      }
    } catch (error: any) {
      toast.error(error?.response?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
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
          Metro Pass Tickets
        </Title>
        <Text style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.5' }}>
          Choose from our convenient pass options for unlimited travel
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
                    Valid for: {ticket.validityDuration} days
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
            Purchase Details
          </Title>
          <Row gutter={[16, 16]} align="middle">
            <Col span={8}>
              <Text strong style={{ color: '#374151', fontSize: '1rem' }}>Pass: </Text>
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
              <Text strong style={{ color: '#374151', fontSize: '1rem' }}>Total: </Text>
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
                style={{
                  width: '100%',
                  height: '3rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  borderRadius: '12px'
                }}
              >
                Purchase Now
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
              Select Payment Method:
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
                      borderRadius: '12px',
                      boxShadow: selectedPaymentMethod === method.paymentMethodId
                        ? '0 4px 12px rgba(16, 185, 129, 0.25)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                    bodyStyle={{ padding: '1rem', textAlign: 'center' }}
                  >
                    <CreditCardOutlined 
                      style={{
                        fontSize: '1.5rem',
                        marginBottom: '0.5rem',
                        color: selectedPaymentMethod === method.paymentMethodId
                          ? '#059669'
                          : '#9ca3af'
                      }}
                    />
                    <div 
                      style={{
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.25rem'
                      }}
                    >
                      {method.paymentMethodName}
                    </div>
                    {selectedPaymentMethod === method.paymentMethodId && (
                      <div 
                        style={{
                          color: '#059669',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        ✓ Selected
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
          <EnvironmentOutlined style={{ marginRight: '0.5rem', fontSize: '1.25rem' }} />
          Single Journey Ticket
        </Title>
        <Text style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.5' }}>
          Select your start and destination stations
        </Text>
      </div>

      <Card 
        style={{
          border: '2px solid #a7f3d0',
          borderRadius: '16px',
          background: '#ffffff',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
        bodyStyle={{ padding: '2rem' }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Text 
                strong 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  color: '#059669',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                From Station:
              </Text>
              <Select
                placeholder="Select start station"
                value={startStation}
                onChange={setStartStation}
                style={{ width: '100%' }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stations.map(station => (
                  <Option key={station.stationId} value={station.stationId} disabled={station.stationId === endStation}>
                    {station.name} ({station.stationCode})
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: '1.5rem' }}>
              <Text 
                strong 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.75rem', 
                  color: '#059669',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                To Station:
              </Text>
              <Select
                placeholder="Select destination station"
                value={endStation}
                onChange={setEndStation}
                style={{ width: '100%' }}
                size="large"
                showSearch
                filterOption={(input, option) =>
                    (option?.label as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stations.map(station => (
                  <Option key={station.stationId} value={station.stationId} disabled={station.stationId === startStation}>
                    {station.name} ({station.stationCode})
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        {startStation && endStation && (
          <>
            <Divider style={{ margin: '2rem 0', borderColor: '#a7f3d0' }} />
            <div 
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px solid #a7f3d0',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)'
              }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col span={12}>
                  <div>
                    <Text 
                      strong 
                      style={{ 
                        display: 'block', 
                        color: '#047857',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}
                    >
                      Journey Details:
                    </Text>
                    <Text 
                      style={{ 
                        color: '#374151',
                        fontSize: '1rem',
                        fontWeight: '500',
                        display: 'block',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {stations.find(s => s.stationId === startStation)?.name} → {stations.find(s => s.stationId === endStation)?.name}
                    </Text>
                    <Text 
                      style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280'
                      }}
                    >
                      Distance: {Math.abs((stations.find(s => s.stationId === startStation)?.sequenceOrder || 0) - (stations.find(s => s.stationId === endStation)?.sequenceOrder || 0))} stations
                    </Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <Text 
                      strong 
                      style={{ 
                        display: 'block', 
                        color: '#047857',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}
                    >
                      Fare:
                    </Text>
                    <Text 
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#059669'
                      }}
                    >
                      {(fareMatrix?.price || 0).toLocaleString('vi-VN')} VND
                    </Text>
                  </div>
                </Col>
                <Col span={6}>
                  <Button
                    size="large"
                    loading={loading}
                    onClick={handleSingleTicketPurchase}
                    icon={<CreditCardOutlined />}
                    variant="primary"
                    hoverEffect="scale"
                    style={{
                      width: '100%',
                      height: '3rem',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      borderRadius: '12px'
                    }}
                  >
                    Buy Ticket
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
                    color: '#047857',
                    fontSize: '1.125rem',
                    fontWeight: '600'
                  }}
                >
                  Select Payment Method:
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
                          background: '#ffffff',
                          borderRadius: '12px',
                          boxShadow: selectedPaymentMethod === method.paymentMethodId
                            ? '0 4px 12px rgba(16, 185, 129, 0.25)'
                            : '0 2px 8px rgba(0, 0, 0, 0.05)'
                        }}
                        bodyStyle={{ padding: '1rem', textAlign: 'center' }}
                      >
                        <CreditCardOutlined 
                          style={{
                            fontSize: '1.5rem',
                            marginBottom: '0.5rem',
                            color: selectedPaymentMethod === method.paymentMethodId
                              ? '#059669'
                              : '#9ca3af'
                          }}
                        />
                        <div 
                          style={{
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.25rem'
                          }}
                        >
                          {method.paymentMethodName}
                        </div>
                        {selectedPaymentMethod === method.paymentMethodId && (
                          <div 
                            style={{
                              color: '#059669',
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}
                          >
                            ✓ Selected
                          </div>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        padding: '2rem 0'
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '500'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Title 
            level={1} 
            style={{ 
              color: '#059669', 
              marginBottom: '0.75rem',
              fontSize: '3rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Buy Metro Tickets
          </Title>
          <Text 
            style={{ 
              fontSize: '1.25rem', 
              color: '#6b7280',
              fontWeight: '400',
              lineHeight: '1.6'
            }}
          >
            Fast, convenient, and secure ticket purchasing
          </Text>
        </div>

        <Card 
          style={{
            borderRadius: '24px',
            border: 'none',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
            background: '#ffffff',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: '3rem' }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            centered
            items={[
              {
                key: 'pass',
                label: (
                  <span 
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <ClockCircleOutlined style={{ fontSize: '1.25rem' }} />
                    Pass Tickets
                  </span>
                ),
                children: <PassTicketsTab />
              },
              {
                key: 'single',
                label: (
                  <span 
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <EnvironmentOutlined style={{ fontSize: '1.25rem' }} />
                    Single Journey
                  </span>
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