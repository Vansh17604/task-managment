import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext"; 
import * as apiClient from "../api-client"; 
import { UserType } from "../../../backend/src/models/user"; 
import { useNavigate } from "react-router-dom";
export const Profile: React.FC = () => {
  const { showToast } = useAppContext(); 
  const [user, setUser] = useState<UserType | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        
        const response = await apiClient.fetchProfile(); 
        setUser(response); 
      } catch (error) {
        showToast({
          message: "Failed to fetch user data", 
          type: "ERROR",
        });
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, [showToast]); 

 
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

        
        <div className="flex justify-center mb-6">
          <img
            src={user?.profilephoto || "/default-profile.png"} 
            alt={`${user?.name}'s profile`}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        </div>

        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-700">Name</span>
            <p className="mt-1 p-2 w-full border rounded-md bg-gray-100">
              {user?.name}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Email</span>
            <p className="mt-1 p-2 w-full border rounded-md bg-gray-100">
              {user?.email}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Country</span>
            <p className="mt-1 p-2 w-full border rounded-md bg-gray-100">
              {user?.country || "Not specified"} 
            </p>
          </div>
        </div>

    
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/profile/edit")} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};
