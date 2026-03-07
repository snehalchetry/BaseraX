import { useState, useEffect } from 'react';
import api from '../api/client';

export default function FoodMenu() {
    const [menu, setMenu] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const { data } = await api.get('/menu/current');
                setMenu(data.data);
            } catch (err) {
                console.error('Failed to fetch menu', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <>
            <div className="mb-6 pb-6 border-b border-gray-200 animate-fade-slide-in">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Mess Food Menu</h1>
                <p className="text-sm text-gray-500 font-medium">Check what's cooking this week.</p>
            </div>

            {!menu ? (
                <div className="card p-12 text-center animate-fade-slide-in" style={{ animationDelay: '0.1s' }}>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <span className="material-symbols-outlined text-[32px]">restaurant</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No Active Menu</h3>
                    <p className="text-gray-500 text-sm">The mess menu for this week hasn't been posted yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menu.days.map((day: any, i: number) => (
                        <div key={i} className="card h-full flex flex-col animate-fade-slide-in" style={{ animationDelay: `${i * 0.06}s` }}>
                            <div className="bg-brand-secondary p-4 rounded-t-lg flex items-center gap-3">
                                <span className="material-symbols-outlined text-brand-primary">calendar_today</span>
                                <h3 className="text-white font-bold tracking-wide uppercase text-sm m-0">{day.day}</h3>
                            </div>
                            <div className="p-0 flex-1 divide-y divide-gray-100">
                                {day.meals.map((meal: any, j: number) => (
                                    <div key={j} className="p-4 flex gap-4 hover:bg-gray-50/50 transition-colors">
                                        <div className="w-20 flex-shrink-0 pt-1">
                                            <div className="text-xs font-bold text-brand-primary uppercase tracking-wider">{meal.type}</div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-700 font-medium leading-relaxed">{meal.items}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
