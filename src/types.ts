export type PolicyResult = { allowed: boolean }
export type Policy = () => PolicyResult
