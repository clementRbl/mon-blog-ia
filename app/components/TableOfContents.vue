<template>
  <nav v-if="headings.length > 0" aria-label="Table des matières">
    <!-- Version mobile (accordéon) -->
    <div class="lg:hidden mb-8 border-2 border-om-sepia/50 dark:border-om-darkGold/50 bg-om-paper dark:bg-om-darkPaper">
      <button 
        @click="isOpen = !isOpen"
        class="w-full flex items-center justify-between p-4 font-mono uppercase text-xs tracking-widest text-om-rust dark:text-om-darkGold hover:bg-om-paperDark dark:hover:bg-om-darkPaper transition-colors"
      >
        <span class="flex items-center gap-2">
          <Icon name="mdi:format-list-numbered" size="16" aria-hidden="true" />
          Sommaire
        </span>
        <Icon :name="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="20" aria-hidden="true" />
      </button>
      
      <div v-show="isOpen" class="border-t border-om-sepia/30 dark:border-om-darkGold/30 p-4">
        <ul class="space-y-1">
          <li v-for="heading in headings" :key="heading.id">
            <a 
              :href="`#${heading.id}`"
              @click.prevent="scrollToHeading(heading.id); isOpen = false"
              :class="[
                'block py-2 px-3 text-sm transition-colors rounded',
                activeHeading === heading.id 
                  ? 'text-om-rust dark:text-om-darkGold font-bold bg-om-rust/10 dark:bg-om-darkGold/10'
                  : 'text-om-ink/70 dark:text-om-darkText/70 hover:text-om-rust dark:hover:text-om-darkGold hover:bg-om-sepia/5 dark:hover:bg-om-darkSepia/5'
              ]"
            >
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Version desktop (sidebar) -->
    <div class="hidden lg:block sticky top-24 w-64 border-2 border-om-sepia/50 dark:border-om-darkGold/50 bg-om-paper/50 dark:bg-om-darkPaper/50 backdrop-blur-sm p-4 shadow-sm self-start">
      <h2 class="font-mono uppercase text-xs tracking-widest text-om-rust dark:text-om-darkGold mb-3 pb-2 border-b border-om-sepia/30 dark:border-om-darkGold/30">
        Sommaire
      </h2>
      
      <ul class="space-y-1">
        <li v-for="heading in headings" :key="heading.id">
          <a 
            :href="`#${heading.id}`"
            @click.prevent="scrollToHeading(heading.id)"
            :class="[
              'block py-1.5 px-2 text-sm transition-colors rounded',
              activeHeading === heading.id 
                ? 'text-om-rust dark:text-om-darkGold font-bold bg-om-rust/10 dark:bg-om-darkGold/10'
                : 'text-om-ink/70 dark:text-om-darkText/70 hover:text-om-rust dark:hover:text-om-darkGold hover:bg-om-sepia/5 dark:hover:bg-om-darkSepia/5'
            ]"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Heading {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  content: string
}>()

const headings = ref<Heading[]>([])
const activeHeading = ref<string>('')
const isOpen = ref(false)

// Extraire les titres du contenu HTML et ajouter les IDs
const extractHeadings = () => {
  if (!props.content) return

  // Attendre que le DOM soit prêt
  nextTick(() => {
    // Sélectionner tous les H2 dans le contenu de l'article
    const articleContent = document.querySelector('[itemprop="articleBody"]')
    if (!articleContent) return
    
    const elements = articleContent.querySelectorAll('h2')
    
    headings.value = Array.from(elements).map((el) => {
      const text = el.textContent || ''
      const level = 2
      
      // Générer un ID
      const id = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      // Ajouter l'ID directement à l'élément
      if (!el.id) {
        el.id = id
      }
      
      return { id, text, level }
    })
  })
}

// Scroll vers un heading
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const headerHeight = 120 // Header + padding
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Observer pour détecter le heading actif pendant le scroll
let observer: IntersectionObserver | null = null

const observeHeadings = () => {
  if (typeof window === 'undefined') return

  // Disconnect l'ancien observer s'il existe
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeHeading.value = entry.target.id
        }
      })
    },
    {
      rootMargin: '-100px 0px -80% 0px'
    }
  )

  // Observer tous les headings
  headings.value.forEach(({ id }) => {
    const element = document.getElementById(id)
    if (element && observer) {
      observer.observe(element)
    }
  })
}

// Cleanup
onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})

// Initialisation
onMounted(() => {
  // Double nextTick pour s'assurer que tout est rendu
  nextTick(() => {
    extractHeadings()
    setTimeout(() => {
      observeHeadings()
    }, 100)
  })
})

// Re-extraire si le contenu change
watch(() => props.content, () => {
  nextTick(() => {
    extractHeadings()
    setTimeout(() => {
      observeHeadings()
    }, 100)
  })
})
</script>
