'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch/switch';
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
          <div className="space-y-6 px-4">
            <div className="flex items-center justify-center space-x-4">
              <Switch id="terms" className="h-20 w-[88%]" />
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-full h-12"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="rounded-full h-12"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="rounded-full h-12"
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
