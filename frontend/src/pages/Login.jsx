import React, { useState } from "react";
import * as z from "zod";
import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";

import API from "../lib/api";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginPage() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    const email = values.email.toLowerCase();
    const password = values.password;

    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });

      if (!data?.user || !data?.token) {
        setError("Invalid response from server");
        return;
      }

      localStorage.setItem("token", data.token);
      toast.success(" Login successful");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-lg p-6 shadow-lg mt-20 bg-gray-50 ">
      <h2 className="font-bold text-lg text-neutral-800 ">
        Sign in to your account
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700  p-3 rounded-md text-sm font-medium mt-4">
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
          {/* 
          <div className="mb-4 text-sm text-gray-500 cursor-pointer hover:underline">
            Forgot Password?
          </div> */}
          <button
            className="relative group/btn cursor-pointer bg-gradient-to-br from-black to-neutral-600  block w-full text-white rounded-md h-10 font-medium shadow-md"
            type="submit"
          >
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <span>Sign In →</span>
            )}
          </button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300  to-transparent my-8 h-[2px] w-full" />
          ]{" "}
          <div className="flex justify-center items-center gap-2">
            <div>
              <span> Don’t have an account? </span>
            </div>
            <Link
              to="/register"
              className="text-sm text-neutral-700 hover:underline"
            >
              <span className="text-blue-700 ">Register</span>
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

export default LoginPage;
