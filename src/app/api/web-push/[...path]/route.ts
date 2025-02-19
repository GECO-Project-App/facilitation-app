import type {PushSubscription} from 'web-push';
import webpush from 'web-push';

let subscription: PushSubscription;

export async function POST(request: Request) {
  webpush.setVapidDetails(
    'mailto:mail@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string,
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

  if (!body.subscription || !body.subscription.endpoint) {
    return new Response(JSON.stringify({error: 'Invalid subscription object'}), {
      status: 400,
      headers: {'Content-Type': 'application/json'},
    });
  }

  const pushPayload = {
    title: body.title,
    body: body.body,
    image: body.image,
    icon: body.icon,
    url: body.url,
  };

  try {
    await webpush.sendNotification(body.subscription, JSON.stringify(pushPayload));

    return new Response(JSON.stringify({message: 'Push sent successfully'}), {
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error('Push notification error:', error);
    return new Response(JSON.stringify({error: 'Failed to send push notification'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}

async function notFoundApi() {
  return new Response(JSON.stringify({error: 'Invalid endpoint'}), {
    headers: {'Content-Type': 'application/json'},
    status: 404,
  });
}
