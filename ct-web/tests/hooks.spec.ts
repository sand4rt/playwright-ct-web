import { expect, test } from '@sand4rt/experimental-ct-web';
import { Button } from '@/components/Button';
import type { HooksConfig } from 'playwright';
import { CustomizableTagName } from '@/components/CustomizableTagName';

test('run hooks', async ({ page, mount }) => {
  const messages: string[] = [];
  page.on('console', (m) => messages.push(m.text()));
  await mount<HooksConfig>(Button, {
    props: {
      title: 'Submit',
    },
    hooksConfig: { route: 'A' },
  });
  expect(messages).toEqual([
    'Before mount: {"route":"A"}',
    'After mount',
  ]);
});

test('allow customizing the mount function', async ({ mount }) => {
  const component = await mount(CustomizableTagName);
  const tagName = await component.evaluate(el => el.tagName);
  expect(tagName).toEqual('MY-PREFIXED-CUSTOMIZABLE-TAG-NAME-COMPONENT');
});
