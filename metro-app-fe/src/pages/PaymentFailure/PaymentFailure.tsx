import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Button, Spin, Result } from 'antd';
import { CloseCircleOutlined, HomeOutlined, ShoppingOutlined, ReloadOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import { apiVnPayCallback } from '../../apis/vnpay.api';
import { apiUpdateFailedOrder } from '../../apis/order.api';
import { FE_PATH } from '../../constants/path';

const { Title, Text } = Typography;

export default function PaymentFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string>('Payment was cancelled or failed');

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Get all query parameters from VNPay redirect
        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });

        // Check VNPay response code for specific failure reasons
        const responseCode = queryParams.vnp_ResponseCode;
        const transactionStatus = queryParams.vnp_TransactionStatus;
        
        // Set failure reason based on VNPay response codes
        if (responseCode) {
          switch (responseCode) {
            case '24':
              setFailureReason('Transaction was cancelled by user');
              break;
            case '51':
              setFailureReason('Insufficient account balance');
              break;
            case '65':
              setFailureReason('Account has exceeded daily transaction limit');
              break;
            case '75':
              setFailureReason('Payment bank is under maintenance');
              break;
            case '79':
              setFailureReason('Transaction amount exceeds limit');
              break;
            default:
              setFailureReason('Payment failed due to technical issues');
          }
        }

        // Still call the callback API to log the failed transaction
        const callbackResponse = await apiVnPayCallback(queryParams);
        
        if (callbackResponse) {
          setPaymentData(callbackResponse.data);
          
          // Extract order ID from the response or query params
          const orderId = queryParams.vnp_TxnRef || callbackResponse.data?.orderId;
          
          if (orderId) {
            // Update order status to failed
            const updateResponse = await apiUpdateFailedOrder(parseInt(orderId));
            if (updateResponse?.success) {
              console.log('Order status updated to failed');
            }
          }
        }
        
        toast.error('Payment failed. Please try again.');
      } catch (err) {
        console.error('Payment callback error:', err);
        setError('An error occurred while processing the payment failure');
      } finally {
        setLoading(false);
      }
    };

    handlePaymentCallback();
  }, [searchParams]);

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
              Processing Payment Result
            </Title>
            <Text style={{ color: '#9ca3af' }}>
              Please wait while we process the payment result...
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
                {failureReason}
              </Text>
              <Text 
                style={{ 
                  fontSize: '1rem', 
                  color: '#9ca3af',
                  display: 'block'
                }}
              >
                Don't worry, no charges have been made to your account.
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
                  <Title level={4} style={{ color: '#dc2626', marginBottom: '1rem' }}>
                    Transaction Details
                  </Title>
                  {paymentData.transactionId && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Text strong>Transaction ID: </Text>
                      <Text>{paymentData.transactionId}</Text>
                    </div>
                  )}
                  {paymentData.orderId && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Text strong>Order ID: </Text>
                      <Text>{paymentData.orderId}</Text>
                    </div>
                  )}
                  <div>
                    <Text strong>Status: </Text>
                    <Text style={{ color: '#dc2626' }}>Failed</Text>
                  </div>
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
                background: '#dc2626',
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