import React from "react";

const DoctorAboutTab = ({ doctor }) => {
  return (
    <>
      <div className="relative z-20 sm:z-auto">
        <div className="mx-auto max-w-container px-4 pb-16 sm:px-6 lg:px-8">
          <div className="relative mx-auto grid max-w-[40rem] grid-cols-1 gap-8 lg:max-w-none">
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Address
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.user.address}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Education
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.education}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Age
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.user.age}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="ml-6">
                <h2 className="text-sm font-semibold leading-6 text-slate-900">
                  Gender
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.user.gender === "male" ? doctor.user.gender === 'female' ? "Female" : "Male" : "Not Specified" }
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorAboutTab;
