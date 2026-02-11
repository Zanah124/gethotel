import React from 'react';
import EmployeeReservations from '../../pages/employee/EmployeeReservations';

export default function CheckIn() {
  return (
    <EmployeeReservations 
      initialStatut="confirmee"
      pageTitle="Check-in des arrivées"
      lockFilter={true}
    />
  );
}