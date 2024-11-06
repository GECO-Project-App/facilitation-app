'use client';
import {useToast} from '@/hooks/useToast';
import {logOut} from '@/lib/actions/authActions';
import {profileSchema, ProfileSchema} from '@/lib/zodSchemas';
import {useTeamStore} from '@/store/teamStore';
import {zodResolver} from '@hookform/resolvers/zod';
import {User} from '@supabase/supabase-js';
import {useTranslations} from 'next-intl';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input} from '../ui';

export const ProfileForm = ({user}: {user: User}) => {
  const {toast} = useToast();
  const t = useTranslations();

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user.email,
      password: user.user_metadata.password,
      first_name: user.user_metadata.first_name ?? '',
      last_name: user.user_metadata.last_name ?? '',
      username: user.user_metadata.username ?? '',
    },
  });
  //TODO: Set up updateProfile actions
  useEffect(() => {
    useTeamStore.getState().init();
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          // onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 h-full justify-center">
          <FormField
            control={form.control}
            name="username"
            render={({field}) => (
              <FormItem>
                <FormLabel>{t('profile.metadata.username')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder={t('profile.metadata.enterUsername')}
                    autoComplete="username"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    disabled
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
                    disabled
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
          {/* 
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  placeholder={t('metadata.password')}
                  autoComplete="current-password"
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
          {/* <div className="mt-8 flex justify-center pb-6">
            <Button type="submit" disabled={form.formState.isSubmitting} variant="green">
              {form.formState.isSubmitting ? (
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
              ) : (
                t('profile.save')
              )}
            </Button>
          </div>
        
          */}
          <Button variant="red" formAction={logOut} className="mx-auto">
            {t('profile.logout')}
          </Button>
        </form>
      </Form>
    </>
  );
};
