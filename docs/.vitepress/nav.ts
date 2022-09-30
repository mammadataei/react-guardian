import type { DefaultTheme } from 'vitepress'

export function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Guide', link: '/introduction' },
    { text: 'Changelog', link: '#' },
  ]
}
