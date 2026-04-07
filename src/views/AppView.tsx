import { Suspense, lazy, useState } from 'react'
import type { AppViewModel } from '../controllers/useAppController'
import { useRubikController } from '../controllers/useRubikController'

const RubikView = lazy(() => import('./RubikView.tsx'))

export function AppView({ count, onIncrement, content }: AppViewModel) {
  const [currentView, setCurrentView] = useState<'home' | 'rubik'>('home')
  const rubikController = useRubikController()

  if (currentView === 'rubik') {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <nav
          style={{
            padding: '12px 24px',
            backgroundColor: '#222',
            display: 'flex',
            gap: '12px',
            borderBottom: '1px solid #444',
          }}
        >
          <button
            onClick={() => setCurrentView('home')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#fff',
              border: '1px solid #666',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ← Back
          </button>
        </nav>
        <Suspense
          fallback={
            <div
              style={{
                flex: 1,
                display: 'grid',
                placeItems: 'center',
                background: '#111318',
                color: '#e9efff',
              }}
            >
              Cargando cubo...
            </div>
          }
        >
          <RubikView {...rubikController} />
        </Suspense>
      </div>
    )
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={content.hero.base} className="base" width="170" height="179" alt="" />
          <img src={content.hero.react} className="framework" alt="React logo" />
          <img src={content.hero.vite} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>{content.heading}</h1>
          <p>{content.description}</p>
        </div>
        <button className="counter" onClick={onIncrement}>
          Count is {count}
        </button>
        <button
          onClick={() => setCurrentView('rubik')}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#aa3bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          View Rubik Cube →
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>{content.docs.title}</h2>
          <p>{content.docs.subtitle}</p>
          <ul>
            {content.docs.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  <img className="logo" src={link.logo} alt={link.logoAlt} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>{content.social.title}</h2>
          <p>{content.social.subtitle}</p>
          <ul>
            {content.social.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  <svg className="button-icon" role="presentation" aria-hidden="true">
                    <use href={`/icons.svg#${link.iconId}`}></use>
                  </svg>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}