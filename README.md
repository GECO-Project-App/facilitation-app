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
You can set this up in the Supabase Dashboard:
Go to your Supabase project dashboard
Navigate to Database → Webhooks
Click "Create a new webhook"
Configure the webhook:
Name: notification_push_webhook
Table: notifications
Events: Select INSERT and UPDATE (to catch both new notifications and when they're marked as push_eligible)
HTTP Method: POST
URL: Your Edge Function URL: https://your-project-ref.supabase.co/functions/v1/send-web-push
Headers: Add the Authorization header with your service role key:
Authorization
Filter: Add a condition to only trigger for push-eligible notifications:


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
