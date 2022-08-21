export interface PolicyResult {
  name: string
  allowed: boolean
  redirect?: string
}

export type Policy = () => PolicyResult
export type RoutePolicy = () => Required<PolicyResult>
export type PolicyGroup = { [key: string]: Policy }
