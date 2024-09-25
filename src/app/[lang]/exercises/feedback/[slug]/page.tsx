import React from 'react';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';


export default function FeedbackFor({params}: {params: {lang: string; slug: string}}) {
  const slug = params.slug;

  return (
    <main className="page-padding flex min-h-screen flex-col items-center justify-evenly bg-yellow">
    <section className="flex w-full flex-row items-center justify-evenly gap-4">
      <Link href={'/exercises/ssc'}>
        <ArrowLeft size={42} />
      </Link>
      <div className="text-xl font-bold">
        {slug === 'ssc' ? <h2>Start-Stop-Continue</h2> : null}
        <h2>Exercise</h2>
      </div>
    </section>
    <h4 className="text-lg font-semibold">
      Have some thoughts, comments and suggestions about the app? Share your thought with us.
    </h4>
    <section className="flex justify-center">
      <Button variant="yellow">Send Us Feedback</Button>
    </section>
  </main>
  )
}
