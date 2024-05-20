import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import {
  fetchDoctors,
  setSearchTerm,
  setPage,
} from "../store/slices/doctorSlice";

const Doctors = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState("");
  const dispatch = useDispatch();
  const { doctors, loading, error, searchTerm, page, totalPages } = useSelector(
    (state) => state.doctors
  );

  useEffect(() => {
    dispatch(fetchDoctors({ page, searchTerm }));
  }, [dispatch, page, searchTerm]);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const debouncedFetchDoctors = useCallback(
    debounce((searchTerm) => {
      dispatch(fetchDoctors({ page: 1, searchTerm }));
    }, 300),
    []
  );

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    debouncedFetchDoctors(newSearchTerm);
    dispatch(setSearchTerm(newSearchTerm));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  return (
    <div className="container mx-auto px-4 pt-20 pb-16">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Doctors</h1>
        <p className="text-gray-600">Find the perfect doctor for your needs.</p>
      </div>

      <div className="flex justify-between items-center my-10">
        {/* Filter Button */}
        {/* <Button
          variant="outlined"
          color="inherit"
          startIcon={<FilterListIcon />}
          onClick={handleFilterToggle}
          className="mr-4 mb-4 bg-white border-black hover:bg-gray-200 text-black"
        >
          Filter
        </Button> */}

        <div className="flex w-full items-center justify-center">
          <div className="flex gap-2 border border-black px-2 py-2 rounded-md">
            <SearchIcon />
            <input
              type="search"
              className="outline-none text-black placeholder:text-gray-700"
              placeholder="Search doctors"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
        </div>

        {/* Sort By Button */}
        <div className="hidden sm:flex justify-center items-center">
          <form method="get" className="sorting-form flex gap-2 items-center">
            <div className="relative">
              <select
                name="sort"
                id="sort"
                onChange={handleSortChange}
                className="border border-black p-2 rounded-md min-w-[150px]"
              >
                <option value="default">Default</option>
                <option value="specialization">Specialization</option>
                <option value="fee">Fee</option>
                <option value="expertise">Expertise</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      {/* Filter Form (Show conditionally) */}
      {/* {showFilter && <FilterForm onApply={() => setShowFilter(false)} />} */}

      {/* Doctor Listing */}
      {doctors.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor, index) => (
            <DoctorCard key={index} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="h-full bg-white border border-black rounded p-4 shadow-md">
          <div
            className="flex justify-center flex-col gap-2 items-center doctor-card"
          >
            <h2 className="font-semibold text-lg">
              No Doctors Found
            </h2>
          </div>
          <Link
            to={`/`}
            className="flex justify-center items-center my-3 relative"
          >
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
            >
              Back
            </Button>
          </Link>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          className="mt-20 justify-center"
        />
      </div>
    </div>
  );
};

const FilterForm = () => {
  // Implement your filter form logic here
  return <div className="bg-white"></div>;
};

const DoctorCard = ({ doctor }) => {
  const fullProfilePictureUrl = `${doctor.user.profile_picture}`;

  return (
    <div className="h-full bg-white border border-black rounded p-4 shadow-md">
      <div
        key={doctor.id}
        className="flex justify-center flex-col gap-2 items-center doctor-card"
      >
        <img
          className="object-contain rounded-lg max-w-[250px] max-h-[250px]"
          src={fullProfilePictureUrl}
          alt={`${doctor.user.first_name} ${doctor.user.last_name}`}
        />
        <h2 className="font-semibold text-lg">
          Dr. {doctor.user.first_name} {doctor.user.last_name}
        </h2>
        <p className="text-md">{doctor.specialization}</p>
        <p className="text-sm">
          {doctor.years_of_experience} years of experience
        </p>
      </div>
      <Link
        to={`/doctors/${doctor.id}`}
        className="flex justify-center items-center my-3 relative"
      >
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          sx={{
            mt: 3,
            mb: 2,
            color: "black",
            backgroundColor: "#FFF",
            borderColor: "black",
            "&:hover": {
              backgroundColor: "#000",
              color: "white",
            },
          }}
        >
          View Details
        </Button>
      </Link>
    </div>
  );
};

export default Doctors;
