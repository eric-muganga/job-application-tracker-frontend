import React, { useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { format } from "date-fns";

import {
  deleteApplication,
  JobApplication,
} from "../../../store/jobApplicationsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { useNavigate } from "react-router-dom";

interface ApplicationDetailProps {
  application: JobApplication;
  onClose: () => void;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  application,
  onClose,
}) => {
  // Create a ref to the modal element
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Function to handle clicks outside the modal
  const handleClickOutside = (event: MouseEvent) => {
    // Check if the modalRef is set and the clicked element is NOT inside the modal
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  // useEffect hook to set up and clean up the event listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function to format `jobDescription` with line breaks
  const formatText = (text: string | undefined) =>
    text?.split("\n").map((line, index) => (
      <div key={index} className="mb-2">
        {" "}
        {/* Use div here instead */}
        {line}
      </div>
    ));

  // Function to handle the edit button click
  const handleEditClick = () => {
    navigate("/application/edit", { state: application });
  };

  // Function to handle the delete button click
  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (confirmed) {
      try {
        await dispatch(deleteApplication({ id: application.id }));

        onClose(); // Close the modal
      } catch (error) {
        console.error("Failed to delete application", error);
      }
    }
  };

  if (!application) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
          <p className="text-center text-gray-500">Application not found.</p>
          <button
            onClick={onClose}
            className="bg-indigo-500 text-white mt-4 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md overflow-y-auto"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {application.jobTitle}
            </h2>
            <p className="text-gray-500">{application.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 focus:outline-none"
            aria-label="Close"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>
        <hr className="border-gray-200 mb-4" />

        {/* Content Section */}
        <div className="space-y-4 text-sm">
          <p>
            <span className="font-semibold text-gray-700">Location:</span>{" "}
            {application.location}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            <span
              className={`py-1 px-2 rounded-md text-white ${
                application.status === "Applied"
                  ? "bg-blue-500"
                  : application.status === "Interviewing"
                  ? "bg-yellow-500"
                  : application.status === "Offer"
                  ? "bg-green-500"
                  : application.status === "Rejected"
                  ? "bg-red-500"
                  : "bg-purple-500"
              }`}
            >
              {application.status}
            </span>
          </p>
          {application.applicationDate && (
            <div>
              <span className="font-semibold text-gray-700">Applied On:</span>{" "}
              {format(new Date(application.applicationDate), "PPpp")}
            </div>
          )}
          {application.contractType && (
            <p>
              <span className="font-semibold text-gray-700">
                Contract Type:
              </span>{" "}
              {application.contractType}
            </p>
          )}
          {application.jobDescription && (
            <p>
              <span className="font-semibold text-gray-700">
                Job Description:
              </span>{" "}
              <br />
              <div className="mt-2 text-gray-600 whitespace-pre-line leading-6 max-h-72 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                {formatText(application.jobDescription)}
              </div>
            </p>
          )}
          {application.interviewDate && (
            <p>
              <span className="font-semibold text-gray-700">
                Interview Date:
              </span>
              {application.interviewDate}
            </p>
          )}
          {application.notes && (
            <p>
              <span className="font-semibold text-gray-700">Notes:</span>{" "}
              {application.notes}
            </p>
          )}
          {application.financialInformation && (
            <p>
              <span className="font-semibold text-gray-700">
                Financial Information:
              </span>{" "}
              <br />
              {application.financialInformation.salary}{" "}
              {application.financialInformation.currency} (
              {application.financialInformation.salaryType}) -{" "}
              {application.financialInformation.typeOfEmployment}
            </p>
          )}
        </div>

        {/* Buttons Section */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
