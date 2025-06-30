import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { LayoutDashboard, User, Train, MapPin, Settings, Bell, LogOut, Menu, X } from 'lucide-react'

export default function Admin() {
    const [chosen, setChosen] = useState(window.location.pathname.split('/')[2] || '');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const activeClass = 'text-blue-600 border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm';
    const baseClass = 'p-3 hover:bg-gray-50 text-gray-700 flex items-center gap-3 rounded-lg transition-all duration-200 hover:shadow-sm group';
    const sectionClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3';

    const navigationItems = [
        {
            section: 'Overview',
            items: [
                { to: '', label: 'Dashboard', icon: LayoutDashboard, key: '' }
            ]
        },
        {
            section: 'User Management',
            items: [
                { to: 'users', label: 'Users', icon: User, key: 'users' }
            ]
        },
        {
            section: 'Station Management',
            items: [
                { to: 'route', label: 'Routes', icon: Train, key: 'route' },
                { to: 'stations', label: 'Stations', icon: MapPin, key: 'stations' }
            ]
        }
    ];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className='flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:transform-none ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                <div className='flex flex-col h-full'>
                    {/* Header */}
                    <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center'>
                                <LayoutDashboard className='text-white' size={20} />
                            </div>
                            <div>
                                <h1 className='text-xl font-bold text-gray-900'>Metro Admin</h1>
                                <p className='text-xs text-gray-500'>Management Panel</p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleSidebar}
                            className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
                        >
                            <X size={20} className='text-gray-600' />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className='flex-1 p-4 space-y-6 overflow-y-auto'>
                        {navigationItems.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                                <div className={sectionClass}>{section.section}</div>
                                <div className='space-y-1'>
                                    {section.items.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <Link
                                                key={item.key}
                                                to={item.to}
                                                onClick={() => {
                                                    setChosen(item.key);
                                                    setSidebarOpen(false);
                                                }}
                                                className={`${baseClass} ${chosen === item.key ? activeClass : ''}`}
                                            >
                                                <IconComponent 
                                                    size={20} 
                                                    className={`transition-colors ${
                                                        chosen === item.key 
                                                            ? 'text-blue-600' 
                                                            : 'text-gray-500 group-hover:text-gray-700'
                                                    }`} 
                                                />
                                                <span className='font-medium'>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className='p-4 border-t border-gray-200'>
                        <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-50'>
                            <div className='w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center'>
                                <User size={16} className='text-white' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-gray-900 truncate'>Admin User</p>
                                <p className='text-xs text-gray-500'>Administrator</p>
                            </div>
                            <button className='p-1 rounded-md hover:bg-gray-200 transition-colors'>
                                <Settings size={16} className='text-gray-500' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 flex flex-col min-w-0'>
                {/* Top Bar */}
                <header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <button 
                                onClick={toggleSidebar}
                                className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
                            >
                                <Menu size={20} className='text-gray-600' />
                            </button>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-900 capitalize'>
                                    {chosen === '' ? 'Dashboard' : chosen === 'users' ? 'User Management' : chosen === 'route' ? 'Route Management' : chosen === 'stations' ? 'Station Management' : 'Admin Panel'}
                                </h2>
                                <p className='text-sm text-gray-600 mt-1'>
                                    {chosen === '' ? 'Overview of system metrics and activities' : 
                                     chosen === 'users' ? 'Manage user accounts and permissions' :
                                     chosen === 'route' ? 'Configure routes and schedules' :
                                     chosen === 'stations' ? 'Manage station information and locations' :
                                     'Administrative tools and settings'}
                                </p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3'>
                            <button className='relative p-2 rounded-lg hover:bg-gray-100 transition-colors'>
                                <Bell size={20} className='text-gray-600' />
                                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
                            </button>
                            <div className='w-px h-6 bg-gray-300'></div>
                            <button className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600'>
                                <LogOut size={18} />
                                <span className='hidden sm:inline text-sm font-medium'>Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className='flex-1 overflow-auto'>
                    <div className='p-6'>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
