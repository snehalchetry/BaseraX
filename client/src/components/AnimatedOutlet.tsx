import { useLocation, useOutlet } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export default function AnimatedOutlet() {
    const location = useLocation();
    const outlet = useOutlet();
    const [displayedOutlet, setDisplayedOutlet] = useState<ReactNode>(outlet);
    const [animClass, setAnimClass] = useState('page-enter');
    const prevKey = useRef(location.pathname);

    useEffect(() => {
        if (location.pathname !== prevKey.current) {
            // Start exit
            setAnimClass('opacity-0 translate-y-2 transition-all duration-150');
            const timer = setTimeout(() => {
                prevKey.current = location.pathname;
                setDisplayedOutlet(outlet);
                setAnimClass('page-enter');
            }, 150);
            return () => clearTimeout(timer);
        } else {
            setDisplayedOutlet(outlet);
        }
    }, [location.pathname, outlet]);

    return (
        <div className={animClass}>
            {displayedOutlet}
        </div>
    );
}
