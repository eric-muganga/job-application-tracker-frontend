import React, { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createApplication,
  NewApplicationPayload,
  Stage,
  updateApplications,
} from "../../store/jobApplicationsSlice.ts";
import {
  fetchContractTypes,
  fetchStatuses,
  selectOptions,
} from "../../store/optionsSlice.ts";
import { AppDispatch } from "../../store/store.ts";

interface FormState {
  id?: string; // Only used when editing an existing application
  company: string;
  jobTitle: string;
  status: string; // We'll convert this to statusId
  applicationDate: string;
  interviewDate: string;
  notes: string;
  contractType: string; // We'll convert this to contractTypeId
  jobDescription: string;
  createdAt: string;
  financialInformation: {
    salary: string;
    currency: string;
    salaryType: string;
    typeOfEmployment: string;
  };
  location: string;
}

const initialState: FormState = {
  company: "",
  jobTitle: "",
  status: "",
  applicationDate: "",
  interviewDate: "",
  notes: "",
  contractType: "",
  jobDescription: "",
  createdAt: new Date().toISOString(),
  financialInformation: {
    salary: "",
    currency: "",
    salaryType: "",
    typeOfEmployment: "",
  },
  location: "",
};

const NewApplication: React.FC = () => {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const { contractTypes, statuses, loading, error } =
    useSelector(selectOptions);
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchStatuses());
    dispatch(fetchContractTypes());
  }, [dispatch]);

  useEffect(() => {
    // If we're editing an existing application, load the data
    if (location.state) {
      const application = location.state;
      const matchedContractType = contractTypes.find(
        (type) => type.id === application.contractTypeId
      );
      setFormData({
        ...application,
        contractType: matchedContractType?.name || "",
      });
      console.log(location.state);
    }
  }, [location, contractTypes]);

  // handle input change
  const handleOnChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value || "", // Ensure empty strings are set instead of `undefined
    });
  };

  // handle nested financialInformation
  const handleFinancialInfoChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      financialInformation: {
        ...prev.financialInformation,
        [name]: value,
      },
    }));
  };

  console.log(formData);
  // handle form submission
  const handleOnSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    // Find the matching GUIDs from your loaded 'statuses' and 'contractTypes'
    const selectedStatus = statuses.find((s) => s.name === formData.status);
    const selectedContractType = contractTypes.find(
      (c) => c.name === formData.contractType
    );

    const isEditMode = !!formData.id;

    // Create the new application object
    const applicationPayload: NewApplicationPayload = {
      company: formData.company,
      jobTitle: formData.jobTitle,
      applicationDate: formData.applicationDate || "",
      interviewDate: formData.interviewDate || null,
      notes: formData.notes,
      jobDescription: formData.jobDescription || "",
      createdAt: new Date().toISOString(), // Automatically set the created date
      financialInformation: {
        // If you leave out "id", the server sees it as a new record
        salary: formData.financialInformation.salary,
        currency: formData.financialInformation.currency,
        salaryType: formData.financialInformation.salaryType,
        typeOfEmployment: formData.financialInformation.typeOfEmployment,
      },
      location: formData.location || "",
      statusId: selectedStatus?.id || "", // Ensure it's a string
      contractTypeId: selectedContractType?.id || "", // Ensure it's a string
    };

    try {
      if (isEditMode) {
        const updatedApplication = {
          id: formData.id!,
          company: formData.company,
          jobTitle: formData.jobTitle,
          statusId: selectedStatus?.id || "", // Map the status to its ID
          status: (formData.status as Stage) || "Wishlist", // Map the status to its name
          contractTypeId: selectedContractType?.id || "", // Map the contract type to its ID
          contractType: formData.contractType || "", // Map the contract type to its name
          applicationDate: formData.applicationDate,
          interviewDate: formData.interviewDate || null,
          notes: formData.notes,
          jobDescription: formData.jobDescription,
          createdAt: formData.createdAt,
          financialInformation: formData.financialInformation,
          location: formData.location || "Unknown",
        };
        await dispatch(
          updateApplications({ applicationToUpdate: updatedApplication })
        ).unwrap();
      } else {
        await dispatch(createApplication(applicationPayload));
      }

      // Reset the form
      setFormData(initialState);
      // Navigate back to the Kanban board
      navigate("/kanban");
    } catch (error) {
      console.error("Failed to create a new application:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {formData.id ? "Edit Application" : "Add New Application"}
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
                type="datetime-local"
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
          </div>

          {/* Right Column */}
          <div>
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

            {/* Financial Information Fields */}
            <div className="form-group">
              <label htmlFor="salary" className="form-label">
                Salary:
              </label>
              <input
                type="text"
                name="salary"
                id="salary"
                placeholder="Enter Salary"
                className="form-input border border-gray-300"
                onChange={handleFinancialInfoChange}
                value={formData.financialInformation.salary}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency" className="form-label">
                Currency:
              </label>
              <select
                name="currency"
                id="currency"
                className="form-input border border-gray-300"
                onChange={handleFinancialInfoChange}
                value={formData.financialInformation.currency}
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="PLN">PLN</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="salaryType" className="form-label">
                Salary Type:
              </label>
              <select
                name="salaryType"
                id="salaryType"
                className="form-input border border-gray-300"
                onChange={handleFinancialInfoChange}
                value={formData.financialInformation.salaryType}
                required
              >
                <option value="Monthly">Monthly</option>
                <option value="Hourly">Hourly</option>
                <option value="Annually">Annually</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="typeOfEmployment" className="form-label">
                Type of Employment:
              </label>
              <select
                name="typeOfEmployment"
                id="typeOfEmployment"
                className="form-input border border-gray-300"
                onChange={handleFinancialInfoChange}
                value={formData.financialInformation.typeOfEmployment}
                required
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Permanent">Permanent</option>
                <option value="Commission-Based">Commission-Based</option>
                <option value="Temporary">Temporary</option>
              </select>
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
                value={formData.location || ""}
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
