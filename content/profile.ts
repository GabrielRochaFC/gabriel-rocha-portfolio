import type { Lang, Localized, Project, SkillGroup } from "../lib/types";

export function text(lang: Lang, value: Localized): string {
  return value[lang];
}

export const profile = {
  name: "Gabriel Rocha",
  user: "gabriel",
  host: "rocha",
  role: "full stack",
  location: { en: "Brazil", pt: "Brasil" },
  org: "Kineto",
  focus: ["TypeScript", "Node.js", "Next.js"],
  also: ["Java/Spring", "Python/Django"],
  email: "gabriel.rocha20@live.com",
  cv: "https://bit.ly/curriculogrfcdownload2023",
  github: "https://github.com/GabrielRochaFC",
  linkedin: "https://www.linkedin.com/in/gabriel-rocha-28ab8414b/",
  instagram: "https://www.instagram.com/gabriiel.rocha44/",
  portrait: "/portrait.jpg",
  about: [
    {
      en: "Full stack developer in Brazil. Day to day is TypeScript, Node.js, and Next.js. Java with Spring or Python with Django when a project calls for it.",
      pt: "Desenvolvedor full stack no Brasil. Trabalho principalmente com TypeScript, Node.js e Next.js. Quando o projeto pede, uso Java com Spring ou Python com Django.",
    },
    {
      en: "Studying Analysis and Systems Development at Uninter. Before that, Automotive Engineering at UnB, unfinished.",
      pt: "A formação em Análise e Desenvolvimento de Sistemas na Uninter está em andamento. Antes, comecei Engenharia Automotiva na UnB e não concluí.",
    },
  ],
} as const;

export const skillGroups: SkillGroup[] = [
  {
    file: "/skills/languages.txt",
    title: { en: "languages", pt: "linguagens" },
    items: ["TypeScript", "JavaScript", "Java", "Python", "HTML", "CSS"],
  },
  {
    file: "/skills/frontend.txt",
    title: { en: "frontend", pt: "frontend" },
    items: ["React", "Next.js", "Redux", "Vite", "Sass", "Bootstrap"],
  },
  {
    file: "/skills/backend.txt",
    title: { en: "backend", pt: "backend" },
    items: ["Node.js", "Express", "Prisma", "Spring", "Django"],
  },
  {
    file: "/skills/databases.txt",
    title: { en: "databases", pt: "bancos" },
    items: ["PostgreSQL", "MySQL", "SQLite"],
  },
  {
    file: "/skills/tools.txt",
    title: { en: "tools", pt: "ferramentas" },
    items: ["Git", "GitHub", "Figma", "Postman", "IntelliJ IDEA", "VS Code"],
  },
];

