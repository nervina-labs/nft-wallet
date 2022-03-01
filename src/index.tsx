/* eslint-disable import/first */
require('object.fromentries/auto')
require('array.prototype.flat/auto')
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './gt'
import * as sw from './serviceWorkerRegistration'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import './index.css'

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

sw.register()
