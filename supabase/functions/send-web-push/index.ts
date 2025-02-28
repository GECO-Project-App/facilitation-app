import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push'

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  Deno.env.get('VAPID_PUBLIC_KEY') || '',
  Deno.env.get('VAPID_PRIVATE_KEY') || ''
)

Deno.serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    )

    // Parse the request body
    const { user_id, notification_id, type, data } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get the user's push subscription from the database
    const { data: subscriptionData, error: subscriptionError } = await supabaseClient
      .from('web_push_subscriptions')
      .select('subscription')
      .eq('user_id', user_id)
      .maybeSingle()

    if (subscriptionError || !subscriptionData?.subscription) {
      console.error('No subscription found for user:', user_id)
      return new Response(
        JSON.stringify({ error: 'No subscription found for this user' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const subscription = subscriptionData.subscription

    // Format notification based on type
    let notification
    if (type === 'team_invitation') {
      notification = {
        title: `Invitation to join ${data.team_name}`,
        body: `${data.inviter_name} has invited you to join their team`,
        icon: '/team-icon.png',
        data: {
          url: `/notifications`
        }
      }
    } else if (type === 'exercise_status_change') {
      notification = {
        title: `Exercise Status Update`,
        body: `An exercise with ${data.team_name} is now ${data.new_status}`,
        icon: '/exercise-icon.png',
        data: {
          url: `/exercises/${data.slug}?id=${data.exercise_id}`
        }
      }
    } else if (type === 'new_exercise') {
      // Add handler for new exercise notifications
      notification = {
        title: `New Exercise in ${data.team_name}`,
        body: `A new exercise has been created in your team`,
        icon: '/exercise-icon.png',
        data: {
          url: `/exercises/${data.slug}?id=${data.exercise_id}`
        }
      }
    } else if (type === 'upcoming_deadline') {
      // Add handler for upcoming deadline notifications
      const deadlineType = data.deadline_type === 'writing' ? 'writing' : 'reviewing'
      const formattedDate = new Date(data.deadline_time).toLocaleString()
      
      notification = {
        title: `Upcoming Deadline`,
        body: `The ${deadlineType} deadline for an exercise in ${data.team_name} is approaching (${formattedDate})`,
        icon: '/deadline-icon.png',
        data: {
          url: `/exercises/${data.slug}?id=${data.exercise_id}`
        }
      }
    } else {
      // Generic notification (keep this as fallback)
      notification = {
        title: data.title || 'New Notification',
        body: data.body || 'You have a new notification',
        icon: data.icon || '/notification-icon.png',
        data: {
          url: data.url || `/notifications/${notification_id}`
        }
      }
    }

    // Create the payload - THIS WAS MISSING
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon,
      data: notification.data
    })

    // Send the notification
    await webpush.sendNotification(subscription, payload)

    // If notification_id is provided, mark it as sent
    if (notification_id) {
      // Check if notification has already been sent
      const { data: notificationData } = await supabaseClient
        .from('notifications')
        .select('push_sent')
        .eq('id', notification_id)
        .single();
      
      if (notificationData?.push_sent) {
        return new Response(
          JSON.stringify({ message: 'Notification already sent' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Mark as sent before sending to prevent race conditions
      await supabaseClient
        .from('notifications')
        .update({ push_sent: true })
        .eq('id', notification_id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending push notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})