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
  setLocalAvatar: (avatar: {color: string; shape: number}) => void;
  setUser: (user: User, session?: Session) => void;
  avatarUrl: string | null;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
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
          const supabase = createClient();

          // Get initial session
          const {
            data: {session},
          } = await supabase.auth.getSession();
          set({
            user: session?.user ?? null,
            session: session ?? null,
            isLoading: false,
            initialized: true,
          });

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              user: session?.user ?? null,
              session: session ?? null,
            });
          });
        },

        signOut: async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          set({user: null});
        },

        updateAvatar: async (svgString: string) => {
          const supabase = createClient();

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
              cacheControl: '3600',
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
      }),
      {name: 'UserStore'},
    ),
  ),
);
