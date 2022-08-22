export function error(msg: string): never {
  throw new Error('[React Guardian]: ' + msg)
}

export function warn(msg: string) {
  console.warn('[React Guardian]: ' + msg)
}
