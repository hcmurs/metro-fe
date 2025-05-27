import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { LayoutDashboard, User, Train } from 'lucide-react'

export default function Admin() {
    const [choosen, setChosen] = useState(window.location.pathname.split('/')[2] || '');
    const activeClass = 'text-blue-500 border-l-4 border-blue-500 bg-blue-100';
    const baseClass = 'p-2 hover:bg-blue-100 text-black flex gap-2 rounded';

    return (
        <div className='flex gap-5 bg-gray-200'>
            <div className='w-1/5'>
                <div className='w-full h-screen bg-white text-black p-5 sticky top-0'>
                    <div className='flex flex-col mt-5 gap-4'>
                        <div>Overview</div>
                        <Link
                            to={''}
                            onClick={() => setChosen('')}
                            className={`${baseClass} ${choosen === '' ? activeClass : ''}`}
                        >
                            <LayoutDashboard /> Dashboard
                        </Link>

                        <div>User Management</div>
                        <Link
                            to={'users'}
                            onClick={() => setChosen('users')}
                            className={`${baseClass} ${choosen === 'users' ? activeClass : ''} `}
                        >
                            <User /> Users
                        </Link>

                        <div>Station Management</div>
                        <Link
                            to={'route'}
                            onClick={() => setChosen('route')}
                            className={`${baseClass} ${choosen === 'route' ? activeClass : ''}`}
                        >
                            <Train /> Route
                        </Link>
                    </div>
                </div>
            </div>
            <div className='w-4/5 p-5'>
                <Outlet />
            </div>
        </div>
    )
}
