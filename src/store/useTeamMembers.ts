import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

interface MemberType {
  nickname: string;
  id: string;
  avatar: string;
}

interface TeamMembersstate {
  members: MemberType[];
  addMember: (member: MemberType) => void;
}

export const useTeamMembers = create<TeamMembersstate>()(
  devtools(
    (set) => ({
      members: [],
      addMember: (member) => set((state) => ({members: [...state.members, member]})),
    }),
    {name: 'TeamMembersStore'},
  ),
);
