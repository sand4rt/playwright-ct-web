import { expect, test } from '@sand4rt/experimental-ct-web';
import { CustomizableTagName } from '@/components/CustomizableTagName';

test('allows customizing the mount function', async ({ mount }) => {
  const component = await mount(CustomizableTagName);
  const tagName = await component.evaluate(el => el.tagName);
  expect(tagName).toEqual('MY-PREFIXED-CUSTOMIZABLE-TAG-NAME-COMPONENT');
});
