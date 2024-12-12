import { KnownError } from '@core/services/error-handler'

export const verify = (check: boolean, message: string, name?: string) => {
  if (!check) {
    throw new KnownError(message, { name: name || 'VerifyError' })
  }
}
