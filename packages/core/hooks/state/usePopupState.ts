import { createElement, FunctionComponent, useCallback, useMemo } from 'react'
import { BehaviorSubject } from 'rxjs'

import { waitUntil } from '@core/shared/utils/helpers'

import useObservable from '../rxjs/useObservable'

export interface BasicModalProps {
  isOpen?: boolean
  onClose?: () => void
}

/**
 * @typedef {Object} PopupState
 * @property {boolean} isOpen - The state of the popup
 * @property {() => Promise<void>)} prompt - Opens the popup and resolves when it is closed
 * @property {() => void)} open - Opens the popup
 * @property {() => void)} close - Closes the popup
 * @property {React.ReactNode} modal - The modal component
 */

/**
 * Provides useful helpers to deal with popups
 * In particular the method `prompt` which returns a promise and waits for the popup to close
 *
 * @param {boolean} [initialState=false] - The initial state of the popup
 * @param {FunctionComponent<T>} [ModalComponent] - The modal component
 * @returns {PopupState}
 */
const usePopupState = <T extends BasicModalProps>(
  initialState = false,
  ModalComponent?: FunctionComponent<T>,
) => {
  /**
   * This observable emits every time the popup opens or closes
   */
  const props$ = useMemo(
    () =>
      new BehaviorSubject<T>({
        isOpen: initialState,
      } as T),
    [initialState],
  )

  const props = useObservable(
    props$,
    useMemo(() => props$.getValue(), [props$]),
  )

  const close = useCallback(
    () =>
      props$.next({
        ...props$.getValue(),
        isOpen: false,
      }),
    [props$],
  )

  const open = useCallback(
    (newProps?: Omit<T, 'isOpen' | 'onClose'>) =>
      props$.next({
        ...(newProps ?? props$.getValue()),
        isOpen: true,
        onClose: () => props$.next({ ...props$.getValue(), isOpen: false }),
      } as T),
    [props$],
  )

  /**
   * Opens the popup (state$ emits isOpen=true)
   * Then waits for it to close (when state$ emits isOpen=false)
   */
  const prompt = useCallback(
    (newProps?: T) => {
      open(newProps)
      return waitUntil(props$, ({ isOpen }) => !isOpen)
    },
    [open, props$],
  )

  const modal = useMemo(() => {
    if (ModalComponent) {
      return createElement(ModalComponent, props)
    }

    return null
  }, [ModalComponent, props])

  return useMemo(() => {
    return {
      isOpen: props.isOpen ?? false,
      modal,
      prompt,
      close,
      open,
    }
  }, [props.isOpen, modal, prompt, close, open])
}

export default usePopupState
