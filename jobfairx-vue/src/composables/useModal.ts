/**
 * useModal
 *
 * Tiny global modal registry. A page (or sub-component) calls
 * `open('msg', { candidate })` and any <BaseModal name="msg"> mounted
 * somewhere in the tree will read its props from `payload` and show.
 *
 * This replaces the HTML prototype's pattern of `document.getElementById(id).style.display = 'flex'`
 * with reactive state, and is the seam where future modal additions plug in.
 *
 * Modal names are typed loosely as strings rather than a union so that
 * stub modals can register without expanding a central enum. The fully
 * built modals in this sample are: 'message', 'resume', 'decline'.
 */

import { ref } from 'vue'

export type ModalName = string

interface ModalState {
  name: ModalName | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>
}

const state = ref<ModalState>({ name: null, payload: {} })

export function useModal() {
  const open = (name: ModalName, payload: Record<string, unknown> = {}): void => {
    state.value = { name, payload }
  }

  const close = (): void => {
    state.value = { name: null, payload: {} }
  }

  const isOpen = (name: ModalName): boolean => state.value.name === name

  return {
    state,
    open,
    close,
    isOpen,
  }
}
