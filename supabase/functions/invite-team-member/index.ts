import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('NEXT_PUBLIC_SUPABASE_URL') ?? '',
      Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') ?? ''
    )

    const { teamId, email } = await req.json()
    const { data: { user } } = await supabase.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] ?? '')

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check authorization
    const { data: isAuthorized, error: authError } = await supabase.rpc(
      'check_team_management_permission',
      { team_id: teamId, user_id: user.id }
    )

    if (authError || !isAuthorized) {
      return new Response(
        JSON.stringify({ error: 'Not authorized to invite members' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    // Get team info
    const { data: team } = await supabase
      .from('teams')
      .select('name')
      .eq('id', teamId)
      .single()

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .insert({
        team_id: teamId,
        email,
        invited_by: user.id,
        status: existingUser ? 'pending' : 'awaiting_signup'
      })
      .select()
      .single()

    if (inviteError) throw inviteError

    // Different email templates for existing vs new users
    const emailTemplate = existingUser ? {
      subject: `You've been invited to join ${team.name}`,
      html: `
        <p>You've been invited to join ${team.name} on GECO.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${Deno.env.get('NEXT_PUBLIC_URL')}/team/join?invitation=${invitation.id}">
          Accept Invitation
        </a>
      `
    } : {
      subject: `You've been invited to join ${team.name} on GECO`,
      html: `
        <p>You've been invited to join ${team.name} on GECO.</p>
        <p>Since you don't have an account yet, click the link below to sign up:</p>
        <a href="${Deno.env.get('NEXT_PUBLIC_URL')}/auth/signup?invitation=${invitation.id}&email=${encodeURIComponent(email)}">
          Create Account
        </a>
      `
    }

    // Send email using Resend
    const { error: emailError } = await resend.emails.send({
      from: 'GECO Team <support@info.projectgeco.com>',
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    if (emailError) throw emailError

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

