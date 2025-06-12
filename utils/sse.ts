export const onEvent = <
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
>(
  eventSource: EventSource,
  event: keyof T & string,
  handler: (data: T[typeof event], e: MessageEvent<T[typeof event]>) => void | Promise<void>,
) => {
  eventSource.addEventListener(event, (e: MessageEvent<T[typeof event]>) => {
    const parsedData = JSON.parse(e.data)
    handler(parsedData, e)
  })
}
