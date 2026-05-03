import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import Home from './pages/Home';
import NewSearch from './pages/NewSearch';
import History from './pages/History';
import Favorites from './pages/Favorites';
import Analytics from './pages/Analytics';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Help from './pages/Help';
import ComplianceChecker from './pages/ComplianceChecker';
import Compare from './pages/Compare';

const PAGE_TITLES: Record<string, string> = {
  '/':           'Home – BIS Antigravity AI',
  '/search':     'New Search',
  '/history':    'Search History',
  '/favorites':  'Favorites',
  '/analytics':  'Analytics',
  '/library':    'Standards Library',
  '/compliance': 'Compliance Checker',
  '/compare':    'Compare Standards',
  '/settings':   'Settings',
  '/help':       'Help & Support',
};

function AnimatedRoutes() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'BIS Antigravity AI';

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <Topbar title={title} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 min-h-0 overflow-hidden"
        >
          <Routes location={location}>
            <Route path="/"           element={<Home />} />
            <Route path="/search"    element={<NewSearch />} />
            <Route path="/history"   element={<History />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/library"   element={<Library />} />
            <Route path="/compliance" element={<ComplianceChecker />} />
            <Route path="/compare"   element={<Compare />} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="/help"      element={<Help />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-purple-600/8 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-cyan-600/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden bg-[#020617]">
        <Sidebar />
        <AnimatedRoutes />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1424',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0d1424' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#0d1424' } },
        }}
      />
    </BrowserRouter>
  );
}
