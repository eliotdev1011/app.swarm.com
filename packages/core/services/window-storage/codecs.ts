import { DecoderType, EncoderType } from './types'

// Factories to generate type safe codecs
function encoderFactory<Value>(
  encoder: EncoderType<Value>,
): () => EncoderType<Value> {
  return () => {
    return encoder
  }
}
function decoderFactory<Value, DefaultValue>(
  decoder: (value: string) => Value,
): (defaultValue: DefaultValue) => DecoderType<Value | DefaultValue> {
  return (defaultValue) => {
    return (value: string | null) => {
      if (value === null) {
        return defaultValue
      }

      return decoder(value)
    }
  }
}

// Additional proxy types required for codecs type inference to work
type FullInferenceEncoderProxy = <Value>() => EncoderType<Value>
type FullInferenceDecoderProxy = <Value, DefaultValue extends Value>(
  defaultValue: DefaultValue,
) => DecoderType<Value>

type TypedEncoderProxy<Value> = () => EncoderType<Value>
type TypedDecoderProxy<Value> = <DefaultValue>(
  defaultValue: DefaultValue,
) => DecoderType<Value | DefaultValue>

// JSON codec
export const jsonEncoder: FullInferenceEncoderProxy = encoderFactory(
  (value) => {
    if (value === null) {
      return null
    }
    return JSON.stringify(value)
  },
)
export const jsonDecoder: FullInferenceDecoderProxy = decoderFactory(
  (value) => {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  },
)

// String codec
export const stringEncoder: TypedEncoderProxy<string | null> = encoderFactory(
  (value) => {
    return value
  },
)
export const stringDecoder: TypedDecoderProxy<string> = decoderFactory(
  (value) => {
    return value
  },
)

// Number codec
export const numberEncoder: TypedEncoderProxy<number | null> = encoderFactory(
  (value) => {
    if (value === null) {
      return null
    }
    return String(value)
  },
)
export const numberDecoder: TypedDecoderProxy<number> = decoderFactory(Number)

// Boolean codec
export const booleanEncoder: TypedEncoderProxy<boolean | null> = encoderFactory(
  (value) => {
    return value ? 'true' : 'false'
  },
)
export const booleanDecoder: TypedDecoderProxy<boolean> = decoderFactory(
  (value) => {
    return value === 'true'
  },
)

// Array codec
export const arrayEncoder: FullInferenceEncoderProxy = encoderFactory(
  (value) => {
    if (value === null) {
      return null
    }
    return JSON.stringify(value)
  },
)
export const arrayDecoder: FullInferenceDecoderProxy = decoderFactory(
  (value) => {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  },
)
