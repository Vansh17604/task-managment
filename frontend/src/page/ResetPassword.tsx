import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../api-client";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>(); 
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
      setError(null); 
    } catch (error) {
      
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setMessage(null); 
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Enter new password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
