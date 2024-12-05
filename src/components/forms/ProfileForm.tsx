'use client';
import {useToast} from '@/hooks/useToast';
import {updateProfile} from '@/lib/actions/profileActions';
import {createClient} from '@/lib/supabase/client';
import {profileSchema, ProfileSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {User} from '@supabase/supabase-js';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {AuthTabs} from '../AuthTabs';
import {Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input} from '../ui';

export const ProfileForm = ({user}: {user: User}) => {
  const {toast} = useToast();
  const t = useTranslations();
  const supabase = createClient();

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email ?? '',
      first_name: user?.user_metadata.first_name ?? '',
      last_name: user?.user_metadata.last_name ?? '',
    },
  });
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

  if (!user) return <AuthTabs />;

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">
        {t('profile.welcome', {name: user.user_metadata.first_name})}
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 h-full justify-center">
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

          <div className="mt-8 flex justify-center gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting} variant="green">
              {form.formState.isSubmitting ? (
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              ) : (
                t('profile.save')
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex justify-center ">
        <Button variant="red" onClick={() => supabase.auth.signOut()}>
          {t('profile.logout')}
        </Button>
      </div>
    </section>
  );
};
