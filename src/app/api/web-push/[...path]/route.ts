import webpush from 'web-push';

type WebPushSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

let subscription: WebPushSubscription;

export async function POST(request: Request) {
  webpush.setVapidDetails(
    'mailto: <aanglesjo@gmail.com>',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!,
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
  const body: {subscription: WebPushSubscription} = await request.json();
  subscription = body.subscription;
  return new Response(JSON.stringify({message: 'Subscription set.'}), {});
}

async function sendPush(request: Request) {
  console.log(subscription, 'subs');
  const body = await request.json();
  const pushPayload = JSON.stringify(body);
  await webpush.sendNotification(subscription, pushPayload);
  return new Response(JSON.stringify({message: 'Push sent.'}), {});
}

async function notFoundApi() {
  return new Response(JSON.stringify({error: 'Invalid endpoint'}), {
    headers: {'Content-Type': 'application/json'},
    status: 404,
  });
}
