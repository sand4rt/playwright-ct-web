import { test, expect } from '@sand4rt/experimental-ct-web';
import { DefaultSlot } from '@/components/DefaultSlot';
import { NamedSlots } from '@/components/NamedSlots';

test('render a default slot', async ({ mount }) => {
  const component = await mount(DefaultSlot, {
    slots: {
      default: '<strong>Main Content</strong>',
    },
  });
  await expect(component.getByRole('strong')).toContainText('Main Content');
});

test('render a component as slot', async ({ mount }) => {
  const component = await mount(DefaultSlot, {
    slots: {
      default: '<pw-button title="Submit" />', // component is registered globally in /playwright/index.ts
    },
  });
  await expect(component).toContainText('Submit');
});

test('render a component with multiple slots', async ({ mount }) => {
  const component = await mount(DefaultSlot, {
    slots: {
      default: [
        '<div data-testid="one">One</div>',
        '<div data-testid="two">Two</div>',
      ],
    },
  });
  await expect(component.getByTestId('one')).toContainText('One');
  await expect(component.getByTestId('two')).toContainText('Two');
});

test('render a component with a named slots', async ({ mount }) => {
  const component = await mount(NamedSlots, {
    slots: {
      header: '<div slot="header">Header<div>', // slot="" is optional
      main: '<div>Main Content<div>',
      footer: '<div>Footer</div>',
    },
  });
  await expect(component).toContainText('Header');
  await expect(component).toContainText('Main Content');
  await expect(component).toContainText('Footer');
});

test('render number as slot', async ({ mount }) => {
  const component = await mount(DefaultSlot, {
    slots: {
      default: 1337,
    },
  });
  await expect(component).toContainText('1337');
});

test('render array of numbers as slot', async ({ mount }) => {
  const component = await mount(DefaultSlot, {
    slots: {
      default: [4,2],
    },
  });
  await expect(component).toContainText('42');
});
