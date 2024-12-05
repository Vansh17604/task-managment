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
  profilephoto: File | null; // Change this to accept a file
};

const Register = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>();

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
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("country", data.country);

    if (data.profilephoto) {
      formData.append("profilephoto", data.profilephoto); // Add the file object
    }

    mutation.mutate(formData); // Pass the FormData object to the mutation
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-2xl mx-auto mt-10 p-16 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-8">Create Your Profile</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <Label className="block text-sm font-medium text-gray-700">Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: "This field is required" })}
              className="w-full mt-2 p-3"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "This field is required" })}
              className="w-full mt-2 p-3"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "This field is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full mt-2 p-3"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          
          <div>
            <Label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </Label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full mt-2">
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
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
          </div>

         
          <div>
            <Label htmlFor="profile-photo" className="block text-sm font-medium text-gray-700">
              Profile Photo
            </Label>
            <Controller
              name="profilephoto"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <input
                  id="profile-photo"
                  type="file"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file || null); 
                  }}
                />
              )}
            />
            {errors.profilephoto && <p className="text-red-500 text-sm mt-1">{errors.profilephoto.message}</p>}
          </div>

          
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
              disabled={mutation.isLoading} 
            >
              {mutation.isLoading ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </form>

        
        <p className="text-center mt-6 text-gray-500">
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
