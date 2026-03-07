import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../api/client';

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [stats, setStats] = useState({ pendingOutings: 0, activeComplaints: 0, approvedOutings: 0, unreadNotifications: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [{ data: outings }, { data: complaints }] = await Promise.all([
                    api.get('/outings?limit=10').catch(() => ({ data: { data: { outings: [] } } })),
                    api.get('/complaints?limit=10').catch(() => ({ data: { data: { complaints: [] } } })),
                ]);

                setStats({
                    pendingOutings: (outings.data?.outings || []).filter((o: any) => o.status === 'pending_parent' || o.status === 'pending_warden').length,
                    approvedOutings: (outings.data?.outings || []).filter((o: any) => o.status === 'warden_approved').length,
                    activeComplaints: (complaints.data?.complaints || []).filter((c: any) => c.status !== 'closed').length,
                    unreadNotifications: 0,
                });
            } catch (err) {
                console.error("Dashboard fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
    );

    const handleViewAllOutings = () => {
        navigate(`/${user?.role}/outings`);
    };

    const handleMarkAllRead = () => {
        showToast('All notifications marked as read', 'success');
    };

    const metrics = [
        { icon: 'directions_walk', count: stats.pendingOutings, label: 'Pending Outings', color: 'text-teal-600 bg-teal-50 shadow-teal-500/10 border-teal-100', iconBg: 'bg-teal-600', onClick: () => navigate(`/${user?.role}/outings`) },
        { icon: 'warning', count: stats.activeComplaints, label: 'Active Complaints', color: 'text-amber-600 bg-amber-50 shadow-amber-500/10 border-amber-100', iconBg: 'bg-amber-500', onClick: () => navigate(`/${user?.role}/complaints`) },
        { icon: 'check_circle', count: stats.approvedOutings, label: 'Approved Outings', color: 'text-emerald-600 bg-emerald-50 shadow-emerald-500/10 border-emerald-100', iconBg: 'bg-emerald-600', onClick: () => navigate(`/${user?.role}/outings`) },
        { icon: 'notifications', count: stats.unreadNotifications, label: 'Unread Notifications', color: 'text-blue-600 bg-blue-50 shadow-blue-500/10 border-blue-100', iconBg: 'bg-blue-600', onClick: handleMarkAllRead },
    ];

    return (
        <>
            <div className="mb-6 animate-fade-slide-in">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    Welcome back, {user?.name.split(' ')[0]}! <span className="text-2xl">👋</span>
                </h1>
                <p className="text-sm text-gray-500 font-medium">Here's what's happening at your hostel today.</p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((stat, i) => (
                    <div
                        key={i}
                        onClick={stat.onClick}
                        className={`rounded-xl border shadow-sm p-6 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer animate-fade-slide-in ${stat.color}`}
                        style={{ animationDelay: `${i * 0.08}s` }}
                    >
                        <div className={`w-[52px] h-[52px] rounded-[14px] flex justify-center items-center text-white shadow-sm flex-shrink-0 ${stat.iconBg}`}>
                            <span className="material-symbols-outlined text-[26px]">{stat.icon}</span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.count}</div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 leading-tight">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Outings */}
                <div className="lg:col-span-2 card animate-fade-slide-in" style={{ animationDelay: '0.35s' }}>
                    <div className="bg-brand-primary p-4 rounded-t-lg flex justify-between items-center text-white">
                        <h3 className="text-sm font-semibold m-0 tracking-wide text-white/95">Recent Outing Requests</h3>
                        <button onClick={handleViewAllOutings} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0">View All</button>
                    </div>
                    <div className="p-0 border-x border-b border-gray-100 rounded-b-lg">
                        <div className="p-8 text-center text-sm font-medium text-gray-500">
                            <span className="material-symbols-outlined text-[40px] text-gray-300 block mb-2">directions_walk</span>
                            No recent outing requests. Click "View All" to see all requests or create a new one.
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card animate-fade-slide-in" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-brand-secondary p-4 rounded-t-lg flex justify-between items-center text-white">
                        <h3 className="text-sm font-semibold m-0 tracking-wide text-white/95">Notifications</h3>
                        <button onClick={handleMarkAllRead} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0">Mark All Read</button>
                    </div>
                    <div className="p-0 border-x border-b border-gray-100 rounded-b-lg">
                        <div className="p-8 text-center text-sm font-medium text-gray-500">
                            <span className="material-symbols-outlined text-[40px] text-gray-300 block mb-2">notifications_off</span>
                            You're all caught up! No new notifications.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
