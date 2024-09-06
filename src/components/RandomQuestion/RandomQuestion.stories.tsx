import type {Meta, StoryObj} from '@storybook/react';
import {RandomQuestion} from './RandomQuestion';

const meta: Meta<typeof RandomQuestion> = {
  title: 'components/random-question',
  component: RandomQuestion,
  argTypes: {
    seconds: {
      control: 'number',
      description: 'Seconds to countdown',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTimer: Story = {
  args: {
    seconds: 60,
  },
};
