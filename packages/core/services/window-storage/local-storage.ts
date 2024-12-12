import { DecoderType, EncoderType } from './types'

type Subscription<Value> = {
  key: string
  callback: SubscriptionCallback<Value>
}
type SubscriptionCallback<Value> = (value: Value, key: string) => void

export class LocalStorageService<Value> {
  protected static subscriptions: Subscription<any>[] = []

  protected storage: Window['sessionStorage'] | Window['localStorage']

  constructor(
    public readonly key: string,
    public encode: EncoderType<Value>,
    public decode: DecoderType<Value>,
    protected initializer?: (stored: Value) => Value | Promise<Value>,
  ) {
    this.storage = localStorage
    this.initialize()
  }

  protected async initialize() {
    if (this.initializer) {
      const promiseOrValue = this.initializer(this.get())

      if (promiseOrValue instanceof Promise) {
        this.remove()
      }

      this.silentSet(await promiseOrValue)
    }
  }

  protected getStorage() {
    return this.storage
  }

  protected getSubscriptions(all: boolean = false): Subscription<Value>[] {
    return LocalStorageService.subscriptions.filter(
      (s) => s.key === this.key || s.key === '_all_',
    )
  }

  public get = (): Value => {
    const value = this.getStorage().getItem(this.key)
    return this.decode(value)
  }

  protected silentRemove(): void {
    this.getStorage().removeItem(this.key)
  }

  protected silentSet(value: Value): void {
    const encodedValue = this.encode(value)

    if (encodedValue === null) {
      this.silentRemove()
      return
    }

    this.getStorage().setItem(this.key, encodedValue)
  }

  public set(value: Value): void
  public set(setter: (prev: Value) => Value): void
  public set(valueOrSetter: Value | ((prev: Value) => Value)): void {
    const value =
      valueOrSetter instanceof Function
        ? valueOrSetter(this.get())
        : valueOrSetter

    this.silentSet(value)

    this.getSubscriptions().forEach(({ callback }) => {
      callback(value, this.key)
    })
  }

  public remove = (): void => {
    this.silentRemove()

    this.getSubscriptions().forEach(({ callback }) => {
      callback(this.decode(null), this.key)
    })
  }

  public subscribe = (
    callback: SubscriptionCallback<Value>,
  ): { unsubscribe: () => void } => {
    LocalStorageService.subscriptions.push({
      key: this.key,
      callback,
    })

    return {
      unsubscribe: () => {
        const subscriptions = LocalStorageService.subscriptions.filter(
          (s) => s.callback !== callback,
        )
        LocalStorageService.subscriptions = subscriptions
      },
    }
  }

  public static subscribe = (
    callback: SubscriptionCallback<any>,
  ): { unsubscribe: () => void } => {
    LocalStorageService.subscriptions.push({
      key: '_all_',
      callback,
    })

    return {
      unsubscribe: () => {
        const subscriptions = LocalStorageService.subscriptions.filter(
          (s) => s.callback !== callback,
        )
        LocalStorageService.subscriptions = subscriptions
      },
    }
  }
}

export * from './codecs'
