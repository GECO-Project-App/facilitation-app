import {ProfileStats} from '@/components';

export default async function TeamMemberPage({params: {id}}: {params: {id: string}}) {
  console.log(id);
  return <ProfileStats />;
}
