import {sendNotification} from '@/lib/providers/notifications/NotificationSender';
import {NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
  const {subscription, title, message, data} = await req.json();
  await sendNotification(subscription, title, message, data);
  return new Response(JSON.stringify({message: 'Push sent.'}), {});
}
