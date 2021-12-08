import { UserConfigFn } from 'vite';
import { overrideVaadinConfig } from './vite.generated';
import react from '@vitejs/plugin-react';

const customConfig: UserConfigFn = (env) => ({
  // Here you can add custom Vite parameters
  // https://vitejs.dev/config/
  plugins: [react()],
});

export default overrideVaadinConfig(customConfig);
