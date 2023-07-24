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
// import { config } from '@joyid/core'
import { initConfig } from '@joyid/ckb'

import './index.css'
import { JOYID_APP_URL } from './constants'

console.log(JOYID_APP_URL)
// config.setJoyIDAppURL(JOYID_APP_URL)

initConfig({
  name: 'Token City',
  logo: `${location.origin}/icons/180.png`,
  joyidAppURL: JOYID_APP_URL,
})

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

sw.unregister()
