import { RegisterFormData } from "./page/Register";
import { SignInFormData } from "./page/Login";
import { UserType } from "../../backend/src/models/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const fetchBoards = async () => {
  const response = await fetch(`${API_BASE_URL}/api/boards`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching boards");
  }

  return response.json();
};

export const createBoard = async (name: string) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Error creating board");
  }

  return response.json();
};

export const getBoard = async (boardId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}`, { credentials: "include" });

  if (!response.ok) {
    throw new Error("Error fetching board");
  }

  return response.json();
};

export const updateBoard = async (boardId: string, name: string) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/edit`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Error updating board");
  }

  return response.json();
};


export const deleteBoard = async (boardId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/delete`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error deleting board");
  }

  return response.json();
};


export const fetchUserProfile = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include", 
  });

  if (!response.ok) {
    throw new Error("Error fetching user profile");
  }

  return response.json();
};


export const updateUserProfile = async (formData: { name: string; email: string; country: string; profilephoto: File | null }) => {
  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("country", formData.country);

  if (formData.profilephoto) {
    formDataToSend.append("profilephoto", formData.profilephoto);
  }

  const response = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
    method: "PUT",
    credentials: "include",
    body: formDataToSend,
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message);
  }

  return response.json();
};

export const uploadProfilePic = async (formData: FormData): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/upload-profilephoto`, {
      method: "POST",
      headers: {
    
      },
      body: formData,
      credentials: "include", 
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error uploading profile picture: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in uploadProfilePic:", error);
    throw error; 
  }
};

