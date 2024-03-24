import React from 'react'

const DoctorEducationTab = ({ doctor }) => {
  return (
    <>
      <div className="relative z-20 sm:z-auto">
        <div className="mx-auto max-w-container px-4 pb-16 sm:px-6 lg:px-8">
          <div className="relative mx-auto grid max-w-[40rem] grid-cols-1 gap-8 lg:max-w-none">
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
                  Specialization
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {doctor.specialization}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DoctorEducationTab