'use client';
import {teamCodeSchema, TeamCodeSchema} from '@/lib/zodSchemas';
import {useTeamStore} from '@/store/teamStore';
import {zodResolver} from '@hookform/resolvers/zod';
import {Rocket} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {RemoveMember} from './icons';
import {TeamAvatars} from './TeamAvatars';
import {Button, Form, FormControl, FormField, FormItem, FormMessage, Input} from './ui';

export const TeamCard = () => {
  const {currentTeam} = useTeamStore();
  const form = useForm({
    resolver: zodResolver(teamCodeSchema),
    defaultValues: {
      code: '',
    },
  });
  const onSubmit = async (data: TeamCodeSchema) => {
    console.log(data);
  };

  return (
    <div className="md:w-[80%] mx-auto">
      {currentTeam ? (
        <div className="bg-green rounded-3xl border-2 border-black p-4  flex flex-col gap-4 h-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-center text-base font-semibold">Can not see your team? </p>
                <p className="text-center text-base font-semibold">Enter team code here:</p>
              </div>
              <FormField
                control={form.control}
                name="code"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter code"
                        className="px-4 py-2 text-sm font-normal "
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                variant="white"
                size="xs"
                className="mx-auto">
                {form.formState.isSubmitting ? '...' : 'Join team'}
                <Rocket size={20} />
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="bg-yellow  rounded-3xl border-2 border-black p-4 flex flex-col gap-4 h-full">
          <TeamAvatars />
          <Button variant="white" size="xs" className=" justify-between w-full">
            Test
            <RemoveMember />
          </Button>
          <Button variant="white" size="xs" className=" justify-between w-full">
            Test
            <RemoveMember />
          </Button>
        </div>
      )}
    </div>
  );
};
