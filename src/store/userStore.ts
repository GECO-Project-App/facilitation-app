import {ShapeColors} from '@/lib/constants';
import {supabase} from '@/lib/supabase/supabaseClient';
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
      setUser: (user) => set({user}),

      signOut: async () => {
        await supabase.auth.signOut();
        set({user: null});
      },
    }),
    {name: 'UserStore'},
  ),
);

supabase.auth.onAuthStateChange((_event, session) => {
  useUserStore.getState().setUser(session?.user ?? null);
});
