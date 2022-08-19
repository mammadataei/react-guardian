import { Policy } from '../types'
import { createContext, PropsWithChildren, useContext } from 'react'

type PolicyGroup = { [key: string]: Policy }

interface PolicyProviderProps {
  policies: PolicyGroup
}

const PolicyContext = createContext<PolicyGroup | undefined>(undefined)

export function PolicyProvider(props: PropsWithChildren<PolicyProviderProps>) {
  const { children, policies } = props

  return (
    <PolicyContext.Provider value={policies}>{children}</PolicyContext.Provider>
  )
}

PolicyProvider.displayName = 'PolicyProvider'

export function usePolicies() {
  return useContext(PolicyContext)
}
