import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import AdminApp from './admin/AdminApp';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import TerminiCondizioni from './pages/TerminiCondizioni';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/termini-e-condizioni" element={<TerminiCondizioni />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}
