/* eslint-disable no-void */
/* eslint-disable node/no-callback-literal */
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
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
import { verifyDasAddress, debounce } from '../../utils'
import { useDas } from '../../hooks/usdDas'
import { ReactComponent as CheckoutSvg } from '../../assets/svg/das-checkout.svg'

export interface DasSelectorProps {
  visible: boolean
  url: string
  onSelect: (selectedAccount: AccountRecord | null) => void
  selectedAccount: AccountRecord | null
}

export interface DasSelectorPopoutProps {
  visible: boolean
  data?: AccountRecord[]
  root: HTMLElement | null
  onSelect: (selectedAccount: AccountRecord | null) => void
  selectedAccount: AccountRecord | null
  onVisibleChange: (visible: boolean) => void
}

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
        .records(url)
        .then((resp) => {
          if (currentValue === url) {
            resolve(
              resp.filter(
                (record) => filterKeys.includes(record.key) && record.label
              )
            )
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
  const [left, setLeft] = useState(0)
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
    const [rootLeft, rootTop] = getElementPagePosition(root)
    setLeft(rootLeft + 11 - 15)
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
            {data.map((record) => (
              <div
                className="record"
                key={record.key}
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
          <div className="triangle" style={{ left }} />
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
    }
  )

  const needToShow = useMemo(() => visible && verifyDasAddress(url), [
    visible,
    url,
  ])

  const avatar = loading ? (
    <CircularProgress size={16} className="loading" />
  ) : selectedAccount ? (
    <img src={selectedAccount.avatar} alt="" />
  ) : (
    <span>?</span>
  )

  return (
    <>
      <DasSelectorContainer
        className="das-selector-container"
        visible={needToShow}
      >
        <div className="info" onClick={() => data && showPopout(true)}>
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
