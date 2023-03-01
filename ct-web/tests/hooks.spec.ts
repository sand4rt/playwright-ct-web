import { test, expect } from '@sand4rt/experimental-ct-web';
import { Button } from '@/components/Button';
import type { HooksConfig } from 'playwright';

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