export const projects: Project[] = [
  {
    slug: "sghss",
    file: "/projects/sghss.md",
    title: { en: "Hospital management system", pt: "Sistema de gestão hospitalar" },
    year: "2025",
    blurb: { en: "hospital management API", pt: "API de gestão hospitalar" },
    summary: {
      en: "API for patients, staff, units, beds, admissions, appointments, exams, clinical history, and prescriptions. JWT auth, role checks, and Zod validation.",
      pt: "API para pacientes, profissionais, unidades, leitos, internações, consultas, exames, histórico clínico e prescrições. Autenticação com JWT, papéis de acesso e validação com Zod.",
    },
    stack: ["TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL"],
    href: "https://github.com/GabrielRochaFC/sistema-de-gestao-hospitalar",
    note: {
      en: "Academic project at Uninter.",
      pt: "Trabalho acadêmico da Uninter.",
    },
    group: "work",
  },
  {
    slug: "integra-nota-fiscal",
    file: "/projects/integra-nota-fiscal.md",
    title: { en: "Integra Nota Fiscal", pt: "Integra Nota Fiscal" },
    year: "2024",
    blurb: { en: "invoices and payment gateways", pt: "notas fiscais e gateway de pagamento" },
    summary: {
      en: "Jakarta EE app that integrates payment gateways to issue invoices.",
      pt: "Aplicação Jakarta EE que integra gateways de pagamento para emitir notas fiscais.",
    },
    stack: ["Java 21", "Spring", "MySQL"],
    href: "https://github.com/GabrielRochaFC/IntegraNotaFiscal",
    group: "work",
  },
  {
    slug: "guess-game",
    file: "/projects/guess-game.md",
    title: { en: "Guess the Word", pt: "Guess the Word" },
    year: "2025",
    blurb: { en: "word guessing game", pt: "jogo de adivinhar a palavra" },
    summary: {
      en: "Guess a word one letter at a time, with a hint, a difficulty, and a limited number of tries.",
      pt: "Jogo de adivinhar a palavra, letra por letra, com dica, dificuldade e limite de tentativas.",
    },
    stack: ["React", "TypeScript", "Vite"],
    href: "https://github.com/GabrielRochaFC/programming-guess-game",
    group: "work",
  },
  {
    slug: "pst-to-pdf",
    file: "/projects/pst-to-pdf.md",
    title: { en: "pst-to-pdf", pt: "pst-to-pdf" },
    year: "2026",
    blurb: { en: "PST to PDF, local, on Linux", pt: "PST para PDF, no Linux, sem nuvem" },
    summary: {
      en: "Local pipeline that extracts an Outlook PST and writes one PDF per message, plus a CSV manifest. The mailbox never leaves the machine.",
      pt: "Pipeline local que extrai um PST do Outlook e gera um PDF por e-mail, com manifesto CSV. A caixa não sai da máquina.",
    },
    stack: ["Python", "ReportLab", "WeasyPrint"],
    href: "https://github.com/GabrielRochaFC/pst-to-pdf",
    note: { en: "Runs on Linux, with readpst.", pt: "Roda no Linux, com readpst." },
    group: "work",
  },
  {
    slug: "mountain-shooter",
    file: "/projects/mountain-shooter.md",
    title: { en: "Mountain Shooter", pt: "Mountain Shooter" },
    year: "2024",
    blurb: { en: "2D Pygame shooter", pt: "jogo 2D em Pygame" },
    summary: {
      en: "2D arcade game in Pygame, two levels, co-op, scores stored in SQLite.",
      pt: "Jogo 2D de arcade em Pygame, com dois níveis, modo cooperativo e placar guardado em SQLite.",
    },
    stack: ["Python", "Pygame", "SQLite"],
    href: "https://github.com/GabrielRochaFC/MountainShooterGame",
    group: "work",
  },
  {
    slug: "starbucks",
    file: "/projects/studies/starbucks.md",
    title: { en: "Starbucks — Happy Hour", pt: "Starbucks — Happy Hour" },
    year: "2023",
    blurb: { en: "responsive homepage", pt: "homepage de responsividade" },
    summary: {
      en: "Homepage from the B7Web responsiveness course, practice for layouts at different screen sizes.",
      pt: "Homepage feita no curso de responsividade da B7Web, para praticar layout em tamanhos de tela diferentes.",
    },
    stack: ["HTML", "CSS"],
    href: "https://gabrielrochafc.github.io/Starbucks_projeto/",
    codeHref: "https://github.com/GabrielRochaFC/Starbucks_projeto",
    image: "/studies/starbucks.png",
    imageWidth: 272,
    imageHeight: 181,
    group: "studies",
  },
  {
    slug: "medicenter",
    file: "/projects/studies/medicenter.md",
    title: { en: "Medicenter", pt: "Medicenter" },
    year: "2023",
    blurb: { en: "hospital homepage", pt: "homepage de hospital" },
    summary: {
      en: "Homepage designed in Figma and built mobile-first with flexbox and grid.",
      pt: "Homepage desenhada no Figma e construída com mobile-first, flexbox e grid.",
    },
    stack: ["HTML", "CSS", "JavaScript"],
    href: "https://gabrielrochafc.github.io/Medicenter/",
    codeHref: "https://github.com/GabrielRochaFC/Medicenter",
    image: "/studies/medicenter.png",
    imageWidth: 272,
    imageHeight: 181,
    group: "studies",
  },
  {
    slug: "hzc",
    file: "/projects/studies/hzc.md",
    title: { en: "HZC", pt: "HZC" },
    year: "2023",
    blurb: { en: "flexbox and grid layout", pt: "layout com flexbox e grid" },
    summary: {
      en: "Final project of Alura's Flexbox and Grid course. The focus was mobile-first responsive layout.",
      pt: "Projeto final do curso de Flexbox e Grid da Alura. O foco era mobile-first e layout responsivo.",
    },
    stack: ["HTML", "CSS", "JavaScript"],
    href: "https://gabrielrochafc.github.io/HZC/",
    codeHref: "https://github.com/GabrielRochaFC/HZC",
    image: "/studies/hzc.png",
    imageWidth: 272,
    imageHeight: 181,
    group: "studies",
  },
  {
    slug: "doce-preco",
    file: "/projects/studies/doce-preco.md",
    title: { en: "Doce Preço", pt: "Doce Preço" },
    year: "2024",
    blurb: { en: "pricing for bakeries", pt: "precificação para confeitaria" },
    summary: {
      en: "Pricing calculator for confectionery: recipe cost, labor, and expenses.",
      pt: "Calculadora de precificação para confeitaria: custo da receita, mão de obra e despesas.",
    },
    stack: ["JavaScript"],
    href: "https://gabrielrochafc.github.io/DocePreco/",
    codeHref: "https://github.com/GabrielRochaFC/DocePreco",
    group: "studies",
  },
  {
    slug: "fincontrol",
    file: "/projects/studies/fincontrol.md",
    title: { en: "FinControl", pt: "FinControl" },
    year: "2023",
    blurb: { en: "personal finance", pt: "organização financeira pessoal" },
    summary: {
      en: "Personal finance organizer.",
      pt: "Aplicativo de organização financeira pessoal.",
    },
    stack: ["HTML", "CSS", "JavaScript"],
    href: "https://gabrielrochafc.github.io/FinControl/",
    codeHref: "https://github.com/GabrielRochaFC/FinControl",
    group: "studies",
  },
];

