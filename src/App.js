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
import PrivateRoute from './routes/PrivateRoute';



export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes> 
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<SmileGallery />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/cosmetic" element={<Cosmetic />} />
            <Route path="/implants" element={<DentalImplants />} />
            <Route path="/invisalign" element={<Invisalign />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
	    <Route path="/logout" element={<Logout />} />
	    <Route path="/dashboard/*" element={<PrivateRoute> <Dashboard /> </PrivateRoute> } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
