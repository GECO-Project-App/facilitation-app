import {ShapeColors} from '@/lib/constants';
import {createClient} from '@/lib/supabase/client';
import {User} from '@supabase/supabase-js';
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

interface UserState {
  user: User | null;
  avatar: {
    color: string;
    shape: number;
  };
  setAvatar: (avatar: {color: string; shape: number}) => void;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      avatar: {
        color: ShapeColors.Green,
        shape: 0,
      },
      setAvatar: (avatar) => set({avatar}),
      setUser: () =>
        createClient().auth.onAuthStateChange((_event, session) => {
          console.log('session', session);
          set({user: session?.user ?? null});
        }),

      signOut: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({user: null});
      },
    }),
    {name: 'UserStore'},
  ),
);
