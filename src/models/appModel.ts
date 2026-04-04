import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'

export type DocsLink = {
  label: string
  href: string
  logo: string
  logoAlt: string
}

export type SocialLink = {
  label: string
  href: string
  iconId: string
}

export type AppContent = {
  heading: string
  description: string
  hero: {
    base: string
    react: string
    vite: string
  }
  docs: {
    title: string
    subtitle: string
    links: DocsLink[]
  }
  social: {
    title: string
    subtitle: string
    links: SocialLink[]
  }
}

export function getAppContent(): AppContent {
  return {
    heading: 'Get started',
    description: 'Edit src/App.tsx and save to test HMR',
    hero: {
      base: heroImg,
      react: reactLogo,
      vite: viteLogo,
    },
    docs: {
      title: 'Documentation',
      subtitle: 'Your questions, answered',
      links: [
        {
          label: 'Explore Vite',
          href: 'https://vite.dev/',
          logo: viteLogo,
          logoAlt: 'Vite logo',
        },
        {
          label: 'Learn more',
          href: 'https://react.dev/',
          logo: reactLogo,
          logoAlt: 'React logo',
        },
      ],
    },
    social: {
      title: 'Connect with us',
      subtitle: 'Join the Vite community',
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/vitejs/vite',
          iconId: 'github-icon',
        },
        {
          label: 'Discord',
          href: 'https://chat.vite.dev/',
          iconId: 'discord-icon',
        },
        {
          label: 'X.com',
          href: 'https://x.com/vite_js',
          iconId: 'x-icon',
        },
        {
          label: 'Bluesky',
          href: 'https://bsky.app/profile/vite.dev',
          iconId: 'bluesky-icon',
        },
      ],
    },
  }
}