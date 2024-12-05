
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

export const register = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    body: formData, 
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message || "Registration failed");
  }

  return responseBody;
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

export type Task = {
  title: string;
  description: string;
  status: string;
};

export type Board = {
  _id: string;
  name: string;
  task: Task[];
};


export const createBoard = async (name: string, task: Task[]) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, task }), 
  });

  if (!response.ok) {
    throw new Error("Error creating board");
  }

  return response.json();
};


export const getBoard = async (boardId: string): Promise<Board> => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}`, { 
    credentials: "include" 
  });

  if (!response.ok) {
    throw new Error("Error fetching board");
  }

  return response.json();
};


export const updateBoard = async (boardId: string, name: string, task: Task[]) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, task }), 
  });

  if (!response.ok) {
    throw new Error("Error updating board");
  }

  return response.json();
};


export const deleteBoard = async (boardId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error deleting board");
  }

  return response.json();
};


export const addTaskToBoard = async (boardId: string, task: Task) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/task`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task), 
  });

  if (!response.ok) {
    throw new Error("Error adding task to board");
  }

  return response.json();
};


export const updateTaskOnBoard = async (boardId: string, taskId: string, task: Task) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/task/${taskId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task), 
  });

  if (!response.ok) {
    throw new Error("Error updating task");
  }

  return response.json();
};


export const deleteTaskFromBoard = async (boardId: string, taskId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/boards/${boardId}/task/${taskId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error deleting task");
  }

  return response.json();
};


export const updateUserProfile = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/profile/edit`, {
    method: "PUT",
    credentials: "include",
    body: formData, 
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message || "Profile update failed");
  }

  return responseBody;
};

export const fetchProfile = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching user profile");
  }

  return response.json();
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to request password reset");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    throw error; 
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to reset password");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error in resetPassword:", error);
    throw error; 
  }
};


