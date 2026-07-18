/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: 'src/**/*.stories.{js,jsx,ts,tsx,mdx}',
  viteConfig: `${process.cwd()}/vite.config.ts`,
  appendToHead: `<link rel="stylesheet" href="/src/styles/globals.scss" />`,
};
