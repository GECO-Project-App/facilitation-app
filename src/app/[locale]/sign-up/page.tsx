'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/lib/supabase/supabaseClient";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Sign up submitted:', formData);
    try {
      const { data, error } = await supabase.auth.signUp({        
        email: formData.email, // Assuming username is an email
        password: formData.password,
      });
  
      if (error) throw error;
  
      alert("Signup successful! Please check your email for verification.");
      setFormData({ email: "", password: "", confirmPassword: "" });
      console.log('DATA: ',data);
    } catch (error) {
      alert("Error signing up: " + error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <p className="text-gray-600">Create a new account to get started</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-14 flex justify-center">
            <Button type="submit">Sign Up</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
