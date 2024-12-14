import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../shadcn/ui/button';
import { OkCancelDialog } from './ok-cancel-dialog';

const meta: Meta<typeof OkCancelDialog> = {
  title: 'Components/OkCancelDialog',
  component: OkCancelDialog,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Trigger element for the dialog',
    },
    title: {
      control: 'text',
      description: 'Title of the dialog',
    },
    description: {
      control: 'text',
      description: 'Description/content of the dialog',
    },
    okText: {
      control: 'text',
      description: 'Custom text for OK button',
    },
    cancelText: {
      control: 'text',
      description: 'Custom text for Cancel button',
    },
    clickHandler: {
      action: 'okClicked',
      description: 'Function called when OK is clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof OkCancelDialog>;

export const Default: Story = {
  args: {
    children: <Button>Open Dialog</Button>,
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed with this action?',
    clickHandler: () => console.log('OK clicked'),
  },
};

export const WithCustomButtonText: Story = {
  args: {
    children: <Button variant="destructive">Delete Item</Button>,
    title: 'Delete Confirmation',
    description: 'This action cannot be undone. Are you sure you want to delete this item?',
    okText: 'Delete',
    cancelText: 'Keep',
    clickHandler: () => console.log('Delete confirmed'),
  },
};

export const WithoutTitle: Story = {
  args: {
    children: <Button variant="outline">Simple Confirmation</Button>,
    description: 'Are you sure you want to continue?',
    clickHandler: () => console.log('Confirmed without title'),
  },
};

export const LongDescription: Story = {
  args: {
    children: <Button>Detailed Confirmation</Button>,
    title: 'Complex Action',
    description:
      'This is a very long description that explains the implications of the action in great detail. It spans multiple lines to demonstrate how the dialog handles longer text content.',
    okText: 'Proceed',
    cancelText: 'Abort',
    clickHandler: () => console.log('Long description action confirmed'),
  },
};
