import React, { useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { JobApplication } from "../../../store/jobApplicationsSlice";

interface ApplicationDetailProps {
  application: JobApplication;
  onClose: () => void;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  application,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md"
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
            <p>
              <span className="font-semibold text-gray-700">Applied On:</span>{" "}
              {application.applicationDate}
            </p>
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
              {application.jobDescription}
            </p>
          )}
          {application.interviewDate && (
            <p>
              <span className="font-semibold text-gray-700">
                Interview Date:
              </span>{" "}
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
              {application.financialInformation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
