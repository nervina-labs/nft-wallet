import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import Vconsole from 'vconsole'

import './index.css'
console.log(new Vconsole())

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0,
  })
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
