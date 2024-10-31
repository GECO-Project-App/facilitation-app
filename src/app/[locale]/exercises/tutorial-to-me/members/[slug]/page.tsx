import InviteMembers from '@/components/tutorial-to-me/inv-uninv-members/InviteMembers';
import RemoveMembers from '@/components/tutorial-to-me/inv-uninv-members/RemoveMembers';

const InvAndUninvMembers = ({params}: {params: {slug: string}}) => {
  const {slug} = params;

  if (slug === 'invite') {
    return <InviteMembers />;
  }
  if (slug === 'remove') {
    return <RemoveMembers />;
  }
  return null;
};

export default InvAndUninvMembers;
