import React, { useState } from "react";
import * as z from "zod";
import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";

import API from "../lib/api";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    const email = values.email.toLowerCase();
    const password = values.password;

    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/register", { email, password });

      if (!data?.user || !data?.token) {
        setError("Invalid response from server");
        return;
      }

      localStorage.setItem("token", data.token);
      toast.success(" Registration successful", data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-lg p-6 shadow-lg mt-20 bg-gray-50">
      <h2 className="font-bold text-lg text-neutral-800">
        Sign up for an account
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-medium mt-4">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <LabelInputContainer className="mb-6">
                <Label htmlFor="email">Email address *</Label>
                <Input id="email" type="email" {...field} />
                <FormMessage className="text-red-500 fon-sans" />
              </LabelInputContainer>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={"password"}
                    {...field}
                    className="pr-10"
                  />
                </div>
                <FormMessage className="text-red-500 fon-sans" />
              </LabelInputContainer>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <LabelInputContainer className="mb-4">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormMessage className="text-red-500 fon-sans" />
              </LabelInputContainer>
            )}
          />

          <button
            className="relative group/btn cursor-pointer bg-gradient-to-br from-black to-neutral-600 block w-full text-white rounded-md h-10 font-medium shadow-md"
            type="submit"
          >
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <span>Register →</span>
            )}
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8 h-[2px] w-full" />

          <div className="flex justify-center items-center gap-2">
            <div>
              <span>Already have an account? </span>
            </div>
            <Link
              to="/login"
              className="text-sm text-neutral-700 hover:underline"
            >
              <span className="text-blue-700">Login</span>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);

export default RegisterPage;
