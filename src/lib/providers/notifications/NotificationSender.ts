import webpush, {PushSubscription} from 'web-push';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '',
  process.env.VAPID_PRIVATE_KEY ?? '',
);

export const sendNotification = async (
  subscription: PushSubscription,
  title: string,
  message: string,
  data: {url: string},
) => {
  const pushPayload = {
    title: title,
    body: message,
    data: data,
    badge: '/logo.svg',
  };

  webpush
    .sendNotification(subscription, JSON.stringify(pushPayload))
    .then(() => {
      console.info('Notification sent');
    })
    .catch((error) => {
      console.error('Error sending notification', error);
    });
};
