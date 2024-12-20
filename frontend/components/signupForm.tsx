"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toast from 'react-hot-toast';


export default function SignupFormDemo() {
  const [formData, setState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    role: "USER"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/register`, formData);
      console.log("Registration successful:", response.data);
      toast.success('Registration successful!');
      window.location.href = '/signin';
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        if (axiosError.response) {
          console.error("Registration failed:", axiosError.response.data.message);
          
          // Handle specific error cases
          const errorMessage = axiosError.response.data.message;
          if (errorMessage.includes('already exists')) {
            toast.error('User already exists with this email or username');
          } else if (errorMessage.includes('password')) {
            toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
          } else {
            toast.error(errorMessage || 'Registration failed. Please try again.');
          }
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
            <Label htmlFor="firstname">First name</Label>
            <Input 
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Tyler" 
              type="text" 
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input 
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Durden" 
              type="text" 
            />
          </LabelInputContainer>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Email address</Label>
            <Input 
              id="firstname"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Tyler" 
              type="text" 
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Username</Label>
            <Input 
              id="lastname"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Durden" 
              type="text" 
            />
          </LabelInputContainer>
        </div>
         <div>
         <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••" 
            type="password" 
          />
          <LabelInputContainer>
            <Label htmlFor="role">Role</Label>
            <Select
              defaultValue={formData.role}
              onValueChange={(value) => setState({ ...formData, role: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </LabelInputContainer>
        </LabelInputContainer>
        </div>
        

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
      <div>
        Already have an account? <a  className="font-bold text-blue-700" href="/signin">Sign in</a>
      </div>
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
