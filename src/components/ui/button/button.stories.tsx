import {action} from '@storybook/addon-actions';
import type {Meta, StoryObj} from '@storybook/react';
import {Button} from './button';

const meta: Meta<typeof Button> = {
  title: 'components/ui/button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      description: 'Button variants',
      options: ['green', 'blue', 'yellow', 'red', 'orange', 'purple'],
    },
    size: {
      control: 'select',
      description: 'Button sizes',
      options: ['default', 'icon', 'circle'],
    },
    disabled: {
      control: 'boolean',
      description: 'Button disabled state',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called when button is clicked',
    },
    children: {
      control: 'text',
      description: 'Content displayed inside button ',
    },
    className: {
      control: 'text',
      description: 'Custom tailwind classes applied to button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pink: Story = {
  args: {
    variant: 'pink',
    disabled: false,
    onClick: action('default click'),
    children: 'Check in',

    className: '',
  },
};

export const Green: Story = {
  args: {
    variant: 'green',

    disabled: false,
    onClick: action('default click'),
    children: 'Check out',
    className: '',
  },
};
export const Blue: Story = {
  args: {
    variant: 'blue',
    disabled: false,
    onClick: action('default click'),
    children: 'Pass it on',
    className: '',
  },
};

export const Yellow: Story = {
  args: {
    variant: 'yellow',
    disabled: false,
    onClick: action('default click'),
    children: 'Start',
    className: '',
  },
};

export const Purple: Story = {
  args: {
    variant: 'purple',
    disabled: false,
    onClick: action('default click'),
    children: 'Purple',
    className: '',
  },
};

export const Red: Story = {
  args: {
    variant: 'red',
    disabled: false,
    onClick: action('default click'),
    children: 'Stop',

    className: '',
  },
};
