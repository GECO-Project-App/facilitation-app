import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { exerciseId } = await req.json();
    
    // Get exercise details with team and creator info
    const { data: exercise, error: exerciseError } = await supabaseClient
      .from('exercises')
      .select(`
        *,
        teams:team_id (name),
        created_by_user:created_by (first_name, last_name)
      `)
      .eq('id', exerciseId)
      .single();

    if (exerciseError || !exercise) {
      throw new Error('Exercise not found');
    }

    // Get all team members with their emails
    const { data: teamMembers, error: membersError } = await supabaseClient
      .from('team_members')
      .select(`
        user_id,
        profile_name
      `)
      .eq('team_id', exercise.team_id);

    if (membersError) throw membersError;

    // Process each team member
    for (const member of teamMembers) {
      // Get email for the team member
      const { data: email } = await supabaseClient
        .rpc('get_user_email', { user_id: member.user_id });
      
      // Get user's email preferences
      const { data: userProfile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('email_preferences')
        .eq('id', member.user_id)
        .single();
      
      // Check if user has opted out of emails or specifically exercise status change emails
      let shouldSendEmail = true;
      if (!profileError && userProfile && userProfile.email_preferences) {
        const emailPreferences = userProfile.email_preferences;
        const emailEnabled = emailPreferences?.email_enabled === true;
        const exerciseStatusChangeEnabled = emailPreferences?.notifications?.exercise_status_change === true;
        
        shouldSendEmail = emailEnabled && exerciseStatusChangeEnabled;
      }
      
      // 1. Send email notification if user hasn't opted out
      if (email && shouldSendEmail) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`
          },
          body: JSON.stringify({
            from: 'GECO Team <support@info.projectgeco.com>',
            to: email,
            subject: `A new exercise is ready for review`,
            html: `
              <p>Hello ${member.profile_name},</p>
              <p>All team members in ${exercise.teams.name} have submitted their answers.</p>
              <p>You can now review your team members' submissions.</p>
              <p>Click the link below to start reviewing:</p>
              <a href="${Deno.env.get('APP_URL')}/exercises/${exercise.slug}?id=${exercise.id}&status=reviewing">
                Start Reviewing
              </a>
            `
          })
        });
      }
      
      // 2. Send web push notification
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-web-push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          user_id: member.user_id,
          type: 'exercise_status_change',
          data: {
            exercise_id: exercise.id,
            exercise_title: exercise.title || exercise.slug,
            team_name: exercise.teams.name,
            new_status: exercise.status,
            slug: exercise.slug,
            url: `${Deno.env.get('APP_URL')}/exercises/${exercise.slug}?id=${exercise.id}&status=reviewing`
          }
        })
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});