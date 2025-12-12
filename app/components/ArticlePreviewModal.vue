<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-5xl max-h-[90vh] bg-om-paper dark:bg-om-darkBg border-4 border-om-dark dark:border-om-darkGold shadow-2xl overflow-hidden flex flex-col"
          >
            <!-- Header -->
            <div class="bg-om-rust dark:bg-om-darkGold text-white px-6 py-4 border-b-4 border-om-dark dark:border-om-darkText flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-3">
                <Icon name="mdi:eye" size="24" />
                <h3 class="font-mono text-sm uppercase tracking-wider">
                  Prévisualisation{{ !article?.published ? ' - Article non publié' : '' }}
                </h3>
              </div>
              <button
                @click="close"
                class="p-2 hover:bg-white/20 rounded transition-colors"
                aria-label="Fermer"
              >
                <Icon name="mdi:close" size="24" />
              </button>
            </div>

            <!-- Contenu avec scroll -->
            <div class="overflow-y-auto flex-1 p-8">
              <article v-if="article" class="max-w-3xl mx-auto" itemscope itemtype="https://schema.org/BlogPosting">
                <!-- En-tête de l'article -->
                <header class="mb-12 pb-8 border-b-2 border-om-dark dark:border-om-darkGold">
                  <div class="flex gap-2 mb-4 flex-wrap">
                    <TagBadge v-for="tag in article.tags" :key="tag" :tag="tag" />
                  </div>
                  
                  <h1 class="font-serif text-3xl md:text-5xl font-black mb-4 leading-tight text-om-dark dark:text-om-darkText">
                    {{ article.title }}
                  </h1>
                  
                  <div class="flex items-center gap-4 text-sm text-om-ink/70 dark:text-om-darkText/70">
                    <time class="font-mono text-om-rust dark:text-om-darkGold font-bold" :datetime="new Date(article.date).toISOString()">
                      {{ new Date(article.date).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) }}
                    </time>
                    <span v-if="article.reading_time" class="flex items-center gap-1 font-mono">
                      <Icon name="mdi:clock-outline" size="16" />
                      {{ article.reading_time }} min de lecture
                    </span>
                  </div>
                </header>

                <!-- Contenu de l'article -->
                <div class="prose prose-lg max-w-none
                  prose-headings:font-serif prose-headings:font-bold prose-headings:text-om-dark dark:prose-headings:text-om-darkText
                  prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                  prose-p:text-om-ink/90 dark:prose-p:text-om-darkText/90 prose-p:leading-relaxed prose-p:font-sans
                  prose-a:text-om-sepia dark:prose-a:text-om-darkSepia prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2 hover:prose-a:text-om-rust dark:hover:prose-a:text-om-darkGold
                  prose-code:bg-om-paperDark dark:prose-code:bg-om-darkPaper prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-om-ink dark:prose-code:text-om-darkText
                  prose-pre:bg-om-paperDark dark:prose-pre:bg-om-darkPaper prose-pre:border-2 prose-pre:border-om-sepia dark:prose-pre:border-om-darkGold prose-pre:shadow-paper
                  prose-blockquote:border-l-4 prose-blockquote:border-om-rust dark:prose-blockquote:border-om-darkGold prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-om-ink/80 dark:prose-blockquote:text-om-darkText/80
                  prose-img:border-2 prose-img:border-om-dark dark:prose-img:border-om-darkGold prose-img:shadow-paper
                  prose-strong:text-om-dark dark:prose-strong:text-om-darkText prose-strong:font-bold
                  prose-ul:text-om-ink/90 dark:prose-ul:text-om-darkText/90 prose-ol:text-om-ink/90 dark:prose-ol:text-om-darkText/90 prose-li:text-om-ink/90 dark:prose-li:text-om-darkText/90"
                  v-html="htmlContent">
                </div>
              </article>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{
  isOpen: boolean
  article: any
}>()

const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}

// Parser le Markdown en HTML
const htmlContent = computed(() => {
  if (!props.article?.content) return ''
  try {
    return marked.parse(props.article.content)
  } catch (e) {
    console.error('Erreur parsing Markdown:', e)
    return props.article.content
  }
})

// Empêcher le scroll du body quand la modal est ouverte
watch(() => props.isOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Nettoyer au démontage
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})

// Fermer avec Escape
onMounted(() => {
  if (process.client) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.isOpen) {
        close()
      }
    }
    window.addEventListener('keydown', handleEscape)
    onUnmounted(() => {
      window.removeEventListener('keydown', handleEscape)
    })
  }
})
</script>
