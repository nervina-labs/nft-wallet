/* eslint-disable no-void */
/* eslint-disable node/no-callback-literal */
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  MutableRefObject,
} from 'react'
import ReactDOM from 'react-dom'
import Das, { AccountRecord } from 'das-sdk'
import { CircularProgress } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import {
  DasSelectorContainer,
  DasSelectorPopoutContainer,
  DasSelectorPopoutMask,
} from './styled'
import { verifyDasAddress, debounce, verifyCkbAddress } from '../../utils'
import { useDas } from '../../hooks/usdDas'
import { ReactComponent as CheckoutSvg } from '../../assets/svg/das-checkout.svg'
import { ReactComponent as DefaultSvg } from '../../assets/svg/default-das.svg'
import { IS_MAINNET } from '../../constants'

export interface DasSelectorProps {
  visible: boolean
  url: string
  onSelect: (selectedAccount: AccountRecord | null) => void
  selectedAccount: AccountRecord | null
  // eslint-disable-next-line prettier/prettier
  dasPopoutVisibleTriggerRef: MutableRefObject<((popoutVisible: boolean) => void) | undefined>
}

export interface DasSelectorPopoutProps {
  visible: boolean
  data?: AccountRecord[]
  root: HTMLElement | null
  onSelect: (selectedAccount: AccountRecord | null) => void
  selectedAccount: AccountRecord | null
  onVisibleChange: (visible: boolean) => void
}

function filterCKBAddress(address: string): boolean {
  if (verifyCkbAddress(address)) {
    if (IS_MAINNET && address.startsWith('ckt')) {
      return false
    }
    if (!IS_MAINNET && address.startsWith('ckb')) {
      return false
    }
    return true
  }
  return true
}

const filterChains = ['ETH', 'CKB']
const filterKeys = ['address.eth', 'address.ckb']
let timeout: NodeJS.Timeout | null
let currentValue: string

async function fetch(
  url: string,
  das: Das
): Promise<AccountRecord[] | undefined> {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = url

  return await new Promise<AccountRecord[] | undefined>((resolve) => {
    timeout = debounce(() => {
      void das
        .account(url)
        .then((resp) => {
          if (currentValue === url) {
            let records: AccountRecord[] = []
            if (
              resp.owner_address &&
              filterChains.includes(resp.owner_address_chain)
            ) {
              records.push({
                ttl: 0,
                type: 'address',
                strippedKey: '',
                avatar: '',
                key: 'owner',
                label: 'Owner',
                value: resp.owner_address,
              })
            }
            if (
              resp.manager_address &&
              filterChains.includes(resp.manager_address_chain)
            ) {
              records.push({
                ttl: 0,
                type: 'address',
                strippedKey: '',
                avatar: '',
                key: 'manager',
                label: 'Manager',
                value: resp.manager_address,
              })
            }

            records = records.concat(
              resp.records.filter((record) => filterKeys.includes(record.key))
            )

            records = records.filter((record) => filterCKBAddress(record.value))

            resolve(records)
          }
        })
        .catch(() => {
          resolve(undefined)
        })
    }, 500)()
  })
}

function getElementPagePosition(elem: HTMLElement): [number, number] {
  // crossbrowser version
  const box = elem.getBoundingClientRect()

  const body = document.body
  const docEl = document.documentElement

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

  const clientTop = docEl.clientTop || body.clientTop || 0
  const clientLeft = docEl.clientLeft || body.clientLeft || 0

  const top = box.top + scrollTop - clientTop
  const left = box.left + scrollLeft - clientLeft

  return [Math.round(left), Math.round(top)]
}

function getShortString(str: string): string {
  if (str.length <= 6) return str
  return `${str.slice(0, 3)}...${str.slice(-3)}`
}

