'use client';
import {useToast} from '@/hooks/useToast';
import {useRouter} from '@/i18n/routing';
import {updateProfile} from '@/lib/actions/profileActions';
import {createClient} from '@/lib/supabase/client';
import {profileSchema, ProfileSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {User} from '@supabase/supabase-js';
import {ArrowLeft} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {AuthTabs} from '../AuthTabs';
import {Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input} from '../ui';

export const ProfileForm = () => {
  const {toast} = useToast();
  const t = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();
  useEffect(() => {
    const getUser = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, [supabase]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email ?? user?.user_metadata.email ?? '',
      first_name: user?.user_metadata.first_name ?? '',
      last_name: user?.user_metadata.last_name ?? '',
      new_password: '',
    },
    values: {
      email: user?.email ?? user?.user_metadata.email ?? '',
      first_name: user?.user_metadata.first_name ?? '',
      last_name: user?.user_metadata.last_name ?? '',
      new_password: '',
    },
  });

  useEffect(() => {
    form.reset({
      email: user?.email ?? user?.user_metadata.email ?? '',
      first_name: user?.user_metadata.first_name ?? '',
      last_name: user?.user_metadata.last_name ?? '',
      new_password: '',
    });
  }, [form, user]);

  const onSubmit = async (data: ProfileSchema) => {
    const result = await updateProfile(data);

    if (result.error) {
      toast({
        title: t('profile.error'),
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        variant: 'success',
        title: t('profile.success'),
        description: t('profile.updateSuccess'),
      });
    }
  };

  if (!user)
    return (
      <section className="flex flex-col gap-6 w-full">
        <AuthTabs />
      </section>
    );

  return (
    <section className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold">
        {/* {t('profile.welcome', {name: user.user_metadata.first_name})} */}
        {t('profile.title')}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 h-full justify-center w-full">
          <FormField
            control={form.control}
            name="first_name"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t('profile.metadata.firstName')}</FormLabel>

                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder={t('profile.metadata.firstName')}
                    autoComplete="given-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t('profile.metadata.lastName')}</FormLabel>

                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder={t('profile.metadata.lastName')}
                    autoComplete="family-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t('profile.metadata.email')}</FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    placeholder={t('profile.metadata.email')}
                    autoComplete="email"
                    readOnly
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t('profile.metadata.password')}</FormLabel>

                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder={t('profile.metadata.newPassword')}
                    autoComplete="false"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-8 flex justify-center gap-4">
            {form.formState.isDirty && (
              <button type="submit">
                {form.formState.isSubmitting ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                ) : (
                  <h3 className="text-green underline">{t('profile.save')}</h3>
                )}
              </button>
            )}
          </div>
        </form>
      </Form>
      <hr className="w-full" />
      <div className="flex justify-center ">
        <Button variant="red" type="submit" onClick={signOut}>
          {t('profile.logout')} <ArrowLeft size={24} />
        </Button>
      </div>
    </section>
  );
};
