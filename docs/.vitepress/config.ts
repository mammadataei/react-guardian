import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'React Guardian',
  description:
    'Declarative authentication and authorization for React applications',

  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022 Mohammad Ataei',
    },

    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'Changelog', link: '' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
    ],
  },
})
