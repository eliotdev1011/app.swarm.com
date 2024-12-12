import { LocalStorageService } from './local-storage'

export type EncoderType<T> = (value: T) => string | null
export type DecoderType<T> = (value: string | null) => T

export class SessionStorageService<Value> extends LocalStorageService<Value> {
  constructor(
    public readonly key: string,
    public encode: EncoderType<Value>,
    public decode: DecoderType<Value>,
  ) {
    super(key, encode, decode)
    this.storage = sessionStorage
  }
}
