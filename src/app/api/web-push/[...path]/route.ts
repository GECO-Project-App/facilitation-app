import type {PushSubscription} from 'web-push';
import webpush from 'web-push';

let subscription: PushSubscription;

export async function POST(request: Request) {
  webpush.setVapidDetails(
    'mailto:mail@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY as string,
  );

  const {pathname} = new URL(request.url);
  switch (pathname) {
    case '/api/web-push/subscription':
      return setSubscription(request);
    case '/api/web-push/send':
      return sendPush(request);
    default:
      return notFoundApi();
  }
}

async function setSubscription(request: Request) {
  const body = await request.json();
  // Store the raw subscription object without calling toJSON()
  subscription = body.subscription;
  return new Response(JSON.stringify({message: 'Subscription set.'}), {
    headers: {'Content-Type': 'application/json'},
  });
}

async function sendPush(request: Request) {
  const body = await request.json();
  const pushPayload = JSON.stringify(body);

  // Use the subscription object directly with webpush
  await webpush.sendNotification(subscription as PushSubscription, pushPayload);

  return new Response(JSON.stringify({message: 'Push sent.'}), {
    headers: {'Content-Type': 'application/json'},
  });
}

async function notFoundApi() {
  return new Response(JSON.stringify({error: 'Invalid endpoint'}), {
    headers: {'Content-Type': 'application/json'},
    status: 404,
  });
}
