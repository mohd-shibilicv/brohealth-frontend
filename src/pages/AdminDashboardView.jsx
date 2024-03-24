import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Error404Page from '../layouts/Error404Page'
import DashboardNavbar from '../components/Admin/DashboardNavbar'
import DashboardPage from './Admin/Dashboard/DashboardPage'
import Appointments from './Admin/Dashboard/Appointments'
import Doctors from './Admin/Dashboard/Doctors'
import Notifications from './Admin/Dashboard/Notifications'
import DashboardProfile from './Admin/Dashboard/DashboardProfile'
import Account from './Admin/Dashboard/Account'
import Patients from './Admin/Dashboard/Patients'
import ChatSection from './Admin/Dashboard/ChatSection'
import AccountVerifications from './Admin/Dashboard/AccountVerifications'
import VerificationDetails from './Admin/Dashboard/VerificationDetails'
import AdminAppointmentDetails from '../components/Appointments/AdminAppointmentDetails'
import Prescriptions from './Admin/Dashboard/Prescriptions'
import AdminPrescriptionDetails from '../components/Prescriptions/AdminPrescriptionDetails'


const AdminDashboardView = () => {
  return (
    <>
        <DashboardNavbar content={
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/:appointmentId" element={<AdminAppointmentDetails />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/prescriptions" element={<Prescriptions />} />
                <Route path="/prescriptions/:prescriptionId" element={<AdminPrescriptionDetails />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/verifications" element={<AccountVerifications />} />
                <Route path="/verifications/detail/:verificationId" element={<VerificationDetails />} />
                <Route path="/profile" element={<DashboardProfile />} />
                <Route path="/account" element={<Account />} />
                <Route path="*" element={<Error404Page />} />
            </Routes>
        } />
    </>
  )
}

export default AdminDashboardView