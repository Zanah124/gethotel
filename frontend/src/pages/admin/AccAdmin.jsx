import React from 'react';
import NavbarAdmin from '../../components/layout/NavbarAdmin';
import Dashboard from './Dashboard';

const AccAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <NavbarAdmin />

     
      <div className="pt-20 px-4 md:px-8 lg:px-16">
        <Dashboard />
      </div>
    </div>
  );
};

export default AccAdmin;   