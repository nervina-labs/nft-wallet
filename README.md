# Mibao

The web app of Mibao.

## Quick start

### Prerequisites

You will need node >= 14 and yarn >= 1.22 to build and run Mibao. Run command:

```bash
$ yarn
```

to install dependencies.

### Start local development server

After Node.js and yarn has been installed, run this command to start a local development server:

```bash
$ yarn dev
```

## Development

### Tech stack

* [React](https://reactjs.org/), UI library

* [React Router](https://reactrouter.com/), router

* [Material UI](https://material-ui.com/zh/), UI Components

* [Create React App](https://github.com/facebook/create-react-app)/[craco](https://github.com/gsoft-inc/craco), Bundle tool

* [Jotai](https://github.com/pmndrs/jotai), State managements

* [pw-core](https://github.com/lay2dev/pw-core), CKB SDK for dApps

In summary, Mibao is a React-based single-page application that implements routing via `react-router`. Mibao generates pure HTML/CSS/JavaScript files and does not require a server with a specific back-end language to run it.

### File Structure

```bash
./src
  ├── App.css # entry css file
  ├── App.tsx # entry React component
  ├── apis # API impl
  ├── assets # static assets
  ├── cache # storage cache
  ├── components # common components
  ├── constants # constants variable
  ├── favicon.svg
  ├── hooks # custom React hooks
  ├── i18n # locale files
  ├── index.tsx # entry file
  ├── mock
  ├── models # TypeScript models
  ├── pw # pw-core interactions
  ├── react-app-env.d.ts #
  ├── routes # react router config
  ├── styles # common styles
  ├── utils
  └── views # route component
```

Note that the `env.example` in `<ROOT>/.env.example` includes both the mainnet/testnet environment variables. The compiled files are generated in the `<ROOT>/build` folder.

## Contribution

Please make sure that the Pull Request follows the requirements in [PULL REQUEST TEMPLATE](./github/PULL_REQUEST_TEMPLATE.md).

## License

Neuron is released under the terms of the Apache-2.0 license.
