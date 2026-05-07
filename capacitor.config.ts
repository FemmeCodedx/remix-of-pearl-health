import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2888f9cd7a0a4c6cab4f666ed29728dd',
  appName: 'Pearl Femme',
  webDir: 'dist',
  server: {
    url: 'https://2888f9cd-7a0a-4c6c-ab4f-666ed29728dd.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFF7F0',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
