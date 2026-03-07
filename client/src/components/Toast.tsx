import { useState, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface ToastItem {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    exiting?: boolean;
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = nextId++;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 300);
        }, 3000);
    }, []);

    const iconMap = { success: 'check_circle', error: 'error', info: 'info' };
    const colorMap = {
        success: 'bg-emerald-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${colorMap[toast.type]} ${toast.exiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
                        style={{ minWidth: 280 }}
                    >
                        <span className="material-symbols-outlined text-[20px]">{iconMap[toast.type]}</span>
                        <span className="text-sm font-medium flex-1">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
