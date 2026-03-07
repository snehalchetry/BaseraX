import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    if (!user) return null;

    const initials = user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

    // Close profile menu on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
                setShowProfileMenu(false);
            }
        };
        if (showProfileMenu) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showProfileMenu]);

    // Auto-focus search
    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        // Navigate based on search
        const q = searchQuery.toLowerCase();
        if (q.includes('outing')) navigate(`/${user.role}/outings`);
        else if (q.includes('complaint')) navigate(`/${user.role}/complaints`);
        else if (q.includes('food') || q.includes('menu')) navigate('/food-menu');
        else if (q.includes('dashboard')) navigate(`/${user.role}/dashboard`);
        setSearchQuery('');
        setShowSearch(false);
    };

    const handleLogout = () => {
        setShowProfileMenu(false);
        logout();
        navigate('/login');
    };

    return (
        <>
            <header className="bg-white/95 backdrop-blur shadow-sm border-b border-gray-200 sticky top-0 z-30 h-[72px] px-6 flex justify-between items-center bg-cover bg-center" style={{ backgroundImage: "url('https://gcdnb.pbrd.co/images/LFyByRAQS2cS.jpg')" }}>
                <div className="absolute inset-0 bg-white/90"></div>

                <div className="w-[42px] h-[42px] bg-[#921115] rounded-xl flex justify-center items-center text-white shadow-md flex-shrink-0 relative z-10 hidden md:flex">
                    <span className="material-symbols-outlined">domain</span>
                </div>

                <div className="ml-4 flex-1 relative z-10 hidden md:block">
                    <h2 className="m-0 text-lg font-bold text-gray-900 tracking-tight">Hostel Management System</h2>
                    <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mt-0.5">Chandigarh Group of Colleges, Mohali</div>
                </div>

                <div className="flex items-center gap-3 relative z-10 ml-auto">
                    {/* Search */}
                    {showSearch && (
                        <form onSubmit={handleSearch} className="animate-scale-in">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onBlur={() => { if (!searchQuery) setShowSearch(false); }}
                                placeholder="Search pages..."
                                className="px-4 py-2 border border-gray-300 rounded-full text-sm bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all w-48"
                            />
                        </form>
                    )}
                    <button onClick={() => setShowSearch(!showSearch)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">{showSearch ? 'close' : 'search'}</span>
                    </button>

                    {/* Notifications */}
                    <button onClick={() => navigate(`/${user.role}/dashboard`)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 relative">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>

                    {/* Profile */}
                    <div ref={profileMenuRef} className="relative">
                        <div
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#1abc9c] text-white flex justify-center items-center font-bold text-sm shadow-sm ring-2 ring-white overflow-hidden">
                                {initials}
                            </div>
                            <div className="hidden sm:block">
                                <span className="block text-sm font-bold text-gray-800">{user.name}</span>
                                <span className="block text-[11px] text-gray-500 capitalize">{user.role}</span>
                            </div>
                            <span className={`material-symbols-outlined text-gray-400 text-sm hidden sm:block transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>

                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-scale-in origin-top-right">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                    {user.rollNumber && <div className="text-xs text-gray-400 mt-0.5">Roll: {user.rollNumber}</div>}
                                </div>
                                <button
                                    onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className="material-symbols-outlined text-[18px] text-blue-500">person</span>
                                    View Profile
                                </button>
                                <button
                                    onClick={() => { setShowProfileMenu(false); navigate(`/${user.role}/dashboard`); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className="material-symbols-outlined text-[18px] text-gray-500">dashboard</span>
                                    Dashboard
                                </button>
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Profile Modal */}
            <Modal open={showProfileModal} onClose={() => setShowProfileModal(false)} title="My Profile">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-[#1abc9c] text-white flex justify-center items-center font-bold text-xl shadow-md ring-4 ring-[#1abc9c]/20">
                            {initials}
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</div>
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</div>
                            <div className="text-sm font-medium text-gray-900">{user.phone}</div>
                        </div>
                        {user.rollNumber && (
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Roll Number</div>
                                <div className="text-sm font-medium text-gray-900">{user.rollNumber}</div>
                            </div>
                        )}
                        {user.roomNumber && (
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Room</div>
                                <div className="text-sm font-medium text-gray-900">Room {user.roomNumber}, Block {user.block}</div>
                            </div>
                        )}
                    </div>
                    <div className="pt-2">
                        <button onClick={() => setShowProfileModal(false)} className="btn btn-secondary w-full">Close</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
