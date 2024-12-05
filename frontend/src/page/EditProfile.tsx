import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAppContext } from "@/context/AppContext";
import * as apiClient from "../api-client";
import { UserType } from "../../../backend/src/models/user";

export const EditProfile = () => {
  const { showToast } = useAppContext();
  const [user, setUser] = useState<UserType | null>(null);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<Blob | string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const usersData: UserType = await apiClient.fetchProfile();
        setUser(usersData);
        setEmail(usersData.email);
        setName(usersData.name);
        setCountry(usersData.country || "");
        setPreviewImage(usersData.profilephoto || null);
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProfilePhoto(file); 
    }
  };

  
  const handleSave = async () => {
    if (!name.trim() || !country.trim()) {
      showToast({
        message: "Please fill all required fields",
        type: "ERROR",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email);
    formData.append("country", country.trim());

    if (profilePhoto) {
      formData.append("profilephoto", profilePhoto); 
    }

    try {
      const response = await apiClient.updateUserProfile(formData);
      showToast({
        message: response.message || "Profile updated successfully",
        type: "SUCCESS",
      });
      setUser(response.user); 
      navigate("/profile"); 
    } catch (error) {
      showToast({
        message: "Failed to update profile",
        type: "ERROR",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>

        <form className="space-y-6">
          <div className="flex justify-center mb-6">
            <img
              src={previewImage || "/default-profile.png"}
              alt={`${name}'s profile`}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mt-1 p-2 w-full border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/profile")} 
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
