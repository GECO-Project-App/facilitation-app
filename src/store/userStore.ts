import {updateTeamMemberAvatar} from '@/lib/actions/teamActions';
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
  avatarUrl: string | null;
  signOut: () => Promise<void>;
  updateAvatar: (svgString: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      avatarUrl: null,
      user: null,
      avatar: {
        color: ShapeColors.Green,
        shape: 0,
      },
      setAvatar: (avatar) => set({avatar}),
      setUser: () =>
        createClient().auth.onAuthStateChange((_event, session) => {
          set({user: session?.user ?? null});
        }),

      signOut: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({user: null});
      },

      downloadImage: async (path: string) => {
        const supabase = createClient();

        try {
          const {data, error} = await supabase.storage.from('avatars').download(path);
          if (error) {
            throw error;
          }

          const url = URL.createObjectURL(data);
          set({avatarUrl: url});
        } catch (error) {
          console.log('Error downloading image: ', error);
        }
      },
      updateAvatar: async (svgString: string) => {
        const supabase = createClient();
        const {data: user, error: userError} = await supabase.auth.getUser();
        if (userError) throw userError;
        const avatarUrl = await updateTeamMemberAvatar(svgString);
        if (avatarUrl) {
          const {data: profileData, error: profileError} = await supabase
            .from('profiles')
            .update({avatar_url: avatarUrl})
            .eq('id', user.user.id)
            .select();

          if (profileError) throw profileError;

          console.log('profileData', profileData);
        }
      },
    }),
    {name: 'UserStore'},
  ),
);
