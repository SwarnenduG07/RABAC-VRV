"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function SigninFormDemo() {
 const [formData, setFormData] = useState({
  email: "",
  password: ""
 });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     try {
      const response = await axios.post('http://localhost:3001/api/v1/user/login', formData);
      // Store tokens and role in localStorage
      const data = response.data as {
        accessToken: string;
        refreshToken: string;
        user: {
          role: string;
        };
      };
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken); 
      localStorage.setItem('userRole', data.user.role);
      
      console.log("Login successful:", data);
      window.location.href = '/services';
    } catch (error) {
        console.error("Request error:", error);
        if (error instanceof Error) {
            const axiosError = error as any;
            if (axiosError.response) {
              console.error("Login failed:", axiosError.response.data.message);
              // TODO: Add toast or alert to show error message
            }
          }
    }
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to RABAC
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Email address</Label>
            <Input
              id="firstname"
              name="email"
              placeholder="vrv@gmail.com" 
              type="text" 
              value={formData.email}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>
         <div>
         <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password"
            placeholder="••••••••" 
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </LabelInputContainer>
        </div>
        

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign In &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
