<template>
  <NuxtLink 
    :to="`/tags/${slugify(tag)}`"
    :class="[
      'group inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all duration-300',
      'border border-om-sepia dark:border-om-darkGold bg-om-paperDark dark:bg-om-darkPaper text-om-ink dark:text-om-darkText',
      'hover:bg-om-sepia dark:hover:bg-om-darkGold hover:text-white hover:scale-105 hover:-rotate-1',
      'shadow-sm hover:shadow-retro',
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : '',
      size === 'lg' ? 'text-sm px-4 py-2' : ''
    ]"
  >
    <span class="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">⚜</span>
    <span>{{ tag }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  tag: string
  size?: 'sm' | 'md' | 'lg'
}>()

// Fonction pour slugifier les tags (SEO-friendly URLs)
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplacer les espaces et caractères spéciaux par -
    .replace(/^-+|-+$/g, '')         // Retirer les - en début/fin
}
</script>
