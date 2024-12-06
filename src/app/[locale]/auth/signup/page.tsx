'use client';
import {SignUpForm} from '@/components/forms';
import {useSearchParams} from 'next/navigation';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const invitation = searchParams.get('invitation');
  const email = searchParams.get('email');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SignUpForm defaultEmail={email} invitationId={invitation} />
    </div>
  );
}
