import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthProvider } from '../contexts/AuthContext';

interface BaseProps {
  children: React.ReactNode;
}

const Base: React.FC<BaseProps> = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </AuthProvider>
    </>
  );
};

export default Base;

