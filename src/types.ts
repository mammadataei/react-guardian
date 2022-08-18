export interface PolicyResult {
  name: string
  allowed: boolean
}

export type Policy = () => PolicyResult
