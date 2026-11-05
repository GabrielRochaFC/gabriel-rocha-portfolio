import type { Project, SkillGroup } from "../lib/types";

export const profile = {
  name: "Gabriel Rocha",
  user: "gabriel",
  host: "rocha",
  role: "full stack",
  location: "Brasil",
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
    "Desenvolvedor full stack no Brasil. Trabalho principalmente com TypeScript, Node.js e Next.js. Quando o projeto pede, uso Java com Spring ou Python com Django.",
    "A formação em Análise e Desenvolvimento de Sistemas na Uninter está em andamento. Antes, comecei Engenharia Automotiva na UnB e não concluí.",
  ],
} as const;

export const skillGroups: SkillGroup[] = [
  {
    file: "/skills/linguagens.txt",
    title: "linguagens",
    items: ["TypeScript", "JavaScript", "Java", "Python", "HTML", "CSS"],
  },
  {
    file: "/skills/frontend.txt",
    title: "frontend",
    items: ["React", "Next.js", "Redux", "Vite", "Sass", "Bootstrap"],
  },
  {
    file: "/skills/backend.txt",
    title: "backend",
    items: ["Node.js", "Express", "Prisma", "Spring", "Django"],
  },
  {
    file: "/skills/bancos.txt",
    title: "bancos",
    items: ["PostgreSQL", "MySQL", "SQLite"],
  },
  {
    file: "/skills/ferramentas.txt",
    title: "ferramentas",
    items: ["Git", "GitHub", "Figma", "Postman", "IntelliJ IDEA", "VS Code"],
  },
];

export const projects: Project[] = [
  {
    slug: "sghss",
    file: "/projects/sghss.md",
    title: "Sistema de gestão hospitalar",
    year: "2025",
    blurb: "API de gestão hospitalar",
    summary:
      "API para pacientes, profissionais, unidades, leitos, internações, consultas, exames, histórico clínico e prescrições. Autenticação com JWT, papéis de acesso e validação com Zod.",
    stack: ["TypeScript", "Node.js", "Express", "Prisma", "PostgreSQL"],
    href: "https://github.com/GabrielRochaFC/sistema-de-gestao-hospitalar",
    note: "Trabalho acadêmico da Uninter.",
    group: "work",
  },
  {
    slug: "integra-nota-fiscal",
    file: "/projects/integra-nota-fiscal.md",
    title: "Integra Nota Fiscal",
    year: "2024",
    blurb: "notas fiscais e gateway de pagamento",
    summary:
      "Aplicação Jakarta EE que integra gateways de pagamento para emitir notas fiscais.",
    stack: ["Java 21", "Spring", "MySQL"],
    href: "https://github.com/GabrielRochaFC/IntegraNotaFiscal",
    group: "work",
  },
  {
    slug: "guess-game",
    file: "/projects/guess-game.md",
    title: "Guess the Word",
    year: "2025",
    blurb: "jogo de adivinhar a palavra",
    summary:
      "Jogo de adivinhar a palavra, letra por letra, com dica, dificuldade e limite de tentativas.",
    stack: ["React", "TypeScript", "Vite"],
    href: "https://github.com/GabrielRochaFC/programming-guess-game",
    group: "work",
  },
  {
    slug: "pst-to-pdf",
    file: "/projects/pst-to-pdf.md",
    title: "pst-to-pdf",
    year: "2026",
    blurb: "PST para PDF, no Linux, sem nuvem",
    summary:
      "Pipeline local que extrai um PST do Outlook e gera um PDF por e-mail, com manifesto CSV. A caixa não sai da máquina.",
    stack: ["Python", "ReportLab", "WeasyPrint"],
    href: "https://github.com/GabrielRochaFC/pst-to-pdf",
    note: "Roda no Linux, com readpst.",
    group: "work",
  },
  {
    slug: "mountain-shooter",
    file: "/projects/mountain-shooter.md",
    title: "Mountain Shooter",
    year: "2024",
    blurb: "jogo 2D em Pygame",
    summary:
      "Jogo 2D de arcade em Pygame, com dois níveis, modo cooperativo e placar guardado em SQLite.",
    stack: ["Python", "Pygame", "SQLite"],
    href: "https://github.com/GabrielRochaFC/MountainShooterGame",
    group: "work",
  },
  {
    slug: "starbucks",
    file: "/projects/studies/starbucks.md",
    title: "Starbucks — Happy Hour",
    year: "2023",
    blurb: "homepage de responsividade",
    summary:
      "Homepage feita no curso de responsividade da B7Web, para praticar layout em tamanhos de tela diferentes.",
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
    title: "Medicenter",
    year: "2023",
    blurb: "homepage de hospital",
    summary:
      "Homepage desenhada no Figma e construída com mobile-first, flexbox e grid.",
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
    title: "HZC",
    year: "2023",
    blurb: "layout com flexbox e grid",
    summary:
      "Projeto final do curso de Flexbox e Grid da Alura. O foco era mobile-first e layout responsivo.",
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
    title: "Doce Preço",
    year: "2024",
    blurb: "precificação para confeitaria",
    summary:
      "Calculadora de precificação para confeitaria: custo da receita, mão de obra e despesas.",
    stack: ["JavaScript"],
    href: "https://gabrielrochafc.github.io/DocePreco/",
    codeHref: "https://github.com/GabrielRochaFC/DocePreco",
    group: "studies",
  },
  {
    slug: "fincontrol",
    file: "/projects/studies/fincontrol.md",
    title: "FinControl",
    year: "2023",
    blurb: "organização financeira pessoal",
    summary: "Aplicativo de organização financeira pessoal.",
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
    when: "03/2023 · cursando",
    detail:
      "O sistema de gestão hospitalar foi o trabalho acadêmico dessa graduação.",
  },
  {
    course: "Engenharia Automotiva",
    place: "Universidade de Brasília (UnB)",
    when: "08/2018 · incompleto · Brasília",
  },
] as const;

export const certificates = [
  {
    name: "Escola de Programação Alura",
    detail: "UX & Design, Front-end, Programação, Inovação & Gestão",
    href: "https://cursos.alura.com.br/user/gabriel-rocha20/fullCertificate/9891530f7b5fed9938fbe916da7850c7",
  },
  {
    name: "Onebitcode",
    detail: "Desenvolvimento Web",
    href: "https://bit.ly/48ZXrFR",
  },
  {
    name: "B7Web",
    detail: "Desenvolvimento Web",
    href: "https://bit.ly/45GaI3s",
  },
] as const;

export const spokenLanguages = [
  { name: "Inglês", level: "avançado" },
  { name: "Português", level: "língua materna" },
  { name: "Espanhol", level: "básico" },
] as const;
