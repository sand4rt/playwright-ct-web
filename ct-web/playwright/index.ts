import { beforeMount, afterMount } from '@sand4rt/experimental-ct-web/hooks';
import '@/assets/index.css';
import '@/components/Button';
import { CustomizableTagName } from '@/components/CustomizableTagName';

export type HooksConfig = {
  route: string;
}

beforeMount<HooksConfig, typeof CustomizableTagName>(async ({ hooksConfig, App }) => {
  console.log(`Before mount: ${JSON.stringify(hooksConfig)}`);
  App.register?.call(null, 'my-prefixed-');
});

afterMount<HooksConfig>(async ({ instance }) => {
  console.log(`After mount`);
  console.assert(instance !== undefined, 'Component instance should be defined');
});
