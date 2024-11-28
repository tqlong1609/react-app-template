import { useEffect, useRef, useState, useTransition } from 'react'

export const useServerAction = <P extends any[], R>(
  action: (...args: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void,
): [(...args: P) => Promise<R | undefined>, { isPending: boolean; result: R | undefined }] => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<R>()
  const [finished, setFinished] = useState(false)
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>()
  const rejecter = useRef<(reason?: any) => void>()

  useEffect(() => {
    if (!finished) return

    if (onFinished) onFinished(result)
    resolver.current?.(result)
  }, [result, finished])

  const runAction = async (...args: P): Promise<R | undefined> => {
    startTransition(() => {
      action(...args)
        .then((data) => {
          setResult(data)
          setFinished(true)
        })
        .catch((error) => {
          rejecter.current?.(error)
        })
    })

    return new Promise((resolve, reject) => {
      resolver.current = resolve
      rejecter.current = reject
    })
  }

  return [runAction, { isPending, result }]
}
