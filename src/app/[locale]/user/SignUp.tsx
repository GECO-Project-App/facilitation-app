'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {supabase} from '@/lib/supabase/supabaseClient';
import {useRouter} from '@/navigation';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Sign up submitted:', formData);
    try {
      const {data, error} = await supabase.auth.signUp({
        email: formData.email, 
        password: formData.password,
        // options: {
        //   data: {
        //     displayName: 'jack',
        //   },
        // },
      }).finally(() => {
        router.push("/");
    });

      if (error) throw error;

      // alert('Signup successful! Please check your email for verification.');
      setFormData({email: '', password: '', confirmPassword: ''});
      console.log('DATA: ', data);
    } catch (error) {
      alert('Error signing up: ' + error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="h-96 flex flex-col justify-between">
      <div className="space-y-6 px-4">
        <div className="space-y-2">
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-12 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="h-12 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="h-12 rounded-full"
          />
        </div>
      </div>
      <div className="mt-14 flex justify-center pb-4">
      <Button type="submit">Sign Up</Button>
      </div>
    </form>
  );
};

export default SignUp;
