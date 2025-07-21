import  { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Button, Spin, Result } from 'antd';
import { CheckCircleOutlined, HomeOutlined, ShoppingOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import { apiVnPayCallback } from '../../apis/vnpay.api';
import type { CallBackResponse } from '../../types/order.type';
import { FE_PATH } from '../../constants/path';
import dayjs from 'dayjs';
const { Title, Text } = Typography;

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<CallBackResponse>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Get all query parameters from VNPay redirect
        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });

        // Verify payment with backend
        const callbackResponse = await apiVnPayCallback(queryParams);
        
        if (callbackResponse?.data.responseCode=="00") {
          callbackResponse.data.paymentTime = dayjs(callbackResponse.data.paymentTime).format('DD/MM/YYYY HH:mm:ss');
          console.log(callbackResponse.data.paymentTime);
          setPaymentData(callbackResponse.data);
          // Extract order ID from the response or query params               
        } else {
          setError('Payment verification failed');
          toast.error('Giao dịch thất bại');
        }
      } catch (err) {
        console.error('Payment callback error:', err);
        setError('Có lỗi xảy ra khi giao dịch');
        toast.error('Giao dịch thất bại');
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
              Đang giao dịch
            </Title>
            <Text style={{ color: '#9ca3af' }}>
              Đang xác nhận giao dịch
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
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
            maxWidth: '500px'
          }}
          bodyStyle={{ padding: '3rem' }}
        >
          <Result
            status="error"
            title="Payment Verification Failed"
            subTitle={error}
            extra={[
              <Button 
                key="home" 
                type="primary" 
                icon={<HomeOutlined />}
                onClick={() => navigate(FE_PATH.MY_TICKETS)}
                style={{
                  borderRadius: '12px',
                  height: '48px',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Xem vé
              </Button>,
              <Button 
                key="retry" 
                icon={<ShoppingOutlined />}
                onClick={() => navigate(FE_PATH.BUY_TICKET)}
                style={{
                  borderRadius: '12px',
                  height: '48px',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Mua vé khác
              </Button>
            ]}
          />
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
          icon={<CheckCircleOutlined style={{ color: '#16a34a', fontSize: '4rem' }} />}
          title={
            <Title 
              level={2} 
              style={{ 
                color: '#16a34a', 
                marginBottom: '1rem',
                fontSize: '2rem',
                fontWeight: '700'
              }}
            >
              Thanh toán thành công!
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
                Giao dịch của bạn đã hoàn thành!
              </Text>
              {paymentData && (
                <div 
                  style={{
                    background: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    textAlign: 'left',
                    marginTop: '1.5rem'
                  }}
                >
                  <Title level={4} style={{ color: '#374151', marginBottom: '1rem' }}>
                    Chi tiết
                  </Title>
                  {paymentData.amount && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Text strong>Giá tiền: </Text>
                      <Text>{paymentData.amount.toLocaleString()} VND</Text>
                    </div>
                  )}
                  {paymentData.paymentTime && (
                    <div>
                      <Text strong>Payment Time: </Text>
                      <Text>{paymentData.paymentTime}</Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          }
          extra={[
            <Button 
              key="home" 
              type="primary" 
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate(FE_PATH.MY_TICKETS)}
              style={{
                borderRadius: '12px',
                height: '48px',
                fontSize: '1rem',
                fontWeight: '600',
                marginRight: '1rem'
              }}
            >
              Xem vé
            </Button>,
            <Button 
              key="buy-more" 
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
              Mua thêm vé mới
            </Button>
          ]}
        />
      </Card>
    </div>
  );
}