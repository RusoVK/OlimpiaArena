import type { AppViewModel } from '../controllers/useAppController'

export function AppView({ count, onIncrement, content }: AppViewModel) {
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