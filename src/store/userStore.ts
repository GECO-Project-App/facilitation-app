import {ShapeColors} from '@/lib/constants';
import {createClient} from '@/lib/supabase/client';
import type {Session, User} from '@supabase/supabase-js';
import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

interface UserState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initialized: boolean;
  localAvatar: {
    color: string;
    shape: number;
  };
  updateAvatar: (
    svgString: string,
  ) => Promise<{success: boolean; avatarUrl: string; error?: string}>;
  setLocalAvatar: (avatar: {color: string; shape: number}) => void;
  setUser: (user: User, session?: Session) => void;
  avatarUrl: string | null;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => {
        // Create Supabase client instance
        const supabase = createClient();

        // Set up auth listener when store is created
        supabase.auth.onAuthStateChange((_event, session) => {
          set({
            user: session?.user ?? null,
            session: session ?? null,
          });
        });

        return {
          avatarUrl: null,
          user: null,
          session: null,
          isLoading: true,
          initialized: false,
          localAvatar: {
            color: ShapeColors.Green,
            shape: 0,
          },
          setLocalAvatar: (avatar) => set({localAvatar: avatar}),
          setUser: (user, session = undefined) => {
            set({user, session});
          },

          initialize: async () => {
            const {
              data: {session},
            } = await supabase.auth.getSession();
            set({
              user: session?.user ?? null,
              session: session ?? null,
              isLoading: false,
              initialized: true,
            });
          },

          signOut: async () => {
            await supabase.auth.signOut();
          },

          updateAvatar: async (
            svgString: string,
          ): Promise<{success: boolean; avatarUrl: string; error?: string}> => {
            const {
              data: {user},
              error: userError,
            } = await supabase.auth.getUser();
            if (userError) {
              return {success: false, avatarUrl: '', error: userError.message};
            }
            if (!user) {
              return {success: false, avatarUrl: '', error: 'User not found'};
            }

            const blob = new Blob([svgString], {type: 'image/svg+xml'});
            const file = new File([blob], 'avatar.svg', {type: 'image/svg+xml'});

            const {data, error: uploadError} = await supabase.storage
              .from('avatars')
              .upload(`avatar-${user.id}.svg`, file, {
                contentType: 'image/svg+xml',
                cacheControl: '8600',
                upsert: true,
              });

            if (data) {
              const {error: profileError} = await supabase
                .from('profiles')
                .update({avatar_url: data.path})
                .eq('id', user.id);

              if (profileError) throw profileError;

              await supabase.auth.updateUser({
                data: {
                  avatar_url: data.path,
                },
              });

              return {success: true, avatarUrl: data.path};
            } else {
              return {success: false, avatarUrl: '', error: uploadError?.message};
            }
          },
        };
      },
      {name: 'UserStore'},
    ),
  ),
);
