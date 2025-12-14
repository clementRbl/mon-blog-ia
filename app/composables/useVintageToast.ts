import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export const useVintageToast = () => {
  const show = (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000) => {
    const id = idCounter++
    const toast: Toast = {
      id,
      message,
      type,
      visible: true
    }

    toasts.value.push(toast)

    // Auto-remove après duration
    setTimeout(() => {
      remove(id)
    }, duration)

    return id
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value[index].visible = false
      // Attendre la fin de l'animation avant de supprimer
      setTimeout(() => {
        toasts.value.splice(index, 1)
      }, 300)
    }
  }

  const success = (message: string, duration?: number) => show(message, 'success', duration)
  const error = (message: string, duration?: number) => show(message, 'error', duration)
  const info = (message: string, duration?: number) => show(message, 'info', duration)

  return {
    toasts,
    show,
    remove,
    success,
    error,
    info
  }
}
