import React, { useState } from 'react';
import WeeklyEntryExitChart from './components/WeeklyEntryExitChart';
import { CalendarDays, Clock, MoveDownLeft, MoveUpRight, Ticket } from 'lucide-react';

interface TicketUsageLog {
  ticketUsageLogId: number;
  ticketCode: string;
  usageTime: string;
  stationId: number;
  usageType: 'ENTRY' | 'EXIT';
}

const fakeData: TicketUsageLog[] = [
  {
    ticketUsageLogId: 1,
    ticketCode: 'A123',
    usageTime: '2025-07-01T08:00:00Z',
    stationId: 1,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 2,
    ticketCode: 'A124',
    usageTime: '2025-07-01T09:30:00Z',
    stationId: 2,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 3,
    ticketCode: 'A125',
    usageTime: '2025-07-02T10:00:00Z',
    stationId: 1,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 4,
    ticketCode: 'A126',
    usageTime: '2025-07-02T11:15:00Z',
    stationId: 3,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 5,
    ticketCode: 'A127',
    usageTime: '2025-07-03T12:30:00Z',
    stationId: 2,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 6,
    ticketCode: 'A128',
    usageTime: '2025-07-03T13:45:00Z',
    stationId: 1,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 7,
    ticketCode: 'A129',
    usageTime: '2025-07-04T14:00:00Z',
    stationId: 3,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 8,
    ticketCode: 'A130',
    usageTime: '2025-07-04T15:30:00Z',
    stationId: 2,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 9,
    ticketCode: 'A131',
    usageTime: '2025-07-05T16:00:00Z',
    stationId: 1,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 10,
    ticketCode: 'A132',
    usageTime: '2025-07-05T17:15:00Z',
    stationId: 3,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 11,
    ticketCode: 'A133',
    usageTime: '2025-07-06T18:30:00Z',
    stationId: 2,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 12,
    ticketCode: 'A134',
    usageTime: '2025-07-06T19:45:00Z',
    stationId: 1,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 13,
    ticketCode: 'A135',
    usageTime: '2025-07-07T20:00:00Z',
    stationId: 3,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 14,
    ticketCode: 'A136',
    usageTime: '2025-07-07T21:30:00Z',
    stationId: 2,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 15,
    ticketCode: 'A137',
    usageTime: '2025-07-08T22:00:00Z',
    stationId: 1,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 16,
    ticketCode: 'A138',
    usageTime: '2025-07-08T23:15:00Z',
    stationId: 3,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 17,
    ticketCode: 'A139',
    usageTime: '2025-07-09T00:30:00Z',
    stationId: 2,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 18,
    ticketCode: 'A140',
    usageTime: '2025-07-09T01:45:00Z',
    stationId: 1,
    usageType: 'EXIT',
  },
  {
    ticketUsageLogId: 19,
    ticketCode: 'A141',
    usageTime: '2025-07-10T02:00:00Z',
    stationId: 3,
    usageType: 'ENTRY',
  },
  {
    ticketUsageLogId: 20,
    ticketCode: 'A142',
    usageTime: '2025-07-10T03:30:00Z',
    stationId: 2,
    usageType: 'EXIT',
  },
];

export default function TicketUsageLog() {
  const summaryBoxes = [
    {
      title: 'Total Tickets',
      value: fakeData.length,
      color: 'from-pink-500 to-red-400',
    },
    {
      title: 'Total Entry',
      value: fakeData.filter(t => t.usageType === 'ENTRY').length,
      color: 'from-purple-500 to-indigo-400',
    },
    {
      title: 'Total Exit',
      value: fakeData.filter(t => t.usageType === 'EXIT').length,
      color: 'from-sky-500 to-blue-400',
    },
    {
      title: 'Stations Involved',
      value: new Set(fakeData.map(t => t.stationId)).size,
      color: 'from-yellow-400 to-orange-400',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(fakeData.length / rowsPerPage);
  const paginatedData = fakeData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryBoxes.map((box, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 text-white bg-gradient-to-r ${box.color} shadow`}
          >
            <div className="text-sm opacity-80">{box.title}</div>
            <div className="text-2xl font-semibold">{box.value}</div>
            <div className="text-xs mt-1">{new Date().toLocaleDateString()}</div>
          </div>
        ))}
      </div>


      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Entry vs Exit Activities</h2>
        <WeeklyEntryExitChart data={fakeData} />
      </div>
      <div className="bg-white rounded-xl shadow p-4 w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Ticket Activities</h2>
        </div>
        <table className="min-w-full text-sm text-left border-t border-gray-100">
          <thead>
            <tr className="text-gray-500 font-semibold">
              <th className="py-2 px-3">
                <div className='flex items-center gap-2'>
                  <Ticket className="w-4 h-4" />Code
                </div>
              </th>
              <th className="py-2 px-3">
                <div className='flex items-center gap-2'>
                  <MoveUpRight className="w-4 h-4" />Type
                </div>
              </th>
              <th className="py-2 px-3">
                <div className='flex items-center gap-2'>
                  <Clock className="w-4 h-4" />Time
                </div>
              </th>
              <th className="py-2 px-3">
                <div className='flex items-center gap-2'>
                  <CalendarDays className="w-4 h-4" />Date
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((log) => {
              const date = new Date(log.usageTime);
              return (
                <tr key={log.ticketUsageLogId} className="border-b hover:bg-gray-50 transition">

                  <td className="py-2 px-3 text-gray-800 font-medium">
                    <div className='flex items-center gap-2'>
                      <Ticket className="w-4 h-4 text-blue-500" />
                      {log.ticketCode}
                    </div>
                  </td>

                  <td className="py-2 px-3">
                    {log.usageType === 'ENTRY' ? (
                      <div className='flex items-center gap-2'>
                        <MoveUpRight className="text-green-500 w-4 h-4" />
                        <span className="text-green-600 font-medium">Entry</span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <MoveDownLeft className="text-red-500 w-4 h-4" />
                        <span className="text-red-600 font-medium">Exit</span>
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-3 text-gray-700">
                    <div className='flex items-center gap-2'>
                      <Clock className="w-4 h-4 text-gray-400" />
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-2 px-3 text-gray-700">
                    <div className='flex items-center gap-2'>
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      {date.toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

