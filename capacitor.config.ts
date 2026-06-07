import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.agape.biblechurch",
  appName: "Agape Bible Church",
  webDir: "public",
  server: {
    url: "https://agape-church-app-9r94.vercel.app",
    cleartext: false,
  },
};

export default config;