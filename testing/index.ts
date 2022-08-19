export function ExpectRenderErrors<T extends unknown[]>(
  fn: (...args: T) => unknown,
) {
  return (...args: T) => {
    const spy = vi.spyOn(global.console, 'error').mockImplementation(() => null)

    try {
      return fn(...args)
    } finally {
      spy.mockRestore()
    }
  }
}
