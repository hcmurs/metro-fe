import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Divider, Spin } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import Button from '../../components/Minh/Button';
import { apiCreateVnPayPayment } from '../../apis/vnpay.api';
import { apiCheckoutStripe } from '../../apis/stripe.api';
import { FE_PATH } from '../../constants/path';
import { apiCreateOrderDays,apiCreateOrderSingle } from '../../apis/order.api';
import type { OrderPageState } from '../../types/order.type';
import type { OrderTicketDaysRequest, OrderTicketSingleRequest } from '../../types/order.type';
const { Title, Text } = Typography;

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderPageState | null>(null);

  useEffect(() => {
    // Get order data from navigation state
    const state = location.state as OrderPageState;
    if (!state || !state.selectedPaymentMethod) {
      toast.error('No order data found. Redirecting to buy ticket page.');
      navigate(FE_PATH.BUY_TICKET);
      return;
    }
    setOrderData(state);
  }, [location.state, navigate]);

  const handlePayment = async () => {
    if (!orderData || !orderData.selectedPaymentMethod) {
      toast.error('No payment method selected');
      return;
    }

    setLoading(true);
    let createdOrderId: number;

    try {
      // Create order first and get the order ID
      if (orderData.orderType === 'pass') {
        const response = await apiCreateOrderDays(orderData.orderRequest as OrderTicketDaysRequest);
        if (response?.data) {
          createdOrderId = response.data.orderId;
        } else {
          toast.error('Failed to create order: ' + response?.message);
          setLoading(false);
          return;
        }
      } else {
        const response = await apiCreateOrderSingle(orderData.orderRequest as OrderTicketSingleRequest);
        if (response?.data) {
          createdOrderId = response.data.orderId;
        } else {
          toast.error('Failed to create order: ' + response?.message);
          setLoading(false);
          return;
        }
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error?.response?.message || 'An error occurred while creating the order');
      setLoading(false);
      return;
    }

    // Now proceed with payment using the created order ID
    const selectedMethod = orderData.selectedPaymentMethod;
    try {
      let paymentResponse;
      
      if (selectedMethod.paymentMethodName.toLowerCase().includes('vnpay')) {
        paymentResponse = await apiCreateVnPayPayment(createdOrderId);
        if (paymentResponse?.data) {
          // Redirect to VNPay payment URL
          window.location.href = paymentResponse.data.paymentUrl;
          return;
        }
      } else if (selectedMethod.paymentMethodName.toLowerCase().includes('stripe')) {
        paymentResponse = await apiCheckoutStripe(createdOrderId);
        if (paymentResponse?.data) {
          // Redirect to Stripe approval URL
          window.location.href = paymentResponse.data.sessionUrl;
          return;
        }
      }

      if (!paymentResponse) {
        toast.error('Failed to initiate payment');
      }
    } catch (error: any) {
      toast.error(error?.response?.message || 'Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const calculateTotal = () => {
    if (!orderData) return 0;
    return orderData.amount * (orderData.quantity || 1);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh',  padding: '2rem 0' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Title 
            level={1} 
            style={{ 
              color: '#059669', 
              marginBottom: '0.5rem',
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Complete Your Order
          </Title>
          <Text style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: '400' }}>
            Review your ticket details and proceed with secure payment
          </Text>
        </div>

        <Row gutter={[32, 32]}>
          {/* Order Summary */}
          <Col xs={24} lg={14}>
            <Card 
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                marginBottom: '2rem',
                background: '#ffffff',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '2rem' }}
            >
              <Title 
                level={3} 
                style={{ 
                  color: '#059669', 
                  marginBottom: '1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CheckCircleOutlined style={{ marginRight: '0.5rem', fontSize: '1.25rem' }} />
                Order Summary
              </Title>
              
              {orderData.orderType === 'single' ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid #d1fae5'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <EnvironmentOutlined 
                        style={{ 
                          color: '#059669', 
                          marginRight: '0.5rem', 
                          fontSize: '1.125rem' 
                        }} 
                      />
                      <Text 
                        strong 
                        style={{ 
                          color: '#047857', 
                          fontSize: '1.125rem',
                          fontWeight: '600'
                        }}
                      >
                        Single Journey Ticket
                      </Text>
                    </div>
                    <div 
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem',
                        marginTop: '1rem'
                      }}
                    >
                      <div>
                        <Text style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>From:</Text>
                        <div style={{ fontWeight: '600', fontSize: '1rem', color: '#1f2937', marginTop: '0.25rem' }}>
                          {orderData.startStation?.name}
                        </div>
                        <Text style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({orderData.startStation?.stationCode})</Text>
                      </div>
                      <div>
                        <Text style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>To:</Text>
                        <div style={{ fontWeight: '600', fontSize: '1rem', color: '#1f2937', marginTop: '0.25rem' }}>
                          {orderData.endStation?.name}
                        </div>
                        <Text style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({orderData.endStation?.stationCode})</Text>
                      </div>
                    </div>
                    <Divider style={{ margin: '1rem 0', borderColor: '#a7f3d0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <Text style={{ color: '#374151', fontWeight: '500' }}>Fare per ticket:</Text>
                      <Text 
                        strong 
                        style={{ 
                          color: '#059669', 
                          fontSize: '1.125rem',
                          fontWeight: '600'
                        }}
                      >
                        {orderData.fareMatrix?.price.toLocaleString('vi-VN')} VND
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: '#374151', fontWeight: '500' }}>Quantity:</Text>
                      <Text strong style={{ fontSize: '1.125rem', fontWeight: '600' }}>{orderData.quantity || 1}</Text>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div 
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid #d1fae5'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <ClockCircleOutlined 
                        style={{ 
                          color: '#059669', 
                          marginRight: '0.5rem', 
                          fontSize: '1.125rem' 
                        }} 
                      />
                      <Text 
                        strong 
                        style={{ 
                          color: '#047857', 
                          fontSize: '1.125rem',
                          fontWeight: '600'
                        }}
                      >
                        Metro Pass Ticket
                      </Text>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Title 
                        level={4} 
                        style={{ 
                          color: '#059669', 
                          marginBottom: '0.75rem',
                          fontSize: '1.25rem',
                          fontWeight: '600'
                        }}
                      >
                        {orderData.ticketType?.name}
                      </Title>
                      <Text 
                        style={{ 
                          color: '#6b7280', 
                          display: 'block', 
                          marginBottom: '1rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.5'
                        }}
                      >
                        {orderData.ticketType?.description}
                      </Text>
                      <div 
                        style={{
                          background: '#ffffff',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #d1fae5',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <Text 
                          style={{ 
                            fontSize: '0.875rem', 
                            color: '#047857',
                            fontWeight: '500'
                          }}
                        >
                          <ClockCircleOutlined style={{ marginRight: '0.25rem' }} />
                          Valid for: {orderData.ticketType?.validityDuration} days
                        </Text>
                      </div>
                    </div>
                    <Divider style={{ margin: '1rem 0', borderColor: '#a7f3d0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <Text style={{ color: '#374151', fontWeight: '500' }}>Price per pass:</Text>
                      <Text 
                        strong 
                        style={{ 
                          color: '#059669', 
                          fontSize: '1.125rem',
                          fontWeight: '600'
                        }}
                      >
                        {orderData.ticketType?.price.toLocaleString('vi-VN')} VND
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: '#374151', fontWeight: '500' }}>Quantity:</Text>
                      <Text strong style={{ fontSize: '1.125rem', fontWeight: '600' }}>{orderData.quantity || 1}</Text>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Selected Payment Method */}
            <Card 
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                background: '#ffffff',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '2rem' }}
            >
              <Title 
                level={3} 
                style={{ 
                  color: '#059669', 
                  marginBottom: '1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CreditCardOutlined style={{ marginRight: '0.5rem', fontSize: '1.25rem' }} />
                Selected Payment Method
              </Title>
              
              {orderData.selectedPaymentMethod && (
                <Card
                  style={{
                    border: '2px solid #10b981',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                  }}
                  bodyStyle={{ padding: '1.5rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '3rem',
                        height: '3rem',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        borderRadius: '12px',
                        marginRight: '1rem',
                        boxShadow: '0 4px 8px rgba(5, 150, 105, 0.3)'
                      }}
                    >
                      <CreditCardOutlined style={{ fontSize: '1.25rem', color: '#ffffff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text 
                        strong 
                        style={{ 
                          fontSize: '1.125rem', 
                          color: '#059669', 
                          display: 'block', 
                          marginBottom: '0.25rem',
                          fontWeight: '600'
                        }}
                      >
                        {orderData.selectedPaymentMethod.paymentMethodName}
                      </Text>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                        <span 
                          style={{
                            display: 'inline-block',
                            width: '0.5rem',
                            height: '0.5rem',
                            background: '#10b981',
                            borderRadius: '50%',
                            marginRight: '0.5rem'
                          }}
                        />
                        Secure payment processing
                      </div>
                    </div>
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.5rem',
                        height: '1.5rem',
                        background: '#059669',
                        borderRadius: '50%',
                        marginLeft: '0.75rem'
                      }}
                    >
                      <CheckCircleOutlined style={{ fontSize: '0.875rem', color: '#ffffff' }} />
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </Col>

          {/* Order Total & Actions */}
          <Col xs={24} lg={10}>
            <Card 
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                position: 'sticky',
                top: '1rem',
                background: '#ffffff',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '2rem' }}
            >
              <Title 
                level={3} 
                style={{ 
                  color: '#059669', 
                  marginBottom: '1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}
              >
                Order Total
              </Title>
              
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Text style={{ fontSize: '1rem', color: '#374151' }}>Subtotal:</Text>
                  <Text style={{ fontSize: '1rem', fontWeight: '500' }}>{calculateTotal().toLocaleString('vi-VN')} VND</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Text style={{ fontSize: '1rem', color: '#374151' }}>Processing Fee:</Text>
                  <Text style={{ fontSize: '1rem', fontWeight: '500' }}>0 VND</Text>
                </div>
                <Divider style={{ margin: '1rem 0', borderColor: '#e5e7eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text 
                    strong 
                    style={{ 
                      fontSize: '1.125rem',
                      color: '#1f2937',
                      fontWeight: '600'
                    }}
                  >
                    Total:
                  </Text>
                  <Text 
                    strong 
                    style={{ 
                      fontSize: '1.5rem', 
                      color: '#059669',
                      fontWeight: '700'
                    }}
                  >
                    {calculateTotal().toLocaleString('vi-VN')} VND
                  </Text>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <Button
                  size="large"
                  loading={loading}
                  onClick={handlePayment}
                  disabled={!orderData.selectedPaymentMethod}
                  icon={<CreditCardOutlined />}
                  variant="primary"
                  hoverEffect="scale"
                  customStyle={{
                    width: '100%',
                    marginBottom: '1rem',
                    height: '3rem',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    borderRadius: '12px'
                  }}
                >
                  Proceed to Payment
                </Button>
                
                <Button
                  size="large"
                  onClick={() => navigate(FE_PATH.BUY_TICKET)}
                  variant="secondary"
                  customStyle={{
                    width: '100%',
                    height: '3rem',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    borderRadius: '12px'
                  }}
                >
                  Back to Tickets
                </Button>
              </div>

              <div 
                style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Text 
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: '1.5'
                  }}
                >
                  <CheckCircleOutlined style={{ color: '#10b981', marginRight: '0.5rem', fontSize: '1rem' }} />
                  Your payment is secured with industry-standard encryption
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}