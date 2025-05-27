import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

const data = [
  { report_date: '2025-05-25', total_tickets_sold: 6428, total_revenue: 16895.98, peak_hour_tickets: 2310, off_peak_tickets: 4118, student_tickets_count: 172, one_day_tickets_count: 347, three_day_tickets_count: 778, week_tickets_count: 465, month_tickets_count: 348 },
  { report_date: '2025-05-24', total_tickets_sold: 4118, total_revenue: 16190.71, peak_hour_tickets: 1557, off_peak_tickets: 2561, student_tickets_count: 56, one_day_tickets_count: 807, three_day_tickets_count: 383, week_tickets_count: 516, month_tickets_count: 274 },
  { report_date: '2025-05-23', total_tickets_sold: 2354, total_revenue: 4807.3, peak_hour_tickets: 1013, off_peak_tickets: 1341, student_tickets_count: 157, one_day_tickets_count: 465, three_day_tickets_count: 283, week_tickets_count: 430, month_tickets_count: 73 },
  { report_date: '2025-05-22', total_tickets_sold: 3196, total_revenue: 14306.46, peak_hour_tickets: 1075, off_peak_tickets: 2121, student_tickets_count: 175, one_day_tickets_count: 341, three_day_tickets_count: 695, week_tickets_count: 99, month_tickets_count: 337 },
  { report_date: '2025-05-21', total_tickets_sold: 2114, total_revenue: 7655.25, peak_hour_tickets: 1030, off_peak_tickets: 1084, student_tickets_count: 223, one_day_tickets_count: 345, three_day_tickets_count: 160, week_tickets_count: 549, month_tickets_count: 11 }
];

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-5'>
      <h2 className="text-2xl font-bold">Metro Analytics Dashboard</h2>
      <div className=" grid grid-cols-2 gap-5 max-w-screen">

        <div className='bg-white p-4 rounded shadow flex flex-col gap-5 w-full'>
          <h2 className="text-2xl font-bold ">Total Tickets Sold and Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="report_date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="total_tickets_sold" stroke="#8884d8" />
              <Line dataKey="total_revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-4 rounded shadow flex flex-col gap-5'>
          <h2 className="text-2xl font-bold">Peak vs. Off-Peak Ticket Sales</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="report_date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="peak_hour_tickets" fill="#ff7300" />
              <Bar dataKey="off_peak_tickets" fill="#387908" />
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
              <XAxis dataKey="report_date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="total_tickets_sold" stroke="#8884d8" fillOpacity={1} fill="url(#colorTickets)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-4 rounded shadow flex flex-col gap-5'>
          <h2 className="text-2xl font-bold">Ticket Type Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: '1 Day', value: 2305 },
                  { name: '3 Days', value: 2299 },
                  { name: 'Week', value: 2059 },
                  { name: 'Month', value: 1043 },
                  { name: 'Student', value: 783 }
                ]}
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
