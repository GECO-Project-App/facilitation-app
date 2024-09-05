import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "components/ui/button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      description: "Button variants",
      options: ["checkin", "checkout", "back", "pass"],
    },
    size: {
      control: "select",
      description: "Button sizes",
      options: ["default", "icon"],
    },
    disabled: {
      control: "boolean",
      description: "Button disabled state",
    },
    onClick: {
      action: "clicked",
      description: "Function called when button is clicked",
    },
    children: {
      control: "text",
      description: "Content displayed inside button ",
    },
    className: {
      control: "text",
      description: "Custom tailwind classes applied to button",
    },
    hasShadow: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkin: Story = {
  args: {
    variant: "checkin",
    disabled: false,
    onClick: action("default click"),
    children: "Check in",
    hasShadow: true,
    className: "",
  },
};

export const Checkout: Story = {
  args: {
    variant: "checkout",
    hasShadow: true,
    disabled: false,
    onClick: action("default click"),
    children: "Check out",
    className: "",
  },
};
export const Pass: Story = {
  args: {
    variant: "pass",

    disabled: false,
    onClick: action("default click"),
    children: "Pass it on",
    hasShadow: true,
    className: "",
  },
};

export const Back: Story = {
  args: {
    variant: "back",
    disabled: false,
    onClick: action("default click"),
    children: "Back",
    hasShadow: true,
    className: "",
  },
};
