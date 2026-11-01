const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'Grinfinder (Dev)' : 'Grinfinder',
    slug: 'smile-seeker',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV
        ? 'com.kathleenlister.grinfinder.dev'
        : 'com.kathleenlister.grinfinder',
      infoPlist: { ITSAppUsesNonExemptEncryption: false },
    },
    plugins: ['expo-dev-client'],
    extra: { eas: { projectId: '3f9fcb0c-3688-49e1-8683-45b4d54cda15' } },
  },
};
