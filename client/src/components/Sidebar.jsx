import React , {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, MenuIcon, UserIcon, LayoutGridIcon, UsersIcon, CalendarIcon, FileTextIcon, DollarSignIcon, SettingsIcon, LogOutIcon, ChevronRightIcon, Loader2} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { XIcon } from 'lucide-react';
import { dummyProfileData} from '../assets/assets.jsx'
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Sidebar = () => {

    const {pathname} = useLocation();
    const [userName, setUserName] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    const {user, loading, logout} = useAuth()

    useEffect(()=>{
        api.get("/profile").then(({data})=>{
            if(data.firstName) setUserName(`${data.firstName} ${data.lastName || ""}`.trim())
        })
    },[])

    useEffect(() => {
        setUserName(dummyProfileData.firstName + " " + dummyProfileData.lastName); // Replace with actual logic to get the user's name
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const role = user?.role;

    const navItems = [
        {
            name: 'Dashboard',
            href: "/dashboard",
            icon: LayoutGridIcon,
        },
        role === "ADMIN" ?
        {
            name: 'Employees',
            href: "/employees",
            icon: UsersIcon,
        } :
        {
            name: 'Attendance',
            href: "/attendance",
            icon: CalendarIcon,
        },

        {
            name: 'Leave',
            href: "/leave",
            icon: FileTextIcon,
        },
        {
            name: 'Payslips',
            href: "/payslips",
            icon: DollarSignIcon,
        },
        {
            name: 'Settings',
            href: "/settings",
            icon: SettingsIcon,
        },
    ];

    const handleLogout = () => {
        logout()
        window.location.href = '/login'; // Redirect to login page
    }

  const sidebarContent = (
    <div className='flex flex-col h-full'>
        {/* Brand header */}
        <div className='px-5 pt-6 pb-5 border-b border-white/6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <UserIcon className='text-white size-7' />
                    <div>
                        <p className='font-semibold text-[13px] text-white tracking-wide'>Employee MS</p>
                        <p className='text-[11px] text-slate-500 font-medium'>Management System</p>
                    </div>
                </div>

                {/* Mobile close button */}
                <button
                    className='lg:hidden p-1 rounded-md text-slate-400 hover:text-white transition-colors'
                    onClick={() => setMobileOpen(false)}
                >
                    <XIcon size={20} />
                </button>
            </div>
        </div>

        {/* User profile card */}
        {userName && (
            <div className='mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/5 border border-white/10'>
                <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0'>
                        <span className="text-slate-400 text-lg font-semibold">
                            {userName.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div className='min-w-0'>
                        <p className='text-[13px] font-medium text-slate-200 truncate'>{userName}</p>
                        <p className='text-[11px] text-slate-500 truncate'>{role === "ADMIN" ? "Administrator" : "Employee"}</p>
                    </div>
                </div>
            </div>
        )}

        {/* Section label */}
        <div className='px-5 mt-6 mb-2 text-xs font-semibold text-slate-400 tracking-wider'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500'>Navigation</p>
        </div>

        {/* Navigation list */}
        <div className='flex-1 px-3 space-y-0.5 overflow-y-auto'>
            {loading ? (
                <div className='px-3 py-3 flex items-center gap-2 text-slate-500'>
                    <Loader2 className='animate-spin w-4 h-4'/>
                    <span className='text-sm'>Loading...</span> 
                </div>
            ) : (
            navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${isActive ? 'bg-indigo-500/12 text-indigo-300' : 'text-slate-300 hover:bg-white/4 hover:text-white'}`}
                    >
                        {isActive && <div className='absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500'/>}
                        <item.icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-300'}`} />
                        <span className='flex-1'>{item.name}</span>
                        {isActive && <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-500/50"/>}
                    </Link> 
                )
            }))}
        </div>

        {/* Logout button (pinned to bottom) */}
        <div className='mt-auto p-3 border-t border-white/6'>
            <button
                className='flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150'
                onClick={handleLogout}
            >
                <LogOutIcon className='w-[17px] h-[17px]'/>
                <span>Log out</span>
            </button>
        </div>
    </div>
);

  return (
    <>
        {/* Mobile hamburger button */}
        <button 
        className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10'
        onClick={() => setMobileOpen(!mobileOpen)}
        >
            <MenuIcon size={20} />
        </button>

        {/* Mobile overlay */}
        {mobileOpen && 
            <div 
            className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
            onClick={() => setMobileOpen(false)}
            />
        }


        {/* Sidebar - desktop */}
        <aside className={`lg:block ${mobileOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:static w-64 h-full bg-slate-900 text-white flex flex-col justify-between`}>
            {sidebarContent}
        </aside>

        {/* Sidebar - mobile */}
        <aside className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 h-full bg-slate-900 text-white flex flex-col justify-between transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {sidebarContent}
        </aside>
    </>
  );
};

export default Sidebar;