import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createApplication,
  JobApplication,
} from "../../store/jobApplicationsSlice.ts";
import {
  fetchContractTypes,
  fetchStatuses,
  selectOptions,
} from "../../store/optionsSlice.ts";
import { AppDispatch } from "../../store/store.ts";

const initialState: Omit<JobApplication, "id"> = {
  company: "",
  jobTitle: "",
  status: "Wishlist",
  applicationDate: "",
  interviewDate: "",
  notes: "",
  contractType: "",
  jobDescription: "",
  createdAt: new Date().toISOString(),
  financialInformation: "",
  location: "",
};

const NewApplication: React.FC = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { contractTypes, statuses, loading, error } =
    useSelector(selectOptions);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStatuses());
    dispatch(fetchContractTypes());
  }, [dispatch]);

  // handle input change
  const handleOnChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value as keyof typeof formData,
    });
  };

  // handle form submission
  const handleOnSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const selectedStatus = statuses.find((s) => s.name === formData.status);
    const selectedContractType = contractTypes.find(
      (ct) => ct.name === formData.contractType
    );

    // Create the new application object
    const newApplication = {
      ...formData,
      statusId: selectedStatus?.id || "",
      contractTypeId: selectedContractType?.id || "",
    };

    try {
      await dispatch(createApplication(newApplication)).unwrap();

      // Reset the form
      setFormData(initialState);
      // Navigate back to the Kanban board
      navigate("/kanban");
    } catch (error) {
      console.error("Failed to create a new application:", error);
    }

    console.log("form data", newApplication);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Application
        </h2>
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" method="POST">
          {/* Left Column */}
          <div>
            {/* Company Name */}
            <div className="form-group">
              <label htmlFor="company" className="form-label">
                Company:
              </label>
              <input
                type="text"
                name="company"
                id="company"
                placeholder="Enter Company"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.company}
                required
              />
            </div>

            {/* Job Title */}
            <div className="form-group">
              <label htmlFor="jobTitle" className="form-label">
                Job Title:
              </label>
              <input
                type="text"
                name="jobTitle"
                id="jobTitle"
                placeholder="Enter Job Title"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.jobTitle}
                required
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status:
              </label>
              <select
                name="status"
                id="status"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.status}
                required
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.name}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Application Date */}
            <div className="form-group">
              <label htmlFor="applicationDate" className="form-label">
                Application Date:
              </label>
              <input
                type="date"
                name="applicationDate"
                id="applicationDate"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.applicationDate}
                required
              />
            </div>

            {/* Interview Date */}
            <div className="form-group">
              <label htmlFor="interviewDate" className="form-label">
                Interview Date (Optional):
              </label>
              <input
                type="datetime-local"
                name="interviewDate"
                id="interviewDate"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.interviewDate}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Contract Type */}
            <div className="form-group">
              <label htmlFor="contractType" className="form-label">
                Contract Type:
              </label>
              <select
                id="contractType"
                name="contractType"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.contractType}
                required
              >
                {contractTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes (Optional):
              </label>
              <textarea
                name="notes"
                id="notes"
                placeholder="Enter notes"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.notes}
                maxLength={200}
              />
            </div>

            {/* Job Description */}
            <div className="form-group">
              <label htmlFor="jobDescription" className="form-label">
                Job Description:
              </label>
              <textarea
                name="jobDescription"
                id="jobDescription"
                placeholder="Enter job description"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.jobDescription}
                required
              />
            </div>

            {/* Financial Information */}
            <div className="form-group">
              <label htmlFor="financialInformation" className="form-label">
                Financial Information (Optional):
              </label>
              <input
                type="text"
                name="financialInformation"
                id="financialInformation"
                placeholder="Enter salary, benefits, etc."
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.financialInformation}
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location (Optional):
              </label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Enter Location"
                className="form-input border border-gray-300"
                onChange={handleOnChange}
                value={formData.location}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 lg:col-span-2 flex items-center justify-center">
            <button
              type="submit"
              onClick={handleOnSubmit}
              className="bg-indigo-600 text-white w-[40%] py-2 rounded-md hover:bg-indigo-700"
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewApplication;
