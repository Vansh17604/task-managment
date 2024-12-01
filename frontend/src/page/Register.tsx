import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Label } from "@/components/ui/label"; 
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, Link } from "react-router-dom"; 
import * as apiClient from "../api-client";
import { useAppContext } from "@/context/AppContext";

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  country: string;
  profilephoto: string; 
};

const Register = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const navigate = useNavigate(); // Hook for navigation
  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterFormData>();
  
  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });


  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Your Profile</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: "This field is required" })}
              className="w-full mt-1"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "This field is required" })}
              className="w-full mt-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "This field is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full mt-1"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Country Field */}
          <div>
            <Label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</Label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <span>{field.value || "Select Country"}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>

          {/* Profile Photo Field */}
          <div>
            <Label htmlFor="profile-photo" className="block text-sm font-medium text-gray-700">
              Profile Photo
            </Label>
            <Controller
              name="profilephoto"
              control={control}
              render={({ field }) => (
                <input
                  id="profile-photo"
                  type="file"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file ? file.name : ""); // Only save file name
                  }}
                />
              )}
            />
            {errors.profilephoto && <p className="text-red-500 text-sm">{errors.profilephoto.message}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Create Profile
            </Button>
          </div>
        </form>

        {/* Navigation to Login */}
        <p className="text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
