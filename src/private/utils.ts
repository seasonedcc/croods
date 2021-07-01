const sleep = (timeout = 0): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, timeout))

type FailedAttempt = [string, null]
type OkAttempt<T> = [null, T]

const attempt = async <T = any>(
  callback: () => Promise<T>,
): Promise<FailedAttempt | OkAttempt<T>> => {
  try {
    const result = await callback()
    return [null, result]
  } catch (err: unknown) {
    if (typeof err === 'string') {
      console.error(err)
      return [err, null]
    }
    if (err instanceof Error) {
      console.error(err.message)
      return [err.message, null]
    }
    return ['Failed attempt', null]
  }
}

export { attempt, sleep }
export type { FailedAttempt, OkAttempt }
