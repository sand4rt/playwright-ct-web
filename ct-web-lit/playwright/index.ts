import { beforeMount, afterMount } from '@sand4rt/experimental-ct-web/hooks';
import '@/assets/index.css';
import '@/components/Button';

export type HooksConfig = {
  route: string;
}

beforeMount<HooksConfig, { register?: (prefix: string) => void }>(async ({ hooksConfig, App }) => {
  console.log(`Before mount: ${JSON.stringify(hooksConfig)}`);
  App.register?.call(null, 'my-prefixed-');
});

afterMount<HooksConfig>(async () => {
  console.log(`After mount`);
});
