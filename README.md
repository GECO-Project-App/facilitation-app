# Facilitation App

Welcome to the GECO Project's Facilitation app! This open-source project helps teams establish and maintain productive group dynamics by providing their leaders with a facilitation coach in their pocket.

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [Tech Stack](#tech-stack)
- [next-intl (i18n)](#next-intl)
- [Storybook](#storybook)
- [Testing](#testing)
- [License](#license)
- [Background](#background)

## Getting Started

To get started with [Project Name], follow these steps:

1. Clone the repo: `git clone https://github.com/GECO-Project-App/facilitation-app.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Usage

[Describe how to use the project, including any configurations or commands]

## Contributing

We welcome contributions from everyone! See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on how to contribute to the project.

## Tech Stack

Our project uses the following technologies:

- [Next.js](https://nextjs.org/docs) - React framework for building web applications
- [React](https://reactjs.org/docs/getting-started.html) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/docs/) - Typed superset of JavaScript
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction) - For component development and testing
- [next-intl](https://next-intl-docs.vercel.app/) - For internationalization
- [Tailwind CSS](https://tailwindcss.com/docs) - For styling
- [Lucide React](https://lucide.dev/guide/packages/lucide-react) - For icons
- [Supabase](https://supabase.com/docs) - Open source Firebase alternative

## Supabase Integration

Key Supabase documentation:
- [Supabase CLI](https://supabase.com/docs/reference/cli/supabase-db-diff)
- [Local development](https://supabase.com/docs/guides/local-development/overview)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript Types](https://supabase.com/docs/guides/api/rest/generating-types)
- [Server-side auth](https://supabase.com/docs/guides/auth/server-side/nextjs)

#### Supabase webhooks
Set up database triggers using your own db values!

Replace your-project-ref.supabase.co with your actual Supabase project URL
Replace your-service-role-key with your actual Supabase service role key.

```properties
-- 1. First, make sure the http extension is enabled
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- 2. Create webhook for exercise status changes
CREATE OR REPLACE FUNCTION public.exercise_status_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only trigger when status changes from 'writing' to 'reviewing'
  IF (OLD.status = 'writing' AND NEW.status = 'reviewing') THEN
    PERFORM
      net.http_post(
        url := 'https://your-project-ref.supabase.co/functions/v1/notify-exercise-status',
        headers := jsonb_build_object(
          'Authorization', 'Bearer your-service-role-key',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object('exerciseId', NEW.id)
      );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in exercise_status_webhook: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger for exercise status changes
DROP TRIGGER IF EXISTS exercise_status_webhook_trigger ON public.exercises;
CREATE TRIGGER exercise_status_webhook_trigger
  AFTER UPDATE OF status ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION public.exercise_status_webhook();

-- 3. Create webhook for push notifications
CREATE OR REPLACE FUNCTION public.notification_push_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only trigger when push_eligible is true
  IF (NEW.push_eligible = true) THEN
    PERFORM
      net.http_post(
        url := 'https://your-project-ref.supabase.co/functions/v1/send-web-push',
        headers := jsonb_build_object(
          'Authorization', 'Bearer your-service-role-key',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'user_id', NEW.user_id,
          'notification_id', NEW.id,
          'type', NEW.type,
          'data', NEW.data
        )
      );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in notification_push_webhook: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger for push notifications (INSERT)
DROP TRIGGER IF EXISTS notification_push_insert_trigger ON public.notifications;
CREATE TRIGGER notification_push_insert_trigger
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.notification_push_webhook();

-- Create trigger for push notifications (UPDATE)
DROP TRIGGER IF EXISTS notification_push_update_trigger ON public.notifications;
CREATE TRIGGER notification_push_update_trigger
  AFTER UPDATE OF push_eligible ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.notification_push_webhook();

-- 4. Create webhook for team invitations
CREATE OR REPLACE FUNCTION public.team_invitation_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_team_name TEXT;
  v_inviter_name TEXT;
BEGIN
  -- Get user ID from email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = NEW.email;
  
  -- Get team name
  SELECT name INTO v_team_name
  FROM teams
  WHERE id = NEW.team_id;
  
  -- Get inviter name
  SELECT first_name || ' ' || last_name INTO v_inviter_name
  FROM profiles
  WHERE id = NEW.invited_by;
  
  -- Only proceed if we found a user
  IF v_user_id IS NOT NULL THEN
    PERFORM
      net.http_post(
        url := 'https://your-project-ref.supabase.co/functions/v1/send-web-push',
        headers := jsonb_build_object(
          'Authorization', 'Bearer your-service-role-key',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'type', 'team_invitation',
          'userId', v_user_id,
          'notification', jsonb_build_object(
            'team_name', v_team_name,
            'inviter_name', v_inviter_name,
            'invitation_id', NEW.id
          )
        )
      );
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in team_invitation_webhook: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger for team invitations
DROP TRIGGER IF EXISTS team_invitation_webhook_trigger ON public.team_invitations;
CREATE TRIGGER team_invitation_webhook_trigger
  AFTER INSERT ON public.team_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.team_invitation_webhook();

-- 5. Update the check_exercise_completion function to use the webhook approach
CREATE OR REPLACE FUNCTION public.check_exercise_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    team_member_count INT;
    submission_count INT;
BEGIN
    -- Get team member count
    SELECT COUNT(*) INTO team_member_count
    FROM team_members tm
    JOIN exercises e ON e.team_id = tm.team_id
    WHERE e.id = NEW.exercise_id;
    
    -- Get submission count
    SELECT COUNT(*) INTO submission_count
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;
    
    IF submission_count >= team_member_count THEN
        UPDATE exercises
        SET status = 'reviewing'
        WHERE id = NEW.exercise_id
        AND status = 'writing';
        
        -- The webhook trigger will handle the notification
        -- No need to call the edge function directly here
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in check_exercise_completion: %', SQLERRM;
    RETURN NEW;
END;
$$;
```  


## Internationalization (i18n)

This project supports multiple languages. To add or update translations, see the `messages` directory.

Available languages:

- Swedish (sv)
- English (en)

## Storybook

We use Storybook to develop and test our components. To start Storybook:

1. Run `npm run storybook`
2. Open http://localhost:6006 in your web browser

## Testing

To run tests:

## License

The project is licensed under AGPLv3. You can read the full license in the LICENSE file.

## About the Project

You can read about the project's background (and much more) in our [Wiki](https://github.com/GECO-Project-App/facilitation-app/wiki).
