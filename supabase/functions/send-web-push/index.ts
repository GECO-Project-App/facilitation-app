import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'npm:web-push';

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const payload = await req.json()
    
    // Get the user ID and notification data from the webhook payload
    const { user_id, type, data } = payload
    
    // Fetch all web push subscriptions for this user
    const { data: subscriptions, error } = await supabase
      .from('web_push_subscriptions')
      .select('subscription')
      .eq('user_id', user_id)
    
    if (error) throw error
    
    // Send push notification to each subscription
    for (const sub of subscriptions) {
      await sendPushNotification(sub.subscription, {
        type,
        notification: data
      })
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

async function sendPushNotification(subscription, payload) {
  // Your push notification sending logic here
  // This would use the web-push library or similar
}

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
);

const notificationContent = getNotificationContent(payload.type, payload.notification);

async function sendNotification(subscription, payload) {
  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      ...notificationContent,
      data: {
        url: payload.notification.slug ? `/exercise/${payload.notification.slug}` : '/',
      },
    })
  );
}

