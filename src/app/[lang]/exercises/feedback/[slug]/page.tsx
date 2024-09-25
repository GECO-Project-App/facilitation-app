'use client'
import React from 'react';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {Button} from '@/components/ui/button';
import Survey from './Survey';

export default function FeedbackFor({params}: {params: {lang: string; slug: string}}) {
  const slug = params.slug;

  const handleSubmit = (value: string | null) => {
    console.log(value);
  };

  return (
    <main className="page-padding flex min-h-screen flex-col items-center justify-evenly bg-yellow">
    {/* <h4 className="text-lg font-semibold">
      Have some thoughts, comments and suggestions about the app? Share your thought with us.
    </h4> */}
    <Survey title={slug === 'ssc' ? 'Start-Stop-Continue Exercise' : ''} onSubmit={handleSubmit} />
  </main>
  )
}
