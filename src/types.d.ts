declare global {
  interface Window {
    environment: {
      isProd: () => Promise<boolean>;
    };
  }
}
