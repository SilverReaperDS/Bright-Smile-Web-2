import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Overview from './Overview';
import Messages from './Messages';
import Testimonials from './Testimonials';
import Gallery from './Gallery';
import Appointments from './Appointments';
import Users from './Users';

export default function DashboardContent() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="messages" element={<Messages />} />
      <Route path="testimonials" element={<Testimonials />} />
      <Route path="gallery" element={<Gallery />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="users" element={<Users />} />
    </Routes>
  );
}