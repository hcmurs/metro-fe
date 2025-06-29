import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Row, Col, Spin, Empty, Tag, Button, Modal } from 'antd';
import { QrcodeOutlined, CalendarOutlined, ClockCircleOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiGetOrderDetailOfUserByStatus } from '../../apis/order.api';
import { apiGetQrCodeImage } from '../../apis/ticket.api';
import type { OrderDetailResponse } from '../../types/order.type';
import type { TicketResponse, TicketStatus } from '../../types/ticket.type';
import { FE_PATH } from '../../constants/path';
import { useAuth } from '../../contexts/AuthContext';
import dayjs from 'dayjs';
const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function MyTickets() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<OrderDetailResponse[]>([]);
  const [activeTab, setActiveTab] = useState<TicketStatus>('NOT_USED');
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [loadingQR, setLoadingQR] = useState<Record<string, boolean>>({});
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(null);
  const [qrCountdown, setQrCountdown] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(FE_PATH.LOGIN);
      return;
    }
    fetchUserTickets(activeTab);
  }, [isAuthenticated, navigate, activeTab]);

  const fetchUserTickets = async (status: TicketStatus) => {
    try {
      setLoading(true);
      const response = await apiGetOrderDetailOfUserByStatus(status);
      if (response?.data) {
        // Filter only successful orders
        const successfulOrders = response.data.filter(order => order.status === 'SUCCESSFUL');
        setTickets(successfulOrders);
      } else {
        setTickets([]);
      }
    } catch (error) {
      toast.error('Error loading tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadQRCode = async (ticket: TicketResponse) => {
    try {
      setLoadingQR(prev => ({ ...prev, [ticket.ticketCode]: true }));
      const response = await apiGetQrCodeImage(ticket.ticketCode);
      if (response?.data) {
        setQrCodes(prev => ({
          ...prev,
          [ticket.ticketCode]: response.data
        }));
        setSelectedTicket(ticket);
        setQrModalVisible(true);
        setQrCountdown(60);
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setQrCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);

              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error('Failed to load QR code');
      }
    } catch (error) {
      console.error('Failed to load QR code:', error);
      toast.error('Failed to load QR code');
    } finally {
      setLoadingQR(prev => ({ ...prev, [ticket.ticketCode]: false }));
    }
  };

  const handleCloseModal = () => {
    setQrModalVisible(false);
    setSelectedTicket(null);
    setQrCountdown(0);
  };

  const getTicketsByStatus = () => {
    return tickets;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_USED':
        return '#52c41a';
      case 'USED':
        return '#1890ff';
      case 'EXPIRED':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NOT_USED':
        return 'Available';
      case 'USED':
        return 'Used';
      case 'EXPIRED':
        return 'Expired';
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY HH:mm');
  };

  const isTicketExpired = (validUntil: string) => {
    return dayjs().isAfter(dayjs(validUntil));
  };

  const renderTicketCard = (order: OrderDetailResponse) => {
    const { ticket } = order;
    const isExpired = isTicketExpired(ticket.validUntil);
    const actualStatus = isExpired && ticket.status === 'NOT_USED' ? 'EXPIRED' : ticket.status;

    return (
      <Card
        key={ticket.id}
        style={{
          marginBottom: '1rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        hoverable
        onClick={() => loadQRCode(ticket)}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={16} md={18}>
            <div style={{ marginBottom: '0.5rem' }}>
              <Text strong style={{ fontSize: '1.1rem', color: '#1f2937' }}>
                {ticket.name}
              </Text>
              <Tag 
                color={getStatusColor(actualStatus)} 
                style={{ marginLeft: '0.5rem', fontWeight: '500' }}
              >
                {getStatusText(actualStatus)}
              </Tag>
            </div>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <Text style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                <strong>Ticket Code:</strong> {ticket.ticketCode}
              </Text>
            </div>

            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <CalendarOutlined style={{ color: '#059669', marginRight: '0.5rem' }} />
                  <Text style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Valid from: {formatDateTime(ticket.validFrom)}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <ClockCircleOutlined style={{ color: '#059669', marginRight: '0.5rem' }} />
                  <Text style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Valid until: {formatDateTime(ticket.validUntil)}
                  </Text>
                </div>
              </Col>
            </Row>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ fontSize: '1rem', fontWeight: '600', color: '#059669' }}>
                {ticket.actualPrice} VND
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={8} md={6}>
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<QrcodeOutlined />}
                loading={loadingQR[ticket.ticketCode]}
                onClick={(e) => {
                  e.stopPropagation();
                  loadQRCode(ticket);
                }}
                style={{
                  background: '#059669',
                  borderColor: '#059669',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                Show QR Code
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderTicketList = () => {
    const filteredTickets = getTicketsByStatus();
    
    if (filteredTickets.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <Empty 
            description={
              <Text style={{ color: '#6b7280', fontSize: '1rem' }}>
                No {activeTab.toLowerCase().replace('_', ' ')} tickets found
              </Text>
            }
          />
        </div>
      );
    }

    return (
      <div style={{ padding: '1rem 0' }}>
        {filteredTickets.map(renderTicketCard)}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      padding: '2rem 0'
    }}>
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
            My Tickets
          </Title>
          <Text style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: '400' }}>
            Manage and view all your metro tickets
          </Text>
        </div>

        <Card
          style={{
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            background: '#ffffff'
          }}
        >
          <Tabs 
            activeKey={activeTab} 
            onChange={(key) => {
              setActiveTab(key as TicketStatus);
            }}
            style={{ minHeight: '400px' }}
            tabBarStyle={{
              borderBottom: '2px solid #f3f4f6',
              marginBottom: '1.5rem'
            }}
          >
            <TabPane 
              tab={
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  color: activeTab === 'NOT_USED' ? '#059669' : '#6b7280'
                }}>
                  <QrcodeOutlined style={{ marginRight: '0.5rem' }} />
                  Available 
                </span>
              } 
              key="NOT_USED"
            >
              {renderTicketList()}
            </TabPane>
            
            <TabPane 
              tab={
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  color: activeTab === 'USED' ? '#059669' : '#6b7280'
                }}>
                  <ClockCircleOutlined style={{ marginRight: '0.5rem' }} />
                  Used 
                </span>
              } 
              key="USED"
            >
              {renderTicketList()}
            </TabPane>
            
            <TabPane 
              tab={
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: '500',
                  color: activeTab === 'EXPIRED' ? '#059669' : '#6b7280'
                }}>
                  <CalendarOutlined style={{ marginRight: '0.5rem' }} />
                  Expired
                </span>
              } 
              key="EXPIRED"
            >
              {renderTicketList()}
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* QR Code Modal */}
      <Modal
        title={null}
        open={qrModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={400}
        style={{
          borderRadius: '16px'
        }}
        bodyStyle={{
          padding: '24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px'
        }}
        closeIcon={
          <CloseOutlined 
            style={{ 
              fontSize: '18px', 
              color: '#6b7280',
              padding: '8px'
            }} 
          />
        }
      >
        {selectedTicket && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Text strong style={{ fontSize: '1.2rem', color: '#1f2937' }}>
                {selectedTicket.name}
              </Text>
              <br />
              <Text style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Ticket Code: {selectedTicket.ticketCode}
              </Text>
            </div>

            {
              <div>
                <div style={{
                  display: 'inline-block',
                  position: 'relative',
                  marginBottom: '20px'
                }}>
                  <img 
                    src={qrCodes[selectedTicket.ticketCode]} 
                    alt={qrCodes[selectedTicket.ticketCode]}
                    style={{ 
                      width: '200px', 
                      height: '200px', 
                      border: '4px solid #ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      background: '#ffffff'
                    }} 
                  />
                  {qrCountdown > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '-12px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                      border: '2px solid #ffffff'
                    }}>
                      {qrCountdown}s
                    </div>
                  )}
                </div>

                <div style={{ 
                  padding: '12px 20px',
                  background: qrCountdown > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                  borderRadius: '12px',
                  border: `1px solid ${qrCountdown > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(156, 163, 175, 0.2)'}`,
                  marginBottom: '20px'
                }}>
                  <Text style={{ 
                    fontSize: '0.875rem', 
                    color: qrCountdown > 0 ? '#dc2626' : '#6b7280', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <ClockCircleOutlined style={{ fontSize: '16px' }} />
                    {qrCountdown > 0 ? `Expires in ${qrCountdown} seconds` : 'QR Code has expired'}
                  </Text>
                </div>

                <Button 
                  type="default" 
                  size="large"
                  icon={<ReloadOutlined />}
                  loading={loadingQR[selectedTicket.ticketCode]}
                  onClick={() => loadQRCode(selectedTicket)}
                  style={{
                    borderColor: '#059669',
                    color: '#059669',
                    borderRadius: '8px',
                    fontWeight: '600',
                    height: '44px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                  }}
                >
                  Refresh QR Code
                </Button>
              </div>
            }
          </div>
        )}
      </Modal>
    </div>
  );
}