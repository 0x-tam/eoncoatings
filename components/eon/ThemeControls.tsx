'use client';

import {ThemeProvider, useTheme} from 'next-themes';
import {Moon, Sun} from 'lucide-react';
import {useEffect, useState} from 'react';

export function EonThemeProvider({children}:{children:React.ReactNode}) {
 return <ThemeProvider attribute="data-theme" storageKey="eon-theme" defaultTheme="light" enableSystem={false} disableTransitionOnChange>{children}</ThemeProvider>;
}

export function ThemeToggle() {
 const {resolvedTheme,setTheme}=useTheme();
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const dark=mounted&&resolvedTheme==='dark';
 return <button type="button" className="theme-toggle" aria-label={dark?'Switch to light mode':'Switch to dark mode'} title={dark?'Switch to light mode':'Switch to dark mode'} onClick={()=>setTheme(dark?'light':'dark')}><Sun className="theme-sun" size={20} aria-hidden="true"/><Moon className="theme-moon" size={20} aria-hidden="true"/></button>;
}
