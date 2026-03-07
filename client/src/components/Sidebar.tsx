import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (!user) return null;

    const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' Panel';

    const menuItems = [
        { label: 'Dashboard', path: `/${user.role}/dashboard`, icon: 'dashboard', roles: ['student', 'parent', 'warden', 'admin'] },
        { label: 'Outing Requests', path: `/${user.role}/outings`, icon: 'directions_walk', roles: ['student', 'parent', 'warden', 'admin'] },
        { label: 'Complaints', path: `/${user.role}/complaints`, icon: 'warning', roles: ['student', 'warden', 'admin'] },
        { label: 'Food Menu', path: '/food-menu', icon: 'restaurant', roles: ['student', 'parent', 'warden', 'admin'] },
    ];

    const allowedItems = menuItems.filter(item => item.roles.includes(user.role));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-[260px] bg-brand-secondary text-[#cfd8dc] flex flex-col fixed inset-y-0 left-0 z-40 transition-transform">
            <div className="p-5 border-b border-[#37474f] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-400 text-white flex justify-center items-center shadow-md flex-shrink-0">
                    <span className="material-symbols-outlined text-[24px]">domain</span>
                </div>
                <div className="overflow-hidden">
                    <div className="text-white font-bold tracking-wide text-[15px] truncate">Hostel ERP</div>
                    <div className="text-xs text-[#90a4ae] tracking-wider uppercase mt-1 truncate">{roleLabel}</div>
                </div>
            </div>

            <div className="px-5 pt-6 pb-2 text-[11px] font-bold text-[#78909c] tracking-widest uppercase">Main Menu</div>

            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                {allowedItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-brand-primary text-white shadow-md'
                                : 'text-[#eceff1] hover:bg-[#37474f] hover:text-white hover:translate-x-1'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            {item.label}
                            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"></span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-5 pt-4 pb-2 text-[11px] font-bold text-[#78909c] tracking-widest uppercase border-t border-[#37474f] mt-auto">Account</div>
            <div className="px-3 pb-6 space-y-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#eceff1] hover:bg-red-500/20 hover:text-red-400 transition-all duration-200">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}
