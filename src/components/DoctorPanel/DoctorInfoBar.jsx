import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDoctorById } from "../../services/DoctorPanel/DoctorService";

const DoctorInfoBar = ({ setDoctor }) => {
  const [doctor, setLocalDoctor] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getDoctor();
  }, [id]);

  const getDoctor = async () => {
    try {
      const response = await getDoctorById(id);
      console.log("Doctor API response:", response);
      setLocalDoctor(response.data);
      // Pass doctor data to parent component
      setDoctor(response.data);
    } catch (error) {
      console.error("Doctor fetch error:", error);
    }
  };

  if (!doctor) return <div className="text-center py-10">Loading...</div>;
  if (doctor === null) return <div>No Doctor found</div>;

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-6 md:p-10 max-w-6xl mx-auto mt-8 mb-8">
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Doctor Photo */}
        <div className="flex-shrink-0">
          <img
            src={doctor.photoUrl}
            alt={doctor.doctorName || "Doctor Photo"}
            className="w-40 md:w-48 h-full object-cover rounded-xl border shadow"
          />
        </div>

        {/* Doctor Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{doctor.doctorName}</h2>
            <p className="text-blue-600 text-lg font-medium">{doctor.specialty}</p>
            <span
              className={`inline-block mt-1 text-sm font-medium px-3 py-1 rounded-full
               ${doctor.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {doctor.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-800">
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
            <p><strong>Education:</strong> {doctor.education}</p>
            <p><strong>Experience:</strong> {doctor.experience}</p>
            <p><strong>Languages:</strong> {doctor.languages}</p>
          </div>

          {doctor.bio && (
            <div className="pt-2">
              <h4 className="font-semibold text-gray-900">About</h4>
              <p className="text-gray-700 text-sm">{doctor.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoBar;