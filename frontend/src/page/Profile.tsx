import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext"; 
import * as apiClient from "../api-client"; 

export const Profile = () => {
  const { showToast } = useAppContext();
  const [user, setUser] = useState<any>(null); 
  const [profilephoto, setProfilePic] = useState<File | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [uploading, setUploading] = useState<boolean>(false); 
  const [isEditing, setIsEditing] = useState<boolean>(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await apiClient.fetchUserProfile(); 
        setUser(userData);
      } catch (error) {
        showToast({ message: "Failed to fetch user data", type: "ERROR" });
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, []);


  const handleProfilePicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilephoto", file);
      setProfilePic(file);
      setUploading(true); 

      try {
        const response = await apiClient.uploadProfilePic(formData); 
        showToast({ message: response.message || "Profile updated successfully", type: "SUCCESS" });
        setUser(response.user);
      } catch (error) {
        showToast({ message: "Failed to upload profile picture", type: "ERROR" });
      } finally {
        setProfilePic(null);
        setUploading(false); 
      }
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load user profile.</p>
      </div>
    );
  }
  const handleSave = async () => {
    if (!profilephoto) return;
    const formData = new FormData();
    formData.append("profilePic", profilephoto);

    try {
      const response = await apiClient.uploadProfilePic(formData); 
      showToast({ message: response.message || "Profile updated successfully", type: "SUCCESS" });
      setUser(response.user); 
    } catch (error) {
      showToast({ message: "Failed to update profile picture", type: "ERROR" });
    } finally {
      setIsEditing(false); 
      setProfilePic(null); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full sm:w-96">
        <h2 className="text-3xl font-bold mb-4 text-center">Profile</h2>
        <form className="space-y-6" method="POST" encType="multipart/form-data">
         <div className="flex justify-center mb-6">
          <img
            src={user.profilephoto}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"  
          />
        </div>


       
          {isEditing && (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  defaultValue={user.name}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  defaultValue={user.email}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  id="country"
                  defaultValue={user.country || ""}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Profile Picture</label>
                <input
                  type="file"
                  name="profilephoto"
                  accept="image/*"
                  onChange={handleProfilePicUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
                {uploading && <p className="text-blue-600 mt-2">Uploading...</p>}
              </div>
            </div>
          )}

          
          <div className="flex justify-between items-center mt-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  disabled={uploading}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
