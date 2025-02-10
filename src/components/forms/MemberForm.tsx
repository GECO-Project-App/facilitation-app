'use client';
import {useToast} from '@/hooks/useToast';
import {updateTeamMemberProfile} from '@/lib/actions/teamActions';
import {memberSchema, MemberSchema} from '@/lib/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {Tables} from '../../../database.types';
import {Save} from '../icons';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '../ui';

export const MemberForm = ({user}: {user: Tables<'team_members'>}) => {
  const {toast} = useToast();
  const t = useTranslations('team.edit.memberForm');

  const form = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      profile_name: user.profile_name ?? '',
      role: user.role ?? 'member',
      description: user.description ?? '',
    },
  });

  const onSubmit = async (data: MemberSchema) => {
    const result = await updateTeamMemberProfile(user.team_id, data);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: t('profileError'),
        description: result.error,
      });
    } else {
      toast({
        variant: 'success',
        title: t('profileInfo'),
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="profile_name"
            render={({field}) => (
              <FormItem className="items-center flex flex-col gap-1">
                <FormLabel>{t('profileName')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder={t('enterProfileName')}
                    autoComplete="username"
                    className="bg-yellow font-bold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({field}) => (
              <FormItem className="items-center flex flex-col gap-1">
                <FormLabel>{t('role')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder={t('role')}
                    autoComplete="false"
                    className="bg-yellow font-bold"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem className="items-center flex flex-col gap-1">
                <FormLabel>{t('description')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('descriptionPlaceholder')}
                    maxLength={480}
                    {...field}
                    value={field.value ?? ''}
                    className="bg-yellow font-bold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            variant="green"
            size="small"
            className="mx-auto">
            {form.formState.isSubmitting ? (
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
            ) : (
              t('save')
            )}
            <Save />
          </Button>
        </form>
      </Form>
    </>
  );
};
