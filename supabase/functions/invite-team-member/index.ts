import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { teamId, email, language = 'en', authUserId } = await req.json()
    console.log('Received request with:', { teamId, email, language, authUserId });

    if ( !authUserId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check authorization using database function
    const { data: isAuthorized, error: authError } = await supabaseClient.rpc(
      'check_team_management_permission',
      { team_id: teamId, user_id: authUserId }
    )
    console.log('Authorization check:', { isAuthorized, authError });

    if (authError || !isAuthorized) {
      return new Response(
        JSON.stringify({ error: 'Not authorized to invite members' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already exists in either profiles or auth.users
    const { data: existingUser, error: userError } = await supabaseClient
      .rpc('check_user_exists', { 
        email_input: email.toLowerCase() 
      });
    
    console.log('Existing user check:', { existingUser, userError });

    if (userError) {
      console.error('User lookup error:', userError);
      throw userError;
    }

    // Get team info
    const { data: team, error: teamError } = await supabaseClient
      .from('teams')
      .select('name')
      .eq('id', teamId)
      .single();
    
    console.log('Team query:', { team, teamError, teamId });

    if (teamError || !team) {
      console.error('Team error:', teamError);
      return new Response(
        JSON.stringify({ error: 'Team not found', details: teamError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabaseClient
      .from('team_invitations')
      .insert({
        team_id: teamId,
        email: email.toLowerCase(),
        invited_by: authUserId,
        status: existingUser ? 'pending' : 'awaiting_signup'
      })
      .select()
      .single()

    if (inviteError) throw inviteError

    // Replace the Resend SDK call with fetch
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`
      },
      body: JSON.stringify({
        from: 'GECO Team <support@info.projectgeco.com>',
        to: email,
        subject: existingUser ? 
          `You've been invited to join ${team.name}` :
          `You've been invited to join ${team.name} on GECO`,
        html: existingUser ?
          `
            <p>You've been invited to join ${team.name} on GECO.</p>
            <p>Click the link below to accept the invitation:</p>
            <a href="http://localhost:3000/team/join?invitation=${invitation.id}">
              Accept Invitation
            </a>
          ` :
          `<p>You've been invited to join ${team.name} on GECO.</p>
            <p>Since you don't have an account yet, click the link below to sign up:</p>
            <a href="http://localhost:3000/auth/signup?invitation=${invitation.id}&email=${encodeURIComponent(email)}">
              Create Account
            </a>
          `
      })
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.json();
      throw new Error(emailError.message || 'Failed to send email');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


