import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router'

export const RouterContext = React.createContext({
  to: '',
  from: '',
})

export interface Routes {
  from: string
  to: string
}

export const useRoute = (): Routes => {
  return useContext(RouterContext)
}

export const RouterProvider: React.FC = ({ children }) => {
  const location = useLocation()
  const [route, setRoute] = useState<Routes>({
    to: location.pathname + location.search,
    from: location.pathname + location.search,
  })

  useEffect(() => {
    setRoute((prev) => ({
      to: location.pathname + location.search,
      from: prev.to,
    }))
  }, [location])

  return (
    <RouterContext.Provider value={route}>{children}</RouterContext.Provider>
  )
}
