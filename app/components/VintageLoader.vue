<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-om-paper dark:bg-om-darkBg">
    <div class="flex flex-col items-center gap-4 md:gap-6 animate-fade-in px-4">
      <!-- Logo/Icône animé -->
      <div class="relative">
        <!-- Cercle extérieur qui pulse -->
        <div class="absolute inset-0 rounded-full border-2 md:border-4 border-om-gold dark:border-om-darkGold animate-ping opacity-75"></div>
        
        <!-- Cercle intérieur qui tourne -->
        <div class="relative w-16 h-16 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-om-sepia/20 dark:border-om-darkGold/20 border-t-om-gold dark:border-t-om-darkGold animate-spin"></div>
        
        <!-- Symbole central -->
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-3xl md:text-4xl text-om-gold dark:text-om-darkGold animate-pulse">⚜</span>
        </div>
      </div>

      <!-- Texte de chargement avec effet typewriter -->
      <div class="font-serif text-xl md:text-2xl lg:text-3xl text-om-dark dark:text-om-darkText text-center">
        <span class="inline-block animate-fade-in-up">Chargement</span>
        <span class="inline-block animate-bounce-dot animation-delay-100">.</span>
        <span class="inline-block animate-bounce-dot animation-delay-200">.</span>
        <span class="inline-block animate-bounce-dot animation-delay-300">.</span>
      </div>

      <!-- Citation ou tagline -->
      <p class="font-mono text-xs md:text-sm text-om-ink/60 dark:text-om-darkText/60 animate-fade-in animation-delay-500 text-center max-w-xs md:max-w-md">
        Préparation pour une expérience inoubliable...
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-dot {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-bounce-dot {
  animation: bounce-dot 1.4s ease-in-out infinite;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}
</style>
