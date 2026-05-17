import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Certifications } from './pages/Certifications';
import { CertificationDetail } from './pages/CertificationDetail';
import { Community } from './pages/Community';
import { Contact } from './pages/Contact';
import { Compare } from './pages/Compare';
import { FAQ } from './pages/FAQ';
import { Membership } from './pages/Membership';
import { Newsletter } from './pages/Newsletter';
import { PMService } from './pages/PMService';
import { Store } from './pages/Store';

function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-porcelain dark:bg-obsidian text-slate-900 dark:text-white">
      <Navbar toggleTheme={() => setIsDarkMode((v) => !v)} isDarkMode={isDarkMode} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/certifications/:id" element={<CertificationDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/pm-service" element={<PMService />} />
          <Route path="/store" element={<Store />} />
        </Routes>
      </PublicLayout>
    </Router>
  );
}
