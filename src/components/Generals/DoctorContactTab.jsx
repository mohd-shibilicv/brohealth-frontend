import React from "react";

const DoctorContactTab = ({ doctor }) => {
  return (
    <>
      <div className="relative z-20 sm:z-auto">
        <div className="mx-auto max-w-container px-4 pb-16 sm:px-6 lg:px-8">
          <div className="relative mx-auto grid max-w-[40rem] grid-cols-1 gap-8 lg:max-w-none">
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Email
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.user.email}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Mobile Number
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.user.mobile_number}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Clinic Address
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.clinic_address}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Clinic Mobile Number
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.clinic_phone_number}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Clinic Website
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.clinic_website}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorContactTab;
