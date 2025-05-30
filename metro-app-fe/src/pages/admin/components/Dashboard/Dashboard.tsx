import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis
} from 'recharts';
import { DataFetchAPI } from '../../../../apis/dailyData';
import { useEffect, useState } from 'react';
import type { AnalyticsReport } from '../../../../types/data.type';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];


export default function Dashboard() {
  const [data, setData] = useState<AnalyticsReport[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await DataFetchAPI.getDaily()
      if (result) {
        setData(result)
      }
    }

    fetchData()
  }, [])
  return (
    <div className='flex flex-col gap-5'>
      <h2 className="text-2xl font-bold">Metro Analytics Dashboard</h2>
      <div className=" grid grid-cols-2 gap-5 max-w-screen">

        <div className='bg-white p-4 rounded shadow flex flex-col gap-5 w-full'>
          <h2 className="text-2xl font-bold ">Total Tickets Sold and Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reportDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="totalTicketsSold" stroke="#8884d8" />
              <Line dataKey="totalRevenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-4 rounded shadow flex flex-col gap-5'>
          <h2 className="text-2xl font-bold">Peak vs. Off-Peak Ticket Sales</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reportDate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="peakHourTickets" fill="#ff7300" />
              <Bar dataKey="offPeakTickets" fill="#387908" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-4 rounded shadow flex flex-col gap-5'>
          <h2 className="text-2xl font-bold">Daily Ticket Sales Growth</h2>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="reportDate" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="totalTicketsSold" stroke="#8884d8" fillOpacity={1} fill="url(#colorTickets)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-4 rounded shadow flex flex-col gap-5'>
          <h2 className="text-2xl font-bold">Ticket Type Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.length > 0 ? [
                  { name: '1 Day', value: data[data.length - 1]?.oneDayTicketsCount },
                  { name: '3 Days', value: data[data.length - 1]?.threeDayTicketsCount },
                  { name: 'Week', value: data[data.length - 1]?.weekTicketsCount },
                  { name: 'Month', value: data[data.length - 1]?.monthTicketsCount },
                  { name: 'Student', value: data[data.length - 1]?.studentTicketsCount }
                ] : []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
