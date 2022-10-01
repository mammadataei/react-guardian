import type { DefaultTheme } from 'vitepress'

export function sidebar(): DefaultTheme.Sidebar {
  return [
    {
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/introduction' },
        { text: 'Getting Started', link: '/getting-started' },
        { text: 'Defining Policies', link: '/defining-policies' },
        { text: 'Using Guard', link: '/guard' },
        { text: 'Protecting Routes', link: '/route-guard' },
        { text: 'Write Custom Guards', link: '/custom-guards' },
      ],
    },
  ]
}
