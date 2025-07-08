import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Button, Spin, Result } from 'antd';
import { CloseCircleOutlined, HomeOutlined, ShoppingOutlined, ReloadOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import { apiVnPayCallback } from '../../apis/vnpay.api';
import { apiStripeCallbackFailed } from '../../apis/stripe.api';
import type { CallBackResponse } from '../../types/order.type';
import { FE_PATH } from '../../constants/path';
import dayjs from 'dayjs';
const { Title, Text } = Typography;

export default function PaymentFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<CallBackResponse>();
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'vnpay' | 'unknown'>('unknown');

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Get all query parameters from payment redirect
        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });

        // Detect payment method from URL parameters
        const isStripePayment = searchParams.has('session_id') || searchParams.has('payment_intent');
        
        let callbackResponse;
        
        if (isStripePayment) {
          setPaymentMethod('stripe');
          // Handle Stripe payment failure callback
          callbackResponse = await apiStripeCallbackFailed(queryParams.session_id);
         
          if (callbackResponse?.data) {
             console.log(callbackResponse?.data);
            if (callbackResponse.data.paymentTime) {
              callbackResponse.data.paymentTime = dayjs(callbackResponse.data.paymentTime).format('DD/MM/YYYY HH:mm:ss');
            }
            setPaymentData(callbackResponse.data);
          } else {
            setError('Unable to retrieve Stripe payment failure details');
          }
        } else {
          setPaymentMethod('vnpay');
          // Handle VNPay payment failure callback
          callbackResponse = await apiVnPayCallback(queryParams);
          
          if (callbackResponse?.data) {
            if (callbackResponse.data.paymentTime) {
              callbackResponse.data.paymentTime = dayjs(callbackResponse.data.paymentTime).format('DD/MM/YYYY HH:mm:ss');
            }
            setPaymentData(callbackResponse.data);
          } else {
            setError('Unable to retrieve VNPay payment failure details');
          }
        }
      } catch (err) {
        console.error('Payment failure callback error:', err);
        setError('An error occurred while processing payment failure information');
        toast.error('Failed to retrieve payment details');
      } finally {
        setLoading(false);
      }
    };

    handlePaymentCallback();
  }, [searchParams]);

  // Cleanup effect to dismiss all toasts when component unmounts
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const getFailureReason = () => {
    if (paymentData?.message) {
      return paymentData.message;
    }
    
    // Default messages based on payment method
    switch (paymentMethod) {
      case 'stripe':
        return 'Your Stripe payment was not completed. This could be due to insufficient funds, card issues, or payment cancellation.';
      case 'vnpay':
        return 'Your VNPay payment was not completed. Please check your account balance or try a different payment method.';
      default:
        return 'Your payment was not completed. Please try again or contact support if the issue persists.';
    }
  };

  if (loading) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <Toaster position="top-right" />
        <Card 
          style={{
            borderRadius: '24px',
            border: 'none',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
            textAlign: 'center',
            minWidth: '400px'
          }}
          bodyStyle={{ padding: '3rem' }}
        >
          <Spin size="large" />
          <div style={{ marginTop: '1.5rem' }}>
            <Title level={3} style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Processing Payment Information
            </Title>
            <Text style={{ color: '#9ca3af' }}>
              Please wait while we retrieve payment details...
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <Toaster position="top-right" />
      <Card 
        style={{
          borderRadius: '24px',
          border: 'none',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
          maxWidth: '600px'
        }}
        bodyStyle={{ padding: '3rem' }}
      >
        <Result
          icon={<CloseCircleOutlined style={{ color: '#dc2626', fontSize: '4rem' }} />}
          title={
            <Title 
              level={2} 
              style={{ 
                color: '#dc2626', 
                marginBottom: '1rem',
                fontSize: '2rem',
                fontWeight: '700'
              }}
            >
              Payment Failed
            </Title>
          }
          subTitle={
            <div style={{ marginBottom: '2rem' }}>
              <Text 
                style={{ 
                  fontSize: '1.125rem', 
                  color: '#6b7280',
                  display: 'block',
                  marginBottom: '1rem'
                }}
              >
                {getFailureReason()}
              </Text>
              {paymentData && (
                <div 
                  style={{
                    background: '#fef2f2',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'left',
                    marginTop: '1.5rem',
                    border: '1px solid #fecaca'
                  }}
                >
                  <Title level={4} style={{ color: '#374151', marginBottom: '1rem' }}>
                    Payment Details
                  </Title>
                  {paymentData.transactionId && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Text strong>Transaction ID: </Text>
                      <Text>{paymentData.transactionId}</Text>
                    </div>
                  )}
                  {paymentData.amount && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Text strong>Amount: </Text>
                      <Text>{paymentData.amount.toLocaleString()} VND</Text>
                    </div>
                  )}
                  {paymentData.paymentTime && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Text strong>Attempted Time: </Text>
                      <Text>{paymentData.paymentTime}</Text>
                    </div>
                  )}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Text strong>Payment Method: </Text>
                    <Text style={{ textTransform: 'capitalize' }}>{paymentMethod}</Text>
                  </div>
                  {paymentData.transactionStatus && (
                    <div>
                      <Text strong>Status: </Text>
                      <Text style={{ color: '#dc2626' }}>{paymentData.transactionStatus}</Text>
                    </div>
                  )}
                </div>
              )}
              {error && (
                <div 
                  style={{
                    background: '#fef2f2',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginTop: '1rem',
                    border: '1px solid #fecaca'
                  }}
                >
                  <Text style={{ color: '#dc2626' }}>{error}</Text>
                </div>
              )}
            </div>
          }
          extra={[
            <Button 
              key="retry" 
              type="primary" 
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => navigate(FE_PATH.BUY_TICKET)}
              style={{
                borderRadius: '12px',
                height: '48px',
                fontSize: '1rem',
                fontWeight: '600',
                marginRight: '1rem',
                backgroundColor: '#dc2626',
                borderColor: '#dc2626'
              }}
            >
              Try Again
            </Button>,
            <Button 
              key="home" 
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate(FE_PATH.HOME)}
              style={{
                borderRadius: '12px',
                height: '48px',
                fontSize: '1rem',
                fontWeight: '600',
                marginRight: '1rem'
              }}
            >
              Go Home
            </Button>,
            <Button 
              key="buy-tickets" 
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => navigate(FE_PATH.BUY_TICKET)}
              style={{
                borderRadius: '12px',
                height: '48px',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Buy Tickets
            </Button>
          ]}
        />
      </Card>
    </div>
  );
}