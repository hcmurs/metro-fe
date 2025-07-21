import { ClockCircleOutlined, EnvironmentOutlined, RiseOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Row, Table } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAdminStore } from '../../../../stores/admin.store';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const { hourUsageStatistic, stationUsageStatistic, ticketTypeStatistics } = useAdminStore();

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(7, 'day'), dayjs()]);

  const filteredData = useMemo(() => {
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');

    const filteredHourlyData = hourUsageStatistic
      .filter(item => item.usageDate >= startDate && item.usageDate <= endDate)
      .reduce((acc, item) => {
        const existingHour = acc.find(h => h.startHour === item.startHour && h.endHour === item.endHour);
        if (existingHour) {
          existingHour.entryCount += item.entryCount;
          existingHour.exitCount += item.exitCount;
        } else {
          acc.push({
            ...item,
            hour: `${String(item.startHour).padStart(2, '0')}:00 - ${String(item.endHour).padStart(2, '0')}:00`
          });
        }
        return acc;
      }, [] as any[])
      .sort((a, b) => a.startHour - b.startHour);

    const filteredStationData = stationUsageStatistic
      .filter(item => item.usageDate >= startDate && item.usageDate <= endDate)
      .reduce((acc, item) => {
        const existingStation = acc.find(s => s.stationName === item.stationName);
        if (existingStation) {
          existingStation.entryCount += item.entryCount;
          existingStation.exitCount += item.exitCount;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, [] as any[]);

    const filteredTicketData = ticketTypeStatistics
      .filter(item => item.usageDate >= startDate && item.usageDate <= endDate)
      .reduce((acc, item) => {
        const existingTicket = acc.find(t => t.ticketType === item.ticketType);
        if (existingTicket) {
          existingTicket.usageCount += item.usageCount;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, [] as any[]);

    return {
      hourlyData: filteredHourlyData,
      stationData: filteredStationData,
      ticketData: filteredTicketData
    };
  }, [dateRange, hourUsageStatistic, stationUsageStatistic, ticketTypeStatistics]);

  const { hourlyData, stationData, ticketData } = filteredData;

  const totalEntries = stationData.reduce((sum, station) => sum + station.entryCount, 0);
  const totalExits = stationData.reduce((sum, station) => sum + station.exitCount, 0);
  const totalTickets = ticketData.reduce((sum, ticket) => sum + ticket.usageCount, 0);
  const peakHour = hourlyData.length > 0
    ? hourlyData.reduce((max, current) => {
      const currentTotal = current.entryCount + current.exitCount;
      const maxTotal = max.entryCount + max.exitCount;
      return currentTotal > maxTotal ? current : max;
    })
    : null;

  const stationTableData = stationData.map((station, index) => ({
    key: index,
    ...station,
    totalUsage: station.entryCount + station.exitCount
  }));

  const stationColumns = [
    {
      title: 'Ga',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: (a: any, b: any) => a.stationName.localeCompare(b.stationName),
      render: (text: string) => (
        <div style={{ fontWeight: 600, color: '#333' }}>{text}</div>
      ),
    },
    {
      title: 'Lượt vào',
      dataIndex: 'entryCount',
      key: 'entryCount',
      sorter: (a: any, b: any) => a.entryCount - b.entryCount,
      render: (value: any) => (
        <div style={{ color: '#52c41a', fontWeight: 600 }}>
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'Lượt ra',
      dataIndex: 'exitCount',
      key: 'exitCount',
      sorter: (a: any, b: any) => a.exitCount - b.exitCount,
      render: (value: any) => (
        <div style={{ color: '#f5222d', fontWeight: 600 }}>
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'Tổng',
      dataIndex: 'totalUsage',
      key: 'totalUsage',
      sorter: (a: any, b: any) => a.totalUsage - b.totalUsage,
      render: (value: any) => (
        <div style={{
          color: '#1890ff',
          fontWeight: 700,
          fontSize: '16px',
          padding: '4px 8px',
          background: '#e6f7ff',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {value.toLocaleString()}
        </div>
      ),
    },
  ];

  const StatisticCard = ({ title, value, prefix, bgColor }: any) => (
    <Card
      className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
      style={{
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      bodyStyle={{ padding: '24px' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)';
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="m-0 text-[#666] text-sm">{title}</p>
          <p className="font-bold text-[1.5em] m-0 text-[#333]">
            {typeof value === 'string' ? value : value.toLocaleString()}
          </p>
        </div>
        <div style={{ fontSize: '2em', color: bgColor }}>
          {prefix}
        </div>
      </div>
    </Card>
  );

  const hasData = hourlyData.length > 0 || stationData.length > 0 || ticketData.length > 0;
  const noDataMessage = (
    <div className="text-center p-10 text-[#999] text-base">
      Không có dữ liệu cho khoảng thời gian {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
    </div>
  );

  return (
    <div style={{
      padding: '24px',
      background: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '2em',
          fontWeight: 'bold',
          color: '#333',
          margin: 0,
          marginBottom: '8px'
        }}>
          Metro Analytics Dashboard
        </h1>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Manage and analyze metro system usage data
        </p>
        <div className="flex items-center gap-3">
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            format="DD/MM/YYYY"
            style={{
              borderRadius: '6px'
            }}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </div>
      </div>

      {!hasData ? (
        <Card>{noDataMessage}</Card>
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                title="Tổng lượt vào"
                value={totalEntries}
                prefix={<RiseOutlined />}
                bgColor="#52c41a"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                title="Tổng lượt ra"
                value={totalExits}
                prefix={<EnvironmentOutlined />}
                bgColor="#f5222d"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                title="Tổng vé sử dụng"
                value={totalTickets}
                prefix={<UserOutlined />}
                bgColor="#1890ff"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                title="Giờ cao điểm"
                value={
                  peakHour
                    ? `${String(peakHour.startHour).padStart(2, '0')}:00 - ${String(peakHour.endHour).padStart(2, '0')}:00`
                    : 'Không có dữ liệu'
                }
                prefix={<ClockCircleOutlined />}
                bgColor="#faad14"
              />
            </Col>
          </Row>

          {hourlyData.length > 0 && (
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24}>
                <Card
                  title={
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Thống Kê Theo Giờ: {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
                    </div>
                  }
                  className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={hourlyData}>
                      <defs>
                        <linearGradient id="entryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#52c41a" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="exitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f5222d" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#f5222d" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="hour"
                        stroke="#666"
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #f0f0f0',
                          borderRadius: '6px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        labelFormatter={(label) => `Giờ: ${label}`}
                        formatter={(value: any, name: string) => [
                          value.toLocaleString(),
                          name
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="entryCount"
                        stroke="#52c41a"
                        fillOpacity={1}
                        fill="url(#entryGradient)"
                        name="Lượt vào"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="exitCount"
                        stroke="#f5222d"
                        strokeWidth={3}
                        dot={{ fill: '#f5222d', strokeWidth: 2, r: 4 }}
                        name="Lượt ra"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          )}

          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            {stationData.length > 0 && (
              <Col xs={24} lg={14}>
                <Card
                  title={
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Thống Kê Theo Ga: {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
                    </div>
                  }
                  className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <Table
                    dataSource={stationTableData}
                    columns={stationColumns}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: false,
                      showQuickJumper: true
                    }}
                    scroll={{ x: 600 }}
                    size="middle"
                  />
                </Card>
              </Col>
            )}
            {ticketData.length > 0 && (
              <Col xs={24} lg={stationData.length > 0 ? 10 : 24}>
                <Card
                  title={
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Thống Kê Theo Loại Vé: {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
                    </div>
                  }
                  className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="usageCount"
                      >
                        {ticketData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value.toLocaleString(), 'Số lượt']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #f0f0f0',
                          borderRadius: '6px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                      {ticketData.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px',
                          background: '#fafafa',
                          borderRadius: '6px',
                          border: '1px solid #f0f0f0'
                        }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: COLORS[index % COLORS.length],
                              marginRight: '8px',
                              borderRadius: '50%'
                            }}
                          />
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
                              {item.ticketType}
                            </div>
                            <div style={{ fontSize: '11px', color: '#666' }}>
                              {item.usageCount.toLocaleString()} lượt
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            )}
          </Row>

          {stationData.length > 0 && (
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <Card
                  title={
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Top 5 Ga Sử Dụng Nhiều Nhất: {dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}
                    </div>
                  }
                  className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={stationData
                        .map(station => ({
                          name: station.stationName,
                          value: station.entryCount + station.exitCount,
                          entries: station.entryCount,
                          exits: station.exitCount
                        }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 5)
                      }
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        stroke="#666"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#666" />
                      <Tooltip
                        formatter={(value) => [value.toLocaleString(), 'Lượt sử dụng']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #f0f0f0',
                          borderRadius: '6px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#1890ff"
                        radius={[4, 4, 0, 0]}
                        name="Tổng lượt"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;