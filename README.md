# Gabriel Rocha

Portfólio em forma de shell. A sessão abre em inglês. O conteúdo vem do perfil público do GitHub e dos projetos que já estavam publicados.

## Local

```bash
npm install
npm run dev
```

Abre em http://localhost:3000.

Para ver a build de produção, o mesmo servidor da imagem:

```bash
npm run build
npm start
```

Ele escuta a variável `PORT`. Sem ela, usa a porta 3000.

## Railway

O repositório inclui um Dockerfile. Na Railway:

1. Crie um projeto e escolha Deploy from GitHub.
2. Selecione este repositório. A Railway usa o Dockerfile quando ele existe.
3. Nenhuma variável de ambiente é obrigatória. A plataforma define `PORT` sozinha.
4. Em Settings, Networking, gere um domínio.

Dentro da imagem o processo é `node server.js`, na porta `PORT`, escutando em `0.0.0.0`.

GitHub Pages não sobe esse servidor Node. O deploy previsto é a Railway.

## Comandos

`help` lista os comandos. `ls` lista os arquivos. `lang pt` muda para português e `lang en` volta para inglês. A escolha fica salva no navegador.

Tab completa. A seta para cima recupera o comando anterior. `ctrl+l` limpa a tela. `theme` troca entre `gruvbox`, `kanagawa` e `night`. Imagens aparecem quando um arquivo tem uma, como `cat portrait.jpg` ou um estudo em `projects/studies`.
