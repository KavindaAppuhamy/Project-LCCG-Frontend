import React from 'react';
import { Route, Routes } from "react-router-dom";
import ProjectComponent from '../../components/projectComponent';
import HeaderComponent from '../../components/headerComponent';
import HomePage from '../../components/homeComponent';
import MembersRegistration from '../Admin/membersRegistration';

const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <HeaderComponent />
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center">
        <Routes path="/*">
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<h1 className="text-2xl font-bold">About Us</h1>} />
          <Route path="/project" element={<ProjectComponent />} />
          <Route path="/newsletter" element={<h1 className="text-2xl font-bold">Newsletter</h1>} />
          <Route path="/testimonial" element={<h1 className="text-2xl font-bold">Testimonial</h1>} />
          <Route path="/teams" element={<h1 className="text-2xl font-bold">Teams</h1>} />
          <Route path="/member-registration" element={<MembersRegistration/>} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;