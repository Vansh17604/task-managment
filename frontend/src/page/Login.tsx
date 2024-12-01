
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography, Link } from '@mui/material';

import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";


export type SignInFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-lg">
        <Typography className="text-2xl font-bold text-center">
          Login to Your Account
        </Typography>
        
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Email Field */}
          <div>
            <label className="block mb-1 font-medium">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              {...register("email",{required:"email is must required"})}
              placeholder="Enter your email"
              className="w-full"
            />{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <Input
              type="password"
              id="password"
              {...register("password", {
                required: "This field is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              placeholder="Enter your password"
              className="w-full"
            />{errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Forgotten Password */}
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center">
          <Typography className="text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register Here
            </Link>
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default Login;
