import { useState } from 'react';
import { Card, Tabs, Select, InputNumber, Row, Col, Typography, Divider, message } from 'antd';
import { CreditCardOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { COLOR } from '../../constants/color';
import Button from '../../components/Minh/Button';

const { Title, Text } = Typography;
const { Option } = Select;

interface PassTicket {
  id: number;
  name: string;
  duration: string;
  price: number;
  description: string;
  validity: string;
}

interface Station {
  id: number;
  name: string;
  code: string;
}

const passTickets: PassTicket[] = [
  {
    id: 1,
    name: '1-Day Pass',
    duration: 'ONE_DAY',
    price: 50000,
    description: 'Unlimited rides for 24 hours',
    validity: '24 hours from first use'
  },
  {
    id: 2,
    name: '1-Week Pass',
    duration: 'ONE_WEEK',
    price: 300000,
    description: 'Unlimited rides for 7 days',
    validity: '7 days from first use'
  },
  {
    id: 3,
    name: '1-Month Pass',
    duration: 'ONE_MONTH',
    price: 1000000,
    description: 'Unlimited rides for 30 days',
    validity: '30 days from first use'
  }
];

const stations: Station[] = [
  { id: 1, name: 'Ben Thanh Station', code: 'BT01' },
  { id: 2, name: 'Opera House Station', code: 'OH02' },
  { id: 3, name: 'Ba Son Station', code: 'BS03' },
  { id: 4, name: 'Nguyen Hue Station', code: 'NH04' },
  { id: 5, name: 'Saigon Station', code: 'SG05' },
  { id: 6, name: 'Tan Cang Station', code: 'TC06' },
  { id: 7, name: 'Thu Thiem Station', code: 'TT07' },
  { id: 8, name: 'Landmark 81 Station', code: 'LM08' }
];

const calculateSingleTicketPrice = (startStationId: number, endStationId: number): number => {
  const distance = Math.abs(endStationId - startStationId);
  return 8000 + (distance * 2000); // Base fare + distance fare
};

export default function BuyTicket() {
  const [activeTab, setActiveTab] = useState('pass');
  const [selectedPass, setSelectedPass] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [startStation, setStartStation] = useState<number | null>(null);
  const [endStation, setEndStation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePassPurchase = async (passTicket: PassTicket) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success(`Successfully purchased ${quantity} x ${passTicket.name}!`);
      setSelectedPass(null);
      setQuantity(1);
    } catch (error) {
      message.error('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSingleTicketPurchase = async () => {
    if (!startStation || !endStation) {
      message.warning('Please select both start and end stations.');
      return;
    }
    if (startStation === endStation) {
      message.warning('Start and end stations cannot be the same.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const startStationName = stations.find(s => s.id === startStation)?.name;
      const endStationName = stations.find(s => s.id === endStation)?.name;
      message.success(`Successfully purchased ticket from ${startStationName} to ${endStationName}!`);
      setStartStation(null);
      setEndStation(null);
    } catch (error) {
      message.error('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const singleTicketPrice = startStation && endStation ? calculateSingleTicketPrice(startStation, endStation) : 0;

  const PassTicketsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Title level={3} className="text-green-600 mb-2">
          <ClockCircleOutlined className="mr-2" />
          Metro Pass Tickets
        </Title>
        <Text className="text-gray-600">Choose from our convenient pass options for unlimited travel</Text>
      </div>
      
      <Row gutter={[24, 24]}>
        {passTickets.map((ticket) => (
          <Col xs={24} md={8} key={ticket.id}>
            <Card
              hoverable
              className={`h-full transition-all duration-300 ${
                selectedPass === ticket.id 
                  ? 'border-green-500 shadow-lg ring-2 ring-green-200' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setSelectedPass(ticket.id)}
            >
              <div className="text-center">
                <Title level={4} className="text-green-600 mb-3">{ticket.name}</Title>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {ticket.price.toLocaleString('vi-VN')} VND
                </div>
                <Text className="text-gray-600 block mb-4">{ticket.description}</Text>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Text className="text-sm text-green-700">
                    <ClockCircleOutlined className="mr-1" />
                    Valid for: {ticket.validity}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedPass && (
        <Card className="mt-6 border-green-200">
          <Title level={4} className="text-green-600 mb-4">Purchase Details</Title>
          <Row gutter={[16, 16]} align="middle">
            <Col span={8}>
              <Text strong>Quantity:</Text>
              <InputNumber
                min={1}
                max={10}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
                className="ml-2 w-20"
              />
            </Col>
            <Col span={8}>
              <Text strong>Total: </Text>
              <Text className="text-2xl font-bold text-green-600">
                {(passTickets.find(t => t.id === selectedPass)!.price * quantity).toLocaleString('vi-VN')} VND
              </Text>
            </Col>
            <Col span={8}>
              <Button
                size="large"
                loading={loading}
                onClick={() => handlePassPurchase(passTickets.find(t => t.id === selectedPass)!)}
                icon={<CreditCardOutlined />}
                variant="primary"
                hoverEffect="scale"
              >
                Purchase Now
              </Button>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );

  const SingleTicketTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Title level={3} className="text-green-600 mb-2">
          <EnvironmentOutlined className="mr-2" />
          Single Journey Ticket
        </Title>
        <Text className="text-gray-600">Select your start and destination stations</Text>
      </div>

      <Card className="border-green-200">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="mb-4">
              <Text strong className="block mb-2 text-green-600">From Station:</Text>
              <Select
                placeholder="Select start station"
                value={startStation}
                onChange={setStartStation}
                className="w-full"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stations.map(station => (
                  <Option key={station.id} value={station.id} disabled={station.id === endStation}>
                    {station.name} ({station.code})
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="mb-4">
              <Text strong className="block mb-2 text-green-600">To Station:</Text>
              <Select
                placeholder="Select destination station"
                value={endStation}
                onChange={setEndStation}
                className="w-full"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {stations.map(station => (
                  <Option key={station.id} value={station.id} disabled={station.id === startStation}>
                    {station.name} ({station.code})
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        {startStation && endStation && (
          <>
            <Divider />
            <div className="bg-green-50 p-6 rounded-lg">
              <Row gutter={[16, 16]} align="middle">
                <Col span={12}>
                  <div>
                    <Text strong className="block text-green-700">Journey Details:</Text>
                    <Text className="text-gray-600">
                      {stations.find(s => s.id === startStation)?.name} → {stations.find(s => s.id === endStation)?.name}
                    </Text>
                    <br />
                    <Text className="text-sm text-gray-500">
                      Distance: {Math.abs(endStation - startStation)} stations
                    </Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div className="text-center">
                    <Text strong className="block text-green-700">Fare:</Text>
                    <Text className="text-2xl font-bold text-green-600">
                      {singleTicketPrice.toLocaleString('vi-VN')} VND
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
                  >
                    Buy Ticket
                  </Button>
                 
                </Col>
              </Row>
            </div>
          </>
        )}
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <Title level={1} className="text-green-600 mb-2">Buy Metro Tickets</Title>
          <Text className="text-lg text-gray-600">Fast, convenient, and secure ticket purchasing</Text>
        </div>

        <Card className="shadow-lg border-0">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            centered
            items={[
              {
                key: 'pass',
                label: (
                  <span className="text-lg">
                    <ClockCircleOutlined className="mr-2" />
                    Pass Tickets
                  </span>
                ),
                children: <PassTicketsTab />
              },
              {
                key: 'single',
                label: (
                  <span className="text-lg">
                    <EnvironmentOutlined className="mr-2" />
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