'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from "@/lib/supabase/supabaseClient";
import DialogView from '@/components/modal/DialogView';
import {useTranslations} from 'next-intl';
import Link from 'next/link';
const LogIn = () => {
  const t = useTranslations('authenticate');
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error;
        setShowDialog(true);
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
    <>
    {showDialog ? (
      <DialogView destinationRoute="/" message={t('loggedIn')} icon="login" />
    ) : (
        <form onSubmit={handleSubmit} className="h-fit min-h-[448px] flex flex-col justify-between">
          <div className="space-y-6 px-4">
            <div className="space-y-2">
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder={t('enterEmail')}
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-full h-12" 
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="login-password"
                name="password"
                type="password"
                placeholder={t('enterPassword')}
                value={formData.password}
                onChange={handleChange}
                required
                className="rounded-full h-12"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-4 text-sm text-green cursor-pointer hover:text-green/80">
              <Link href="./user/reset-password">
                {t('forgotPassword')}
              </Link>
              </div>
            </div>
          </div>
          <div className="mt-14 flex justify-center pb-6">
          <Button type="submit" disabled={loading}>
              {loading ? t('loading') : t('logIn')}
            </Button>
          </div>
        </form>
    )}
    </>
  );
};

export default LogIn;
