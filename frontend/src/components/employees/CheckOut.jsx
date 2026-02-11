import React from 'react';
import EmployeeReservations from '../../pages/employee/EmployeeReservations';

export default function CheckOut() {
  return (
    <EmployeeReservations 
      initialStatut="check_in"
      pageTitle="Check-out des départs"
      lockFilter={true}
    />
  );
}