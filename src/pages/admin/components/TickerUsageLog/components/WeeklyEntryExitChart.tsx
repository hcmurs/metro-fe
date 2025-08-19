import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TicketUsageLog } from "../Type/ticketUsageLogType";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const processWeeklyData = (logs: TicketUsageLog[]) => {
  const result = Array.from({ length: 7 }, (_, i) => ({
    day: days[i],
    entry: 0,
    exit: 0,
  }));

  logs.forEach((log) => {
    const date = new Date(log.usageTime);
    const dayIndex = date.getDay(); // 0 (Sun) - 6 (Sat)
    if (log.usageType === "ENTRY") result[dayIndex].entry += 1;
    else result[dayIndex].exit += 1;
  });

  return result;
};

interface Props {
  data: TicketUsageLog[];
}

export default function WeeklyEntryExitChart({ data }: Props) {
  const weeklyData = processWeeklyData(data);

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Customer Map</h2>
        <select className="text-sm border px-2 py-1 rounded">
          <option>Weekly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="entry" fill="#8884d8" name="Entry" />
          <Bar dataKey="exit" fill="#ff69b4" name="Exit" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
