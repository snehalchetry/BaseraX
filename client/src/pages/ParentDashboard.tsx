import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ParentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const quickActions = [
        { icon: 'directions_walk', label: 'Outing Requests', desc: 'Review and approve student outings', path: '/parent/outings', color: 'bg-teal-50 text-teal-600 border-teal-100', iconBg: 'bg-teal-600' },
        { icon: 'restaurant', label: 'Food Menu', desc: 'View hostel mess menu', path: '/food-menu', color: 'bg-amber-50 text-amber-600 border-amber-100', iconBg: 'bg-amber-500' },
    ];

    return (
        <>
            <div className="mb-6 animate-fade-slide-in">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    Welcome, {user?.name}! <span className="text-2xl">👋</span>
                </h1>
                <p className="text-sm text-gray-500 font-medium">Parent Dashboard — Monitor your child's hostel activities.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {quickActions.map((action, i) => (
                    <div
                        key={i}
                        onClick={() => navigate(action.path)}
                        className={`rounded-xl border shadow-sm p-6 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md animate-fade-slide-in ${action.color}`}
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        <div className={`w-[52px] h-[52px] rounded-[14px] flex justify-center items-center text-white shadow-sm flex-shrink-0 ${action.iconBg}`}>
                            <span className="material-symbols-outlined text-[26px]">{action.icon}</span>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-900 mb-0.5">{action.label}</div>
                            <div className="text-xs font-medium text-gray-500">{action.desc}</div>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 ml-auto">arrow_forward</span>
                    </div>
                ))}
            </div>
        </>
    );
}
