import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { nav } from './nav'

export default defineConfig({
  title: 'React Guardian',
  description:
    'Declarative authentication and authorization for React applications',

  lastUpdated: true,

  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),

    algolia: {
      appId: '33IC4BYLDB',
      apiKey: '47df1cbbeec87f26b7a65d3f2808f53a',
      indexName: 'react-guardian',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mammadataei/react-guardian' },
    ],

    editLink: {
      pattern:
        'https://github.com/mammadataei/react-guardian/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022 Mohammad Ataei',
    },
  },
})
