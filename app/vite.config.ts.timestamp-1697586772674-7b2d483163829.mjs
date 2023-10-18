// vite.config.ts
import react from "file:///home/yusef/Development/extra/hr-system/hr-system-interface/.yarn/__virtual__/@vitejs-plugin-react-virtual-204d9b88c9/5/.yarn/berry/cache/@vitejs-plugin-react-npm-4.0.4-a752ee42a8-10.zip/node_modules/@vitejs/plugin-react/dist/index.mjs";
import envars from "file:///home/yusef/.yarn/berry/cache/envars-npm-0.4.0-eb71c17593-10.zip/node_modules/envars/lib/index.js";
import { resolve } from "node:path";
import { URL } from "node:url";
import { defineProject } from "file:///home/yusef/Development/extra/hr-system/hr-system-interface/.yarn/__virtual__/vitest-virtual-c901295c20/5/.yarn/berry/cache/vitest-npm-0.33.0-420f3c7c44-10.zip/node_modules/vitest/dist/config.js";
var __vite_injected_original_dirname =
  "/home/yusef/Development/extra/hr-system/hr-system-interface/app";
var envNames = ["prod", "test", "local"];
var configs = envNames.map((envName) => {
  const envDir = resolve(__vite_injected_original_dirname, "../env");
  const env = envars.config({ env: envName, cwd: envDir });
  return [
    envName,
    {
      app: {
        env: envName,
        name: env.APP_NAME,
        origin: env.APP_ORIGIN,
        hostname: new URL(env.APP_ORIGIN).hostname,
        api: env.LOCAL_API_ORIGIN ?? env.API_ORIGIN,
      },
      firebase: {
        projectId: env.GOOGLE_CLOUD_PROJECT,
        appId: env.FIREBASE_APP_ID,
        apiKey: env.FIREBASE_API_KEY,
        authDomain: env.FIREBASE_AUTH_DOMAIN,
        measurementId: env.GA_MEASUREMENT_ID,
      },
    },
  ];
});
process.env.VITE_CONFIG = JSON.stringify(Object.fromEntries(configs));
var vite_config_default = defineProject({
  cacheDir: `../.cache/vite-app`,
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/analytics", "firebase/app", "firebase/auth"],
          react: ["react", "react-dom", "react-router-dom", "recoil"],
        },
      },
    },
  },
  plugins: [
    // The default Vite plugin for React projects
    // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: process.env.LOCAL_API_ORIGIN ?? process.env.API_ORIGIN,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          console.log(config.app);
          const config =
            location.hostname === configs[0][1].app.hostname
              ? configs[0][1]
              : location.hostname === configs[1][1].app.hostname
              ? configs[1][1]
              : configs[2][1];
          proxy.on("error", (err) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url,
            );
          });
        },
      },
    },
  },
  test: {
    ...{ cache: { dir: "../.cache/vitest" } },
    environment: "happy-dom",
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS95dXNlZi9EZXZlbG9wbWVudC9leHRyYS9oci1zeXN0ZW0vaHItc3lzdGVtLWludGVyZmFjZS9hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3l1c2VmL0RldmVsb3BtZW50L2V4dHJhL2hyLXN5c3RlbS9oci1zeXN0ZW0taW50ZXJmYWNlL2FwcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS95dXNlZi9EZXZlbG9wbWVudC9leHRyYS9oci1zeXN0ZW0vaHItc3lzdGVtLWludGVyZmFjZS9hcHAvdml0ZS5jb25maWcudHNcIjsvKiBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDE0LXByZXNlbnQgS3JpYXNvZnQgKi9cbi8qIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBNSVQgKi9cblxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGVudmFycyBmcm9tIFwiZW52YXJzXCI7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5pbXBvcnQgeyBkZWZpbmVQcm9qZWN0IH0gZnJvbSBcInZpdGVzdC9jb25maWdcIjtcbmltcG9ydCB7IENvbmZpZywgRW52TmFtZSB9IGZyb20gXCIuL2NvcmUvY29uZmlnLmpzXCI7XG5cbi8vIFRoZSBsaXN0IG9mIHN1cHBvcnRlZCBlbnZpcm9ubWVudHNcbmNvbnN0IGVudk5hbWVzOiBFbnZOYW1lW10gPSBbXCJwcm9kXCIsIFwidGVzdFwiLCBcImxvY2FsXCJdO1xuXG4vLyBCb290c3RyYXAgY2xpZW50LXNpZGUgY29uZmlndXJhdGlvbiBmcm9tIGVudmlyb25tZW50IHZhcmlhYmxlc1xuY29uc3QgY29uZmlncyA9IGVudk5hbWVzLm1hcCgoZW52TmFtZSk6IFtFbnZOYW1lLCBDb25maWddID0+IHtcbiAgY29uc3QgZW52RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vZW52XCIpO1xuICBjb25zdCBlbnYgPSBlbnZhcnMuY29uZmlnKHsgZW52OiBlbnZOYW1lLCBjd2Q6IGVudkRpciB9KTtcbiAgcmV0dXJuIFtcbiAgICBlbnZOYW1lLFxuICAgIHtcbiAgICAgIGFwcDoge1xuICAgICAgICBlbnY6IGVudk5hbWUsXG4gICAgICAgIG5hbWU6IGVudi5BUFBfTkFNRSxcbiAgICAgICAgb3JpZ2luOiBlbnYuQVBQX09SSUdJTixcbiAgICAgICAgaG9zdG5hbWU6IG5ldyBVUkwoZW52LkFQUF9PUklHSU4pLmhvc3RuYW1lLFxuICAgICAgICBhcGk6IGVudi5MT0NBTF9BUElfT1JJR0lOID8/IGVudi5BUElfT1JJR0lOXG4gICAgICB9LFxuICAgICAgZmlyZWJhc2U6IHtcbiAgICAgICAgcHJvamVjdElkOiBlbnYuR09PR0xFX0NMT1VEX1BST0pFQ1QsXG4gICAgICAgIGFwcElkOiBlbnYuRklSRUJBU0VfQVBQX0lELFxuICAgICAgICBhcGlLZXk6IGVudi5GSVJFQkFTRV9BUElfS0VZLFxuICAgICAgICBhdXRoRG9tYWluOiBlbnYuRklSRUJBU0VfQVVUSF9ET01BSU4sXG4gICAgICAgIG1lYXN1cmVtZW50SWQ6IGVudi5HQV9NRUFTVVJFTUVOVF9JRCxcbiAgICAgIH0sXG4gICAgfSxcbiAgXTtcbn0pO1xuXG4vLyBQYXNzIGNsaWVudC1zaWRlIGNvbmZpZ3VyYXRpb24gdG8gdGhlIHdlYiBhcHBcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9ndWlkZS9lbnYtYW5kLW1vZGUuaHRtbCNlbnYtdmFyaWFibGVzLWFuZC1tb2Rlc1xucHJvY2Vzcy5lbnYuVklURV9DT05GSUcgPSBKU09OLnN0cmluZ2lmeShPYmplY3QuZnJvbUVudHJpZXMoY29uZmlncykpO1xuXG4vKipcbiAqIFZpdGUgY29uZmlndXJhdGlvblxuICogaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lUHJvamVjdCh7XG4gIGNhY2hlRGlyOiBgLi4vLmNhY2hlL3ZpdGUtYXBwYCxcblxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICBmaXJlYmFzZTogW1wiZmlyZWJhc2UvYW5hbHl0aWNzXCIsIFwiZmlyZWJhc2UvYXBwXCIsIFwiZmlyZWJhc2UvYXV0aFwiXSxcbiAgICAgICAgICByZWFjdDogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIiwgXCJyZWFjdC1yb3V0ZXItZG9tXCIsIFwicmVjb2lsXCJdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuXG4gIHBsdWdpbnM6IFtcbiAgICAvLyBUaGUgZGVmYXVsdCBWaXRlIHBsdWdpbiBmb3IgUmVhY3QgcHJvamVjdHNcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUtcGx1Z2luLXJlYWN0L2Jsb2IvbWFpbi9wYWNrYWdlcy9wbHVnaW4tcmVhY3QvUkVBRE1FLm1kXG4gICAgcmVhY3Qoe1xuICAgICAganN4SW1wb3J0U291cmNlOiBcIkBlbW90aW9uL3JlYWN0XCIsXG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbXCJAZW1vdGlvbi9iYWJlbC1wbHVnaW5cIl0sXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICBcIi9hcGlcIjoge1xuICAgICAgICB0YXJnZXQ6IHByb2Nlc3MuZW52LkxPQ0FMX0FQSV9PUklHSU4gPz8gcHJvY2Vzcy5lbnYuQVBJX09SSUdJTixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmU6IChwcm94eSwpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhjb25maWcuYXBwKVxuXG4gICAgICAgICAgY29uc3QgY29uZmlnOiBDb25maWcgPSBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gY29uZmlnc1swXVsxXS5hcHAuaG9zdG5hbWVcbiAgICAgICAgICA/IGNvbmZpZ3NbMF1bMV1cbiAgICAgICAgICA6IGxvY2F0aW9uLmhvc3RuYW1lID09PSBjb25maWdzWzFdWzFdLmFwcC5ob3N0bmFtZVxuICAgICAgICAgID8gY29uZmlnc1sxXVsxXVxuICAgICAgICAgIDogY29uZmlnc1syXVsxXTtcblxuICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcm94eSBlcnJvcicsIGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIFJlcXVlc3QgdG8gdGhlIFRhcmdldDonLCByZXEubWV0aG9kLCByZXEudXJsKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlY2VpdmVkIFJlc3BvbnNlIGZyb20gdGhlIFRhcmdldDonLCBwcm94eVJlcy5zdGF0dXNDb2RlLCByZXEudXJsKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICB0ZXN0OiB7XG4gICAgLi4ueyBjYWNoZTogeyBkaXI6IFwiLi4vLmNhY2hlL3ZpdGVzdFwiIH0gfSxcbiAgICBlbnZpcm9ubWVudDogXCJoYXBweS1kb21cIixcbiAgfSxcbn0pO1xuIl0sCiAg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
