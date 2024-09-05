import type {Meta, StoryObj} from '@storybook/react';
import {Timer} from './Timer';

const meta: Meta<typeof Timer> = {
  title: 'components/timer',
  component: Timer,
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
