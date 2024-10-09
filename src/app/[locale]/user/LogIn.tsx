'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from "@/lib/supabase/supabaseClient";
import {useRouter} from '@/navigation';

const LogIn = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email, // Assuming username is an email
          password: formData.password,
        }).finally(() => {
            router.push("/");
        });
  
        if (error) throw error;
        // setUser(data.user);
        console.log("Logged in successfully!");
        console.log('User: ',data);
        setFormData({ email: "", password: "" });
      } catch (error) {
        alert("Error signing up: " + error);
      }
      setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };  


  return (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-4">
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-4">
                Forgot your password?
              </div>
                
            </div>
          </div>
          <div className="mt-14 flex justify-center">
            <Button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Log In'}</Button>
          </div>
        </form>
  );
};

export default LogIn;
