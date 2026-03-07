import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AnimatedOutlet from './AnimatedOutlet';

export default function Layout() {
    return (
        <div className="flex h-screen bg-[#f8f9fc]">
            {/* Sidebar - fixed width left panel */}
            <Sidebar />

            {/* Main Content Area - takes remaining width, scrollable */}
            <div className="flex-1 flex flex-col pl-[260px] overflow-hidden">
                <Header />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-8">
                    <div className="max-w-[1200px] mx-auto">
                        <AnimatedOutlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
