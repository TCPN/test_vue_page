# test_vue_pages

This is a test project, which refactors the `quiz_collection` project with ejs prebuild and vue to achieve these goals:
- reuse the html for every differnt quiz
- reuse the Header and Footer components
- write the quiz info in the quiz page html, so that web crawlers can get basic quiz info.

The deployed website is at https://tcpn.github.io/test_vue_page/quizs/

# Pre-requisites

You need `node.js >= 20` and `npm` or `pnpm` for development and deployment.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Pre-build the html pages of all quizs and collect the quizList.ts

```sh
pnpm prebuild
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
