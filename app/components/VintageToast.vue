<template>
  <Teleport to="body">
    <div class="vintage-toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :data-toast-id="toast.id"
          :class="[
            'vintage-toast',
            `vintage-toast-${toast.type}`,
            { 'visible': toast.visible }
          ]"
        >
          <!-- En-tête télégramme -->
          <div class="toast-header">
            <span class="toast-label">{{ getLabel(toast.type) }}</span>
            <button 
              @click="remove(toast.id)" 
              class="toast-close"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          <!-- Ligne décorative -->
          <div class="toast-divider"></div>

          <!-- Message avec effet machine à écrire -->
          <div class="toast-message">
            <span class="typewriter-toast"></span>
          </div>

          <!-- Badge vintage -->
          <div class="toast-badge">
            <Icon :name="getIcon(toast.type)" size="20" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useVintageToast()
const processedToasts = ref<Set<number>>(new Set())

const getLabel = (type: string) => {
  const labels = {
    success: 'SUCCÈS',
    error: 'ERREUR',
    info: 'INFORMATION'
  }
  return labels[type as keyof typeof labels] || 'MESSAGE'
}

const getIcon = (type: string) => {
  const icons = {
    success: 'mdi:check-circle',
    error: 'mdi:alert-circle',
    info: 'mdi:information'
  }
  return icons[type as keyof typeof icons] || 'mdi:information'
}

// Fonction machine à écrire réaliste
const typeWriter = (text: string, element: HTMLElement) => {
  let charIndex = 0
  element.textContent = ''
  
  const getTypingDelay = (char: string, nextChar?: string) => {
    let delay = Math.random() * 50 + 40 // 40-90ms de base
    
    // Pauses après ponctuation
    if (char === '.' || char === '!' || char === '?') delay = Math.random() * 200 + 300 // 300-500ms
    else if (char === ',' || char === ';' || char === ':') delay = Math.random() * 100 + 150 // 150-250ms
    
    // Accélération sur les voyelles qui se suivent
    const vowels = 'aeiouyéèêëàâäôöùûüîï'
    if (vowels.includes(char.toLowerCase()) && nextChar && vowels.includes(nextChar.toLowerCase())) {
      delay *= 0.7
    }
    
    // Hésitations aléatoires (5% de chance)
    if (Math.random() < 0.05) delay += Math.random() * 200 + 100
    
    return delay
  }
  
  const type = () => {
    if (charIndex < text.length) {
      element.textContent += text.charAt(charIndex)
      const nextChar = text.charAt(charIndex + 1)
      const delay = getTypingDelay(text.charAt(charIndex), nextChar)
      charIndex++
      setTimeout(type, delay)
    }
  }
  
  type()
}

// Fonction pour initialiser l'effet machine à écrire sur un toast
const initTypewriter = async (toastId: number, message: string) => {
  if (processedToasts.value.has(toastId)) return
  
  await nextTick()
  const element = document.querySelector(`[data-toast-id="${toastId}"] .typewriter-toast`) as HTMLElement
  
  if (element) {
    processedToasts.value.add(toastId)
    // Petit délai pour laisser l'animation d'entrée se faire
    setTimeout(() => {
      typeWriter(message, element)
    }, 300)
  }
}

// Observer les nouveaux toasts (sans immediate pour éviter la ré-exécution)
watch(() => toasts.value.length, () => {
  toasts.value.forEach(toast => {
    if (toast.visible && !processedToasts.value.has(toast.id)) {
      initTypewriter(toast.id, toast.message)
    }
  })
}, { immediate: false })

// Nettoyer les toasts traités qui n'existent plus
watch(() => toasts.value, (newToasts) => {
  const currentIds = new Set(newToasts.map(t => t.id))
  const toRemove = Array.from(processedToasts.value).filter(id => !currentIds.has(id))
  toRemove.forEach(id => processedToasts.value.delete(id))
}, { deep: true })
</script>

<style scoped>
.vintage-toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.vintage-toast {
  position: relative;
  min-width: 320px;
  max-width: 400px;
  padding: 16px 20px;
  background: #F5E6D3;
  border: 3px solid #3D2B1F;
  box-shadow: 
    4px 4px 0px rgba(61, 43, 31, 0.3),
    8px 8px 0px rgba(139, 115, 85, 0.15);
  pointer-events: auto;
  font-family: 'Courier New', monospace;
  opacity: 0;
  transform: translateX(400px) rotate(3deg);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.vintage-toast.visible {
  opacity: 1;
  transform: translateX(0) rotate(0deg);
}

.vintage-toast::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(139, 115, 85, 0.1) 2px,
    rgba(139, 115, 85, 0.1) 4px
  );
  pointer-events: none;
}

.toast-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.toast-label {
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #3D2B1F;
  text-transform: uppercase;
}

.toast-close {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: #3D2B1F;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.toast-close:hover {
  transform: scale(1.2) rotate(90deg);
}

.toast-divider {
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    #3D2B1F 0px,
    #3D2B1F 4px,
    transparent 4px,
    transparent 8px
  );
  margin-bottom: 12px;
}

.toast-message {
  font-size: 14px;
  line-height: 1.6;
  color: #3D2B1F;
  padding-right: 40px;
  min-height: 24px;
}

.typewriter-toast {
  display: inline;
  white-space: pre-wrap;
  word-break: break-word;
}

.toast-badge {
  position: absolute;
  bottom: -12px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #3D2B1F;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.vintage-toast-success .toast-badge {
  background: #8FBC8F;
  color: #2F4F2F;
}

.vintage-toast-error .toast-badge {
  background: #CD5C5C;
  color: #8B0000;
}

.vintage-toast-info .toast-badge {
  background: #B0C4DE;
  color: #4682B4;
}

/* Animations de transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(400px) rotate(5deg);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(400px) rotate(-5deg) scale(0.8);
}

.toast-move {
  transition: transform 0.4s ease;
}

/* Mode sombre */
.dark .vintage-toast {
  background: #2C2416;
  border-color: #D4B574;
  color: #F5E6D3;
  box-shadow: 
    4px 4px 0px rgba(212, 181, 116, 0.3),
    8px 8px 0px rgba(184, 153, 104, 0.15);
}

.dark .toast-label,
.dark .toast-close,
.dark .toast-message {
  color: #F5E6D3;
}

.dark .toast-divider {
  background: repeating-linear-gradient(
    90deg,
    #D4B574 0px,
    #D4B574 4px,
    transparent 4px,
    transparent 8px
  );
}

.dark .toast-badge {
  border-color: #D4B574;
}
</style>
