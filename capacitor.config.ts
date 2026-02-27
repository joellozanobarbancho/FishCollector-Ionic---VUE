import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'fishcollectoridle',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resizeMode: 'none',
      hideFormAccessoryBar: false
    }
  }
};

export default config;
