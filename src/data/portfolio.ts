import { publicConfig } from '../config/public'

export const profile = {
  name: 'AYIKOUE Amavi Hypolyte',
  role: 'Développeur Web Full-Stack Junior',
  email: 'hypolyteay@gmail.com',
  phone: '+229 01 50 85 56 13',
  github: 'https://github.com/hypolyteay-crypto',
  linkedin: 'https://www.linkedin.com/in/hypolyte-ayikoue-8a8950441/',
  formspreeId: publicConfig.formspreeId,
}

export const projects = [{
  number: '01',
  name: 'EVENT-FLOW',
  description: 'Plateforme de gestion événementielle, actuellement en développement.',
  status: 'En développement',
  technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
  visual: 'event-flow',
}]

export const skills = [
  { label: 'Frontend', items: ['HTML5', 'CSS3', 'JavaScript'] },
  { label: 'Backend', items: ['PHP'] },
  { label: 'Base de données', items: ['SQL', 'MySQL'] },
  { label: 'Outils', items: ['Git', 'GitHub'] },
]

export const education = [
  { period: '2017 — 2021', school: 'Blaise & Fils', subject: 'Informatique' },
  { period: '2023 — 2024', school: 'IMPACT-ACTION', subject: 'Réseaux et maintenance informatique' },
]

