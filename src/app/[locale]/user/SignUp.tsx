'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {supabase} from '@/lib/supabase/supabaseClient';
import DialogView from '@/components/modal/DialogView';
import {useTranslations} from 'next-intl';

const SignUp = () => {
  const t = useTranslations('authenticate');
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const {data, error} = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            displayName: formData.firstName + ' ' + formData.lastName,
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
        },
      });
      if (error) throw error;
      setShowDialog(true);
      setFormData({email: '', password: '', confirmPassword: '', firstName: '', lastName: ''});
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
    <>
      {showDialog ? (
        <DialogView
          destinationRoute="/"
          message="Thank you for signing up, Your account is ready!"
          icon="signup"
        />
      ) : (
        <form onSubmit={handleSubmit} className="flex min-h-[448px] h-fit flex-col justify-between">
          <div className="space-y-4 px-4">
            <div className="space-y-2">
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder={t('enterEmail')}
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
                placeholder={t('enterPassword')}
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
                placeholder={t('confirmPassword')}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-12 rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="first-name"
                name="firstName"
                type="text"
                placeholder={t('firstName')}
                value={formData.firstName}
                onChange={handleChange}
                className="h-12 rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="last-name"
                name="lastName"
                type="text"
                placeholder={t('lastName')}
                value={formData.lastName}
                onChange={handleChange}
                className="h-12 rounded-full"
              />
            </div>
          </div>
          <div className="mt-14 flex justify-center pb-6">
            <Button type="submit">{t('signUp')}</Button>
          </div>
        </form>
      )}
    </>
  );
};

export default SignUp;
