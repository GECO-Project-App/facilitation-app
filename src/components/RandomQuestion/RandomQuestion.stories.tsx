import type {Meta, StoryObj} from '@storybook/react';
import {RandomQuestion} from './RandomQuestion';
import {ShapeColors} from '@/lib/constants';

const meta: Meta<typeof RandomQuestion> = {
  title: 'components/random-question',
  component: RandomQuestion,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultShape: Story = {
  args: {},
};
