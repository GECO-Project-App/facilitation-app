# Contributing to The GECO Project Facilitation App

We appreciate your interest in contributing to our project! Here are some guidelines to help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/project-name.git`
3. Create a new branch: `git checkout -b feature/your-new-feature`

## Development Environment

To set up the development environment, follow these steps:

1. Install dependencies:

```
 npm install
```

2. Start the development server:

```
 npm run dev
```

3. Wait until the app has started. You will see a message indicating that the app is running on a local address (usually http://localhost:3000).

## Coding Standards

- Follow TypeScript best practices
- Use ESLint to ensure code quality
- Format your code with Prettier

## Submitting Changes

1. Commit your changes: `git commit -m 'Add some feature'`
2. Push to the branch: `git push origin feature/your-new-feature`
3. Open a pull request against the `main` branch

## Reporting Bugs

- Use GitHub Issues to report bugs
- Include as much information as possible: steps to reproduce, expected vs. actual behavior, etc.

## Suggesting Improvements

- Open an issue with the "enhancement" tag for improvement suggestions
- Discuss the idea with maintainers before starting work on it

## Style Guide

- Follow existing code style in the project
- Use meaningful variable and function names
- Comment complex logic

## Internationalization (i18n)

- Use the next-intl system for all user-facing text
- Add new translations in the respective language file: /messages/[lang].json
- Use the `useTranslations` hook or the `<Trans>` component for translations in your React components
- See https://next-intl-docs.vercel.app/ for more information on how to use next-intl
- Setup according to next.js app router docs https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing

## Storybook

- Create stories for new components
- Update existing stories when modifying components

#### Starting Storybook

To start Storybook, follow these steps:

1. Open a terminal in the project's root folder.
2. Run the following command:
   ```
   npm run storybook
   ```
3. Wait until Storybook has started. You will see a message indicating that Storybook is running on a local address (usually http://localhost:6006).
4. Open the specified address in your web browser to view the Storybook interface.

## Supabase Development

### Setting Up Supabase CLI

1. Install the Supabase CLI according to the [docs](https://supabase.com/docs/guides/local-development/cli/getting-started)

2. Make sure to initialize Supabase in your project:
```bash
npx supabase init
```

### Local Development
Check out the [docs](https://supabase.com/docs/reference/cli) for more useful CLI commands.


1. Start the local Supabase db. (Make sure docker is running before starting the db)
```bash
npx supabase start
```
You will see a message indicating that the local Supabase db is running on a local address (usually http://127.0.0.1:54321). 

Make sure to replace the .env variables with the correct values for your local db.
`
NEXT_PUBLIC_SUPABASE_URL=API URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon key`


2. Link your supabase project to your local db. This command is **not** available for a self-hosted supabase db.

```bash
npx supabase link --project-ref your-project-ref
```


#### Database Migrations
See the [docs](https://supabase.com/docs/reference/cli/supabase-db-pull) for more information on how to create and apply migrations.

1. Create a new migration containing the changes from the remote db:
```bash
npx  supabase db pull
```

A self-hosted supabase db can pull changes from a remote db by using the --db-url flag and the database url:

```bash
npx supabase db diff -f initial_structure --db-url postgresql://your-db-url 
```

2. Apply migrations to your local db:
```bash
npx supabase db reset
```

#### Deployment

1. If you're using the SQL-Editor in Supabase studio to create new migrations, you will need to pull the migration files into your project:
```bash
npx supabase db pull --local
```

2. Push local database changes to production:
```bash
npx supabase db push
```

**Note:** Always test migrations locally before applying them to production.


#### Testing emails
Emails will not be sent when testing on a local db. They will instead be monitored in a inbucket that can be accessed through the Inbucket URL that's provided when you run `npx supabase status`