const DasSelectorPopout: React.FC<DasSelectorPopoutProps> = ({
  visible,
  onVisibleChange,
  data,
  root,
  onSelect,
  selectedAccount,
}) => {
  const [top, setTop] = useState(0)
  const { t } = useTranslation('translations')

  const handleMaskClick = useCallback(() => {
    onVisibleChange(false)
  }, [onVisibleChange])

  const handleSelect = useCallback(
    (record) => {
      onSelect(record)
    },
    [onSelect]
  )

  useEffect(() => {
    if (!visible) return
    if (!root) return
    const [, rootTop] = getElementPagePosition(root)
    setTop(rootTop + 35)
  }, [visible, root])

  useEffect(() => {
    if (data?.length === 1) {
      const handle = setTimeout(() => {
        handleSelect(data[0])
      }, 3000)

      return () => {
        clearTimeout(handle)
      }
    }
  }, [data])

  const dom = (
    <DasSelectorPopoutContainer
      className={classNames({ visible, selected: !!selectedAccount })}
      style={{ top }}
    >
      {!data ? (
        <div className="empty">{t('transfer.das.not-register')}</div>
      ) : data.length === 0 ? (
        <div className="empty">{t('transfer.das.empty')}</div>
      ) : (
        <div className="result">
          <div className="title">
            {data.length === 1
              ? t('transfer.das.single-result')
              : t('transfer.das.multi-result')}
          </div>
          <div className="list">
            {data.map((record, i) => (
              <div
                className="record"
                key={`${i}.${record.key}`}
                onClick={() => handleSelect(record)}
              >
                {record === selectedAccount && (
                  <div className="check">
                    <CheckoutSvg />
                  </div>
                )}
                <div className="value">{record.value}</div>
                {record.label && (
                  <div className="label">
                    <span>{record.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="triangle" />
        </div>
      )}
    </DasSelectorPopoutContainer>
  )
  return (
    <>
      {ReactDOM.createPortal(
        <DasSelectorPopoutMask
          onClick={handleMaskClick}
          className={classNames({ visible })}
        />,
        document.body
      )}
      {ReactDOM.createPortal(dom, document.body)}
    </>
  )
}

export const DasSelector: React.FC<DasSelectorProps> = ({
  visible,
  url,
  onSelect,
  selectedAccount,
  dasPopoutVisibleTriggerRef,
}) => {
  const [popoutVisible, showPopout] = useState(false)
  const btnRef = useRef(null)
  const das = useDas()

  const handlePopoutSelect = useCallback(
    (acc) => {
      onSelect(acc)
      showPopout(false)
    },
    [onSelect, showPopout]
  )

  const { data, isLoading: loading } = useQuery(
    [das, url, visible, onSelect],
    async () => {
      if (!visible) return
      if (!url) return
      onSelect(null)
      showPopout(false)
      const resp = await fetch(url, das)
      showPopout(true)
      return resp
    },
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  )

  const needToShow = useMemo(() => visible && verifyDasAddress(url), [
    visible,
    url,
  ])

  useEffect(() => {
    const trigger = (popVisible: boolean): void => {
      showPopout(popVisible)
    }
    dasPopoutVisibleTriggerRef.current = trigger
  }, [showPopout, data])

  const avatar = loading ? (
    <CircularProgress size={16} className="loading" />
  ) : selectedAccount?.avatar ? (
    <img src={selectedAccount.avatar} alt="" />
  ) : (
    <DefaultSvg />
  )

  return (
    <>
      <DasSelectorContainer
        className="das-selector-container"
        visible={needToShow}
      >
        <div className="info" onClick={() => showPopout(true)}>
          {selectedAccount && (
            <div className="account">
              {getShortString(selectedAccount.value)}
            </div>
          )}
          <div className="avatar" ref={btnRef}>
            {avatar}
          </div>
        </div>
      </DasSelectorContainer>
      <DasSelectorPopout
        visible={visible && popoutVisible}
        onVisibleChange={showPopout}
        data={data}
        root={btnRef.current}
        onSelect={handlePopoutSelect}
        selectedAccount={selectedAccount}
      />
    </>
  )
}
