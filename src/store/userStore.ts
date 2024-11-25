import {updateTeamMemberAvatar} from '@/lib/actions/teamActions';
import {createClient} from '@/lib/supabase/client';
import {User} from '@supabase/supabase-js';
import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

interface UserState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  avatarUrl: string | null;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  updateAvatar: (
    svgString: string,
  ) => Promise<{success: boolean; avatarUrl: string; error?: string} | undefined>;
  downloadImage: (path: string) => Promise<string | undefined>;
  imageCache: Record<string, string>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        avatarUrl: null,
        user: null,
        isLoading: true,
        initialized: false,
        setUser: (user) => set({user}),
        initialize: async () => {
          const supabase = createClient();

          // Get initial session
          const {
            data: {user},
          } = await supabase.auth.getUser();
          set({user, isLoading: false, initialized: true});

          // Listen for auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            set({user: session?.user ?? null});
          });
        },
        signOut: async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          set({user: null});
        },

        imageCache: {},

        downloadImage: async (path: string) => {
          const supabase = createClient();
          const cache = get().imageCache;

          if (cache[path]) {
            return cache[path];
          }

          try {
            const {data, error} = await supabase.storage
              .from('avatars')
              .download(path + `?t=${new Date().getTime()}`);
            if (error) {
              throw error;
            }

            const url = URL.createObjectURL(data);

            set((state) => ({
              imageCache: {...state.imageCache, [path]: url},
            }));

            return url;
          } catch (error) {
            console.log('Error downloading image: ', error);
            return '';
          }
        },
        updateAvatar: async (svgString: string) => {
          const supabase = createClient();

          const {data: user, error: userError} = await supabase.auth.getUser();
          if (userError) throw userError;

          const {success, url, error} = await updateTeamMemberAvatar(svgString);
          if (success && url) {
            const {error: profileError} = await supabase
              .from('profiles')
              .update({avatar_url: url})
              .eq('id', user.user.id);

            if (profileError) throw profileError;

            await supabase.auth.updateUser({
              data: {
                avatar_url: url,
              },
            });

            set((state) => ({imageCache: {}}));
            get().downloadImage(url);
            return {success: true, avatarUrl: url};
          } else {
            return {success: false, avatarUrl: '', error: error};
          }
        },
      }),
      {name: 'UserStore', partialize: (state) => ({user: state.user})},
    ),
  ),
);
