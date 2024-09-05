import type {Meta, StoryObj} from '@storybook/react';
import {action} from '@storybook/addon-actions';
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
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      description: 'Button sizes',
      options: ['default', 'sm', 'lg', 'icon'],
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
    asChild: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultButton: Story = {
  args: {
    variant: 'default',
    size: 'lg',
    disabled: false,
    onClick: action('default click'),
    children: 'Default Button',
    asChild: false,
    className: '',
  },
};

export const SecondaryButton: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    disabled: false,
    onClick: action('secondary click'),
    children: 'Secondary Button',
    asChild: false,
    className: '',
  },
};

export const OutlineButton: Story = {
  args: {
    variant: 'outline',
    size: 'lg',
    disabled: false,
    onClick: action('otline click'),
    children: 'Outline Button',
    asChild: false,
    className: '',
  },
};

export const DestructiveButton: Story = {
  args: {
    variant: 'destructive',
    size: 'lg',
    disabled: false,
    onClick: action('destructive click'),
    children: 'Destructive Button',
    asChild: false,
    className: '',
  },
};

export const GhostButton: Story = {
  args: {
    variant: 'ghost',
    size: 'lg',
    disabled: false,
    onClick: action('Ghost click'),
    children: 'Ghost Button',
    asChild: false,
    className: '',
  },
};

export const LinkButton: Story = {
  args: {
    variant: 'link',
    size: 'lg',
    disabled: false,
    onClick: action('Link click'),
    children: 'Link Button',
    asChild: false,
    className: '',
  },
};
