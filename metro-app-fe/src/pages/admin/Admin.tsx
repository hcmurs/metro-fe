import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Train,
  Ticket,
  Newspaper,
  ScrollText,
  FilePlus2
} from 'lucide-react';
import { useAdminStore } from '../../stores/admin.store';
import { useEffect } from 'react';

export default function Admin() {
  const location = useLocation();
  const choosen = location.pathname.split('/')[2] || '';

  const fetchAll = useAdminStore(state => state.fetchAll);

  useEffect(() => {
    fetchAll();
  }, []);

  const activeClass = 'bg-gradient-to-r from-white to-[#D4FCEE] text-[#007c51] font-semibold border-r-4 border-[#007c51] shadow-inner';
  const baseClass = 'flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#D4FCEE] transition-all duration-150';

  return (
    <div className='flex bg-gradient-to-br from-[#D4FCEE] via-gray-100 to-[#D4FCEE] min-h-screen'>
      <aside className='w-64 bg-white p-6 border-r border-gray-200 sticky top-0 h-screen shadow-sm'>
        <div className='text-2xl font-bold text-[#007c51] mb-8'>Bảng điều khiển</div>
        <nav className='flex flex-col gap-6'>
          <div>
            <Link
              to={'dashboard'}
              className={`${baseClass} ${choosen === 'dashboard' ? activeClass : ''}`}
            >
              <LayoutDashboard size={20} /> Thống kê
            </Link>
            <Link
              to={'logs'}
              className={`${baseClass} ${choosen === 'logs' ? activeClass : ''}`}
            >
              <User size={20} /> Thống kê vé
            </Link>
            <Link
              to={'requests'}
              className={`${baseClass} ${choosen === 'requests' ? activeClass : ''}`}
            >
              <FilePlus2 size={20} /> Yêu cầu sinh viên
            </Link>
            <Link
              to={'feedbacks'}
              className={`${baseClass} ${choosen === 'feedbacks' ? activeClass : ''}`}
            >
              <ScrollText size={20} /> Ý kiến khách hàng
            </Link>
            <Link
              to={'route'}
              className={`${baseClass} ${choosen === 'route' ? activeClass : ''}`}
            >
              <Train size={20} /> Ga
            </Link>
            <Link
              to={'tickets'}
              className={`${baseClass} ${choosen === 'tickets' ? activeClass : ''}`}
            >
              <Ticket size={20} /> Vé
            </Link>
            <Link
              to={'blogs'}
              className={`${baseClass} ${choosen === 'blogs' ? activeClass : ''}`}
            >
              <Newspaper size={20} /> Tin tức
            </Link>
          </div>
        </nav>
      </aside>

      <main className='flex-1 p-6'>
        <Outlet />
      </main>
    </div>
  );
}
