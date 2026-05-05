// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Global/Header';
import Footer from './components/Global/Footer';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import SmileGallery from './pages/SmileGallery/SmileGallery';
import Testimonials from './pages/Testimonials/Testimonials';
import DentalImplants from './pages/Services/DentalImplants';
import Invisalign from './pages/Services/Invisalign';
import Cosmetic from './pages/Services/Cosmetic';
import Login from './pages/Login/login'; 
import Register from './pages/Register/Register';
import Logout from './pages/Login/logout';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminRoute from './routes/AdminRoute';
import PrivateRoute from './routes/PrivateRoute';
import PatientPortalRoute from './routes/PatientPortalRoute';
import BookAppointment from './pages/BookAppointment/BookAppointment';
import MyDashboard from './pages/MyDashboard/MyDashboard';
import NotFound from './pages/NotFound/NotFound';



export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes> 
            <Route path="/" element={<Home />} />
            <Route
              path="/contact"
              element={
                <PrivateRoute>
                  <Contact />
                </PrivateRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <PrivateRoute>
                  <BookAppointment />
                </PrivateRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<SmileGallery />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/cosmetic" element={<Cosmetic />} />
            <Route path="/implants" element={<DentalImplants />} />
            <Route path="/invisalign" element={<Invisalign />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/dashboard/*"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/my-dashboard"
              element={
                <PatientPortalRoute>
                  <MyDashboard />
                </PatientPortalRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
