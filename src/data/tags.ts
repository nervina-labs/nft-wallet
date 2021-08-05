import { IS_MAINNET } from '../constants'

export const tags = !IS_MAINNET
  ? {
      en: [
        {
          uuid: 'fa9d8bd1-a24d-4cec-a75f-686caac28ba4',
          name: 'Art',
        },
        {
          uuid: '8d87dd9b-7e9d-45bc-b117-16c8ad556aaa',
          name: 'Souvenir',
        },
        {
          uuid: '580e3c76-1bf9-46cf-8ba0-31bec267d926',
          name: 'Photography',
        },
        {
          uuid: '07ca6fbe-b078-481f-9a12-1cae551b42cc',
          name: 'Rights',
        },
        {
          uuid: 'fba08f99-622e-4726-bd47-fd36d7bd6c1d',
          name: 'Memes',
        },
      ],
      zh: [
        {
          uuid: 'fa9d8bd1-a24d-4cec-a75f-686caac28ba4',
          name: '艺术',
        },
        {
          uuid: '8d87dd9b-7e9d-45bc-b117-16c8ad556aaa',
          name: '纪念品',
        },
        {
          uuid: '580e3c76-1bf9-46cf-8ba0-31bec267d926',
          name: '摄影',
        },
        {
          uuid: '07ca6fbe-b078-481f-9a12-1cae551b42cc',
          name: '权益',
        },
        {
          uuid: 'fba08f99-622e-4726-bd47-fd36d7bd6c1d',
          name: 'Memes',
        },
      ],
    }
  : {
      zh: [],
      en: [],
    }
