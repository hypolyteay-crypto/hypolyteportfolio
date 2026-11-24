import { useEffect, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { education, profile, projects, skills } from './data/portfolio'

const links = [
  ['À propos', 'apropos'], ['Projets', 'projets'], ['Compétences', 'competences'], ['Parcours', 'parcours'], ['Contact', 'contact'],
]

function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('accueil')
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id) })
    }, { rootMargin: '-35% 0px -55% 0px' })
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  const close = () => setOpen(false)
  return <header className="header">
    <a className="wordmark" href="#accueil" onClick={close} aria-label="AYIKOUE, accueil">AYIKOUE<span>.</span></a>
    <button className="menu-toggle" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'nav nav-open' : 'nav'} aria-label="Navigation principale">
      <a className={active === 'accueil' ? 'nav-link active' : 'nav-link'} href="#accueil" onClick={close}>Accueil</a>
      {links.map(([label, id]) => <a key={id} className={active === id ? 'nav-link active' : 'nav-link'} href={`#${id}`} onClick={close}>{label}</a>)}
    </nav>
  </header>
}

function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'sending') return
    if (!profile.formspreeId) { setState('error'); setMessage('Le formulaire sera disponible après sa configuration Formspree. Vous pouvez me joindre directement par email.'); return }
    setState('sending'); setMessage('')
    const form = event.currentTarget
    const body = new FormData(form)
    try {
      const response = await fetch(`https://formspree.io/f/${encodeURIComponent(profile.formspreeId)}`, { method: 'POST', body, headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error('Formspree rejected the submission')
      setState('sent'); setMessage('Votre message a bien été envoyé. Merci !'); form.reset()
    } catch { setState('error'); setMessage('L’envoi a échoué. Réessayez ou contactez-moi directement par email.') }
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-row"><label>Votre nom<input required name="name" autoComplete="name" /></label><label>Votre email<input required name="email" type="email" autoComplete="email" /></label></div>
    <label>Objet<input required name="subject" /></label>
    <label>Votre message<textarea required name="message" rows={4} /></label>
    <label className="honeypot" aria-hidden="true">Ne pas remplir<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label>
    <input type="hidden" name="_subject" value="Nouveau message depuis le portfolio" />
    <div className="form-bottom"><button className="button button-light" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'} <ArrowUpRight size={16} /></button><p className={`form-status ${state}`} role="status" aria-live="polite">{message}</p></div>
  </form>
}

function App() {
  return <>
    <a className="skip-link" href="#contenu">Aller au contenu</a>
    <Header />
    <main id="contenu">
      <section className="hero section-shell" id="accueil">
        <div className="hero-topline"><span>PORTFOLIO PERSONNEL</span><span>DÉVELOPPEMENT WEB</span></div>
        <div className="hero-main">
          <div className="hero-copy"><p className="eyebrow"><i /> Profil professionnel</p><h1>AYIKOUE<br /><em>Amavi</em> Hypolyte</h1><p className="hero-role">Développeur Web Full-Stack Junior</p><p className="hero-intro">Je conçois et développe des expériences web utiles, fonctionnelles et pensées dans les moindres détails.</p>
            <div className="hero-actions"><a className="button button-gold" href="#projets">Découvrir mes projets <ArrowDownRight size={16} /></a><a className="text-link" href="#contact">Parlons de votre projet <ArrowUpRight size={15} /></a></div>
          </div>
          <aside className="hero-aside"><div className="monogram" aria-hidden="true"><span>A</span><i /></div><div className="availability"><span className="status-dot" />Disponibilité <strong>À préciser</strong></div><span className="aside-note">Conception attentive.<br />Développement soigné.</span></aside>
        </div>
        <a className="scroll-cue" href="#apropos"><span>FAIRE DÉFILER</span><ArrowDown size={14} /></a>
        <div className="hero-index">01 <span>/</span> 06</div>
      </section>

      <section className="about section-shell section-pad" id="apropos">
        <div className="section-heading"><span className="section-number">01 — À PROPOS</span><span className="gold-rule" /></div>
        <div className="about-grid"><h2>Le web comme<br /><em>terrain de création.</em></h2><div className="about-copy"><p className="lead">Je suis AYIKOUE Amavi Hypolyte, développeur web full-stack junior. Mon parcours informatique m’a conduit vers la création d’applications web et l’envie de comprendre ce qui les rend vraiment utiles.</p><p>J’accorde de l’importance à la clarté de l’interface, à la structure du code et à la manière dont les données s’organisent. J’avance projet après projet, avec le souci d’apprendre et de construire des solutions accessibles et fonctionnelles.</p><p>Je cherche aujourd’hui à continuer ma progression et à contribuer à des projets web concrets.</p><a className="text-link" href="#parcours">Découvrir mon parcours <ArrowDownRight size={15} /></a></div></div>
      </section>

      <section className="projects section-shell section-pad" id="projets">
        <div className="section-heading"><span className="section-number">02 — PROJETS</span><span className="gold-rule" /></div>
        <div className="projects-title"><h2>Le travail<br /><em>en cours.</em></h2><p>Des projets personnels pour mettre en pratique et faire évoluer mes compétences.</p></div>
        {projects.map((project) => <article className="project" key={project.number}>
          <div className="project-preview" role="img" aria-label="Aperçu de l’interface du SaaS EVENT-FLOW en développement"><iframe src={`${import.meta.env.BASE_URL}event-flow-app/index.html`} title="Aperçu de l’interface EVENT-FLOW en développement" loading="lazy" tabIndex={-1} /></div>
          <div className="project-info"><div className="project-meta"><span>{project.number} / PROJET PERSONNEL</span><span className="project-status"><i />{project.status}</span></div><h3>{project.name}</h3><p>{project.description}</p><ul className="tag-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul><span className="project-no-link">Étude et réalisation en cours</span></div>
        </article>)}
      </section>

      <section className="skills section-shell section-pad" id="competences">
        <div className="section-heading"><span className="section-number">03 — COMPÉTENCES</span><span className="gold-rule" /></div>
        <div className="skills-grid"><h2>Des bases<br /><em>pour construire.</em></h2><div className="skill-list">{skills.map((group, index) => <div className="skill-row" key={group.label}><span className="skill-index">0{index + 1}</span><h3>{group.label}</h3><p>{group.items.join(' · ')}</p></div>)}</div></div>
      </section>

      <section className="journey section-shell section-pad" id="parcours">
        <div className="section-heading"><span className="section-number">04 — PARCOURS</span><span className="gold-rule" /></div>
        <div className="journey-grid"><div><h2>Apprendre,<br /><em>puis approfondir.</em></h2><p className="journey-intro">Un parcours de formation construit autour de l’informatique et des systèmes.</p></div><div className="timeline">{education.map((item) => <article className="timeline-item" key={item.school}><span className="timeline-period">{item.period}</span><div><h3>{item.school}</h3><p>{item.subject}</p></div><span className="timeline-mark" aria-hidden="true" /></article>)}</div></div>
      </section>

      <section className="contact section-shell section-pad" id="contact">
        <div className="section-heading"><span className="section-number">05 — CONTACT</span><span className="gold-rule" /></div>
        <div className="contact-grid"><div className="contact-intro"><p className="eyebrow"><i /> CONTACT</p><h2>Une idée<br />à <em>construire ?</em></h2><p>Pour une collaboration, une question ou simplement échanger autour du web, vous pouvez m’écrire.</p><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={15} /></a><div className="social-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href={`tel:${profile.phone.replaceAll(' ', '')}`}>Téléphone <ArrowUpRight size={14} /></a></div></div><ContactForm /></div>
      </section>
    </main>
    <footer className="footer section-shell"><a className="wordmark" href="#accueil">AYIKOUE<span>.</span></a><span>© {new Date().getFullYear()} AYIKOUE Amavi Hypolyte</span><a href="#accueil">Retour en haut ↑</a></footer>
  </>
}

export default App

