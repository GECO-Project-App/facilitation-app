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

    // Get emails for each team member
    const membersWithEmails = await Promise.all(
      teamMembers.map(async (member) => {
        const { data: email } = await supabaseClient
          .rpc('get_user_email', { user_id: member.user_id });
        return { ...member, email };
      })
    );

    // Send email to each team member
    const emailPromises = membersWithEmails.map(async (member) => {
      if (!member.email) return;

      return fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`
        },
        body: JSON.stringify({
          from: 'GECO Team <support@info.projectgeco.com>',
          to: member.email,
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
    });

    await Promise.all(emailPromises);

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