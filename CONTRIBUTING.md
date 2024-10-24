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

## Questions?

If you have any questions, don't hesitate to open an issue or contact the project maintainers.

Thank you for your contribution!
