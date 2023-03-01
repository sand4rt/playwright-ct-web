import { beforeMount, afterMount } from '@sand4rt/experimental-ct-web/hooks';
import '@/assets/index.css';
import '@/components/Button';

export type HooksConfig = {
  route: string;
}

beforeMount<HooksConfig>(async ({ hooksConfig }) => {
  console.log(`Before mount: ${JSON.stringify(hooksConfig)}`);
});
  
afterMount<HooksConfig>(async () => {
  console.log(`After mount`);
});
