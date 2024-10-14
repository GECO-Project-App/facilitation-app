'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {supabase} from '@/lib/supabase/supabaseClient';
import {useTranslations} from 'next-intl';
import { useToast } from "@/hooks/useToast"

const ResetPassword = () => {
  const { toast } = useToast();
  const t = useTranslations('authenticate');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password for:', formData.email);
    toast({
      title: t('emailSent'),
      description: t('emailSentDescription'),
    })
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-fit min-h-[448px] flex-col justify-between max-w-[600px] mx-auto mt-10">
      <div className="space-y-6 px-4">
        <h2 className="text-2xl font-bold text-center">{t('resetPassword')}</h2>
        <div className="space-y-2"> 
          <Input
            id="login-email"
            name="email"
            type="email"
            placeholder={t('enterEmail')}
            value={formData.email}
            onChange={handleChange}
            required
            className="h-12 rounded-full"
            disabled={loading}
          />
        </div>
      </div>
      <div className="mt-14 flex justify-center pb-6">
        <Button type="submit" disabled={loading} variant="pink">
          {loading ? t('loading') : t('reset')}
        </Button>
      </div>
    </form>
  );
};

export default ResetPassword;
