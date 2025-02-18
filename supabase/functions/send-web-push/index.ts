import webpush from 'web-push';

interface WebPushPayload {
  subscription: webpush.PushSubscription;
  notification: {
    team_name?: string;
    exercise_id?: string;
    inviter_name?: string;
    deadline_type?: string;
    deadline_time?: string;
    slug?: string;
  };
  type: 'team_invitation' | 'exercise_status_change' | 'new_exercise' | 'upcoming_deadline';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNotificationContent = (type: string, data: any) => {
  switch (type) {
    case 'team_invitation':
      return {
        title: 'New Team Invitation',
        body: `${data.inviter_name} invited you to join ${data.team_name}`,
      };
    case 'exercise_status_change':
      return {
        title: 'Exercise Status Updated',
        body: `Exercise in ${data.team_name} has moved to ${data.new_status}`,
      };
    case 'new_exercise':
      return {
        title: 'New Exercise',
        body: `A new exercise has been created in ${data.team_name}`,
      };
    case 'upcoming_deadline':
      return {
        title: 'Upcoming Deadline',
        body: `${data.deadline_type} deadline for ${data.team_name} is approaching`,
      };
    default:
      return {
        title: 'New Notification',
        body: 'You have a new notification',
      };
  }
};

Deno.serve(async (req) => {
  try {
    const { subscription, notification, type } = await req.json() as WebPushPayload;

    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!
    );

    const notificationContent = getNotificationContent(type, notification);
    
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        ...notificationContent,
        data: {
          url: notification.slug ? `/exercise/${notification.slug}` : '/',
        },
      })
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Push notification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}); 