import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Train, Ticket } from 'lucide-react';
import { DiffOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useAdminStore } from '../../stores/admin.store';
import { useEffect } from 'react';

export default function Admin() {
	const location = useLocation();
	const choosen = location.pathname.split('/')[2] || '';
	const activeClass = 'text-blue-500 border-l-4 border-blue-500 bg-blue-100';
	const baseClass = 'p-2 hover:bg-blue-100 text-black flex gap-2 rounded';

	const fetchAll = useAdminStore(state => state.fetchAll);

	useEffect(() => {
		fetchAll();
	}, []);

	return (
		<div className='flex bg-gray-200'>
			<div className='w-1/6'>
				<div className='w-full h-screen bg-white text-black p-5 sticky top-0'>
					<div className='flex flex-col mt-5 gap-4'>
						<div>Overview</div>
						<Link
							to={'dashboard'}
							className={`${baseClass} ${choosen === 'dashboard' ? activeClass : ''}`}
						>
							<LayoutDashboard /> Dashboard
						</Link>

						<div>User Management</div>
						<Link
							to={'users'}
							className={`${baseClass} ${choosen === 'users' ? activeClass : ''} `}
						>
							<User /> Users
						</Link>
						<Link
							to={'requests'}
							className={`${baseClass} ${choosen === 'requests' ? activeClass : ''} `}
						>
							<DiffOutlined /> Requests
						</Link>
						<Link
							to={'feedbacks'}
							className={`${baseClass} ${choosen === 'feedbacks' ? activeClass : ''} `}
						>
							<SnippetsOutlined /> Feedbacks
						</Link>

						<div>Station Management</div>
						<Link
							to={'route'}
							className={`${baseClass} ${choosen === 'route' ? activeClass : ''}`}
						>
							<Train /> Route
						</Link>

						<div>Ticket Management</div>
						<Link
							to={'tickets'}
							className={`${baseClass} ${choosen === 'tickets' ? activeClass : ''}`}
						>
							<Ticket /> Tickets
						</Link>
					</div>
				</div>
			</div>
			<div className='w-5/6 p-5'>
				<Outlet />
			</div>
		</div>
	)
}