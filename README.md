# Facilitation App

Welcome to the GECO Project's Facilitation app! This open-source project helps teams establish and maintain productive group dynamics by providing their leaders with a facilitation coach in their pocket.

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [Tech Stack](#tech-stack)
- [Internationalization (i18n)](#internationalization-i18n)
- [Storybook](#storybook)
- [Testing](#testing)
- [License](#license)
- [Background](#background)
- [Philosophy and Purpose](#philosophy-and-purpose)
- [Current working hypothesis](#current-working-hypothesis)

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

- [Storybook](https://storybook.js.org/docs/react/get-started/introduction) - For component development and testing
- [i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization) - For internationalization
- [shadcn/ui](https://ui.shadcn.com/docs) - For UI components
- [Tailwind CSS](https://tailwindcss.com/docs) - For styling

## Internationalization (i18n)

This project supports multiple languages. To add or update translations, see `/app/[lang]/dictionaries/[code].json`.

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

## Background

The project is funded by Energimyndigheten and includes project partners from Energicentrum Gotland and sustainability researchers from UU.
The project application promised a design-thinking double diamond approach (discover, define, develop, deliver). Our goal is to help rural communities start and operate energy communities more effectively.
An energy community is a group of people working together to accomplish an energy project. An energy project can be anything from organizing car-pooling for trips to town, equipment sharing in the local, rural, community, to communally building and operating a solar park.

So far, we have:

- conducted close to 20 interviews with members of rural communities on Gotland,
- created a literature review of research into the challenges that rural communities face when creating energy communities,
- ran a one-day innovation day (hackathong/game jam) with sustainability students,
- 4 teams worked for 6-8 weeks on building prototypes for a different problem case.

## Philosophy and Purpose

The inspiration behind the project was Malcolm Gladwell's concept of "capitalization rate": What factors in a societal system influence (positively or negatively) the rate at which that society capitalizes on the talent within it. For example: In Kenya, over 80% of teenagers age 16 years old run 10 miles or more each day. No wonder they have extremely strong runners competing at the olympic games compared to a country like Sweden, where we don't "sample" nearly as many members of society when it comes to their ability to run.

The philosophy behind the project is that we can identify a challenge that rural communities face which, by building a product, we can ease to the extent that the capitalization rate of rural communities starting and operating energy communities increases.

Through our research we have found that establishing and maintaining productive group dynamics is such a challenge. Of course, there are other challenges (regulatory complexities, effective community engagement, and accessible and maintained community spaces to name a few), but we believe that enabling communities to collaborate more effectively, empowers them to solve many of these challenges independently.

## Current working hypothesis

In the spirit of the Lean Startup (a book by Eric Ries), our job is to form hypothesis of how we can be valuable to potential users, build MVPs and get users to use them to test our hypothesis.
The current working hypothesis we are testing is:

- The vast majority of teams either lack an educated or experienced facilitator or the person in charge of facilitating has other duties in the team and can't dedicate the time and energy required to effectively facilitate team activities
- Such users would benefit from having an app that coaches them through effective facilitation methods ahead of and during team activities
- There is a small number of facilitations (exercises) that, if implemented correctly and used regularly, create a benefit for the team's group dynamics and productivity.
