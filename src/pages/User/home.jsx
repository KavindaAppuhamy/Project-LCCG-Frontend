import React from 'react';
import { Route, Routes } from "react-router-dom";
import ProjectComponent from '../../components/projectComponent';
import HeaderComponent from '../../components/headerComponent';
import HomePage from '../../components/homeComponent';
import MembersRegistrationPage from './membersRegistrationPage';

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-description)]">
      <HeaderComponent />
      
      <div className="max-w-full px-6 py-12 mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<h1 className="text-2xl font-bold text-[var(--color-heading)]">About Us</h1>} />
          <Route path="/project" element={<ProjectComponent />} />
          <Route path="/newsletter" element={<h1 className="text-2xl font-bold text-[var(--color-heading)]">Newsletter</h1>} />
          <Route path="/testimonial" element={<h1 className="text-2xl font-bold text-[var(--color-heading)]">Testimonial</h1>} />
          <Route path="/teams" element={<h1 className="text-2xl font-bold text-[var(--color-heading)]">Teams</h1>} />
          <Route path="/member-registration-page" element={<MembersRegistrationPage />} />
          <Route path="/*" element={<h1 className="text-xl font-semibold text-[var(--color-heading)]">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
