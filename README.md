# HR System Interface

A tiny hr system where hr employees can sign in/login and see other employee's work records.

## Directory Structure

`├──`[`.github`](.github) — GitHub configuration including CI/CD workflows<br>
`├──`[`.vscode`](.vscode) — VSCode settings including code snippets, recommended extensions etc.<br>
`├──`[`app`](./app) — Web application front-end built with [React](https://react.dev/) and [Material UI](https://mui.com/core/)<br>
`├──`[`edge`](./edge) — Cloudflare Workers (CDN) edge endpoint<br>
`├──`[`env`](./env) — Application settings, API keys, etc.<br>
`├──`[`scripts`](./scripts) — Automation scripts such as `yarn deploy`<br>
`├──`[`tsconfig.base.json`](./tsconfig.base.json) — The common/shared TypeScript configuration<br>
`└──`[`tsconfig.json`](./tsconfig.json) — The root TypeScript configuration<br>

## Tech Stack

- [React](https://react.dev/), [React Router](https://reactrouter.com/), [Recoil](https://recoiljs.org/), [Emotion](https://emotion.sh/), [Material UI](https://next.material-ui.com/), [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloudflare Workers](https://workers.cloudflare.com/), [Vite](https://vitejs.dev/), [Vitest](https://vitejs.dev/),
  [TypeScript](https://www.typescriptlang.org/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Yarn](https://yarnpkg.com/) with PnP

## Getting Started

```
$ cd ./example
$ yarn install
$ yarn start
```