export const schools = [
  {
    course: "Tecnologia em Análise e Desenvolvimento de Sistemas",
    place: "Centro Universitário Internacional UNINTER",
    when: { en: "03/2023 · in progress", pt: "03/2023 · cursando" },
    detail: {
      en: "The hospital management system was the academic project for this degree.",
      pt: "O sistema de gestão hospitalar foi o trabalho acadêmico dessa graduação.",
    },
  },
  {
    course: "Engenharia Automotiva",
    place: "Universidade de Brasília (UnB)",
    when: { en: "08/2018 · incomplete · Brasília", pt: "08/2018 · incompleto · Brasília" },
  },
] as const;

export const certificates = [
  {
    name: "Escola de Programação Alura",
    detail: {
      en: "UX & design, front-end, programming, innovation & management",
      pt: "UX & Design, Front-end, Programação, Inovação & Gestão",
    },
    href: "https://cursos.alura.com.br/user/gabriel-rocha20/fullCertificate/9891530f7b5fed9938fbe916da7850c7",
  },
  {
    name: "Onebitcode",
    detail: { en: "Web development", pt: "Desenvolvimento Web" },
    href: "https://bit.ly/48ZXrFR",
  },
  {
    name: "B7Web",
    detail: { en: "Web development", pt: "Desenvolvimento Web" },
    href: "https://bit.ly/45GaI3s",
  },
] as const;

export const spokenLanguages = [
  {
    name: { en: "English", pt: "Inglês" },
    level: { en: "advanced", pt: "avançado" },
  },
  {
    name: { en: "Portuguese", pt: "Português" },
    level: { en: "native", pt: "língua materna" },
  },
  {
    name: { en: "Spanish", pt: "Espanhol" },
    level: { en: "basic", pt: "básico" },
  },
] as const;
