<template>
  <div v-if="isFireMode" class="fire-overlay">
    <!-- Fumée épaisse en arrière-plan -->
    <div class="smoke-layer"></div>
    <div class="smoke-layer smoke-layer-2"></div>
    <div class="smoke-layer smoke-layer-3"></div>
    
    <!-- GROS FEU de forêt - Multiple couches -->
    <div class="flames-container">
      <!-- Flammes du fond (grandes) -->
      <div v-for="i in 15" :key="`back-${i}`" 
           class="flame flame-back" 
           :style="{ 
             left: `${(i * 7)}%`, 
             animationDelay: `${i * 0.15}s`,
             width: `${120 + Math.random() * 80}px`,
             height: `${300 + Math.random() * 200}px`
           }">
      </div>
      
      <!-- Flammes moyennes (intenses) -->
      <div v-for="i in 25" :key="`mid-${i}`" 
           class="flame flame-mid" 
           :style="{ 
             left: `${(i * 4)}%`, 
             animationDelay: `${i * 0.08}s`,
             width: `${80 + Math.random() * 60}px`,
             height: `${200 + Math.random() * 150}px`
           }">
      </div>
      
      <!-- Flammes premier plan (détails) -->
      <div v-for="i in 35" :key="`front-${i}`" 
           class="flame flame-front" 
           :style="{ 
             left: `${(i * 3)}%`, 
             animationDelay: `${i * 0.05}s`,
             width: `${40 + Math.random() * 40}px`,
             height: `${150 + Math.random() * 100}px`
           }">
      </div>
      
      <!-- Braises et particules -->
      <div v-for="i in 50" :key="`ember-${i}`" 
           class="ember" 
           :style="{ 
             left: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 3}s`,
             animationDuration: `${3 + Math.random() * 4}s`
           }">
      </div>
    </div>

    <!-- Badge pompier -->
    <div class="firefighter-badge" @click="toggleFire">
      🚒 INCENDIE DE FORÊT DÉTECTÉ 🔥
      <div class="badge-hint">ESC ou tap ici pour éteindre</div>
    </div>
    
    <!-- Lueur orangée globale -->
    <div class="fire-glow"></div>
  </div>
</template>

<script setup lang="ts">
const { isFireMode, toggleFireMode } = useKonamiCode()

const toggleFire = () => {
  toggleFireMode()
}
</script>

<style scoped>
.fire-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

/* Couches de fumée épaisse */
.smoke-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 120%;
  height: 120%;
  background: 
    radial-gradient(ellipse at 20% 60%, rgba(20, 20, 20, 0.95) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 40%, rgba(40, 35, 30, 0.9) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 70%, rgba(30, 25, 20, 0.92) 0%, transparent 50%),
    radial-gradient(ellipse at 10% 20%, rgba(50, 45, 40, 0.88) 0%, transparent 55%);
  animation: smokeFloat 15s ease-in-out infinite;
  filter: blur(40px);
}

.smoke-layer-2 {
  animation: smokeFloat 20s ease-in-out infinite reverse;
  animation-delay: 2s;
  opacity: 0.8;
}

.smoke-layer-3 {
  animation: smokeFloat 18s ease-in-out infinite;
  animation-delay: 4s;
  opacity: 0.7;
}

@keyframes smokeFloat {
  0%, 100% { 
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 0.85;
  }
  25% { 
    transform: translate(30px, -40px) scale(1.15) rotate(5deg);
    opacity: 0.9;
  }
  50% { 
    transform: translate(-30px, -70px) scale(1.3) rotate(-5deg);
    opacity: 0.95;
  }
  75% { 
    transform: translate(20px, -50px) scale(1.2) rotate(3deg);
    opacity: 0.88;
  }
}

/* Container des flammes */
.flames-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Flammes de fond - Grandes et massives */
.flame-back {
  position: absolute;
  bottom: -100px;
  background: linear-gradient(
    to top,
    #8B0000 0%,
    #B22222 20%,
    #DC143C 40%,
    #FF4500 60%,
    #FF8C00 80%,
    rgba(255, 200, 0, 0.3) 100%
  );
  border-radius: 45% 55% 50% 50% / 65% 65% 35% 35%;
  filter: blur(25px);
  opacity: 0.85;
  animation: flameRiseBack 3s infinite ease-in-out;
  transform-origin: bottom center;
}

@keyframes flameRiseBack {
  0% {
    transform: translateY(0) scaleY(1) scaleX(0.9) rotate(-3deg);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-150px) scaleY(1.3) scaleX(1.1) rotate(3deg);
    opacity: 0.75;
  }
  100% {
    transform: translateY(0) scaleY(1) scaleX(0.9) rotate(-3deg);
    opacity: 0.9;
  }
}

/* Flammes moyennes - Intenses et vives */
.flame-mid {
  position: absolute;
  bottom: -80px;
  background: linear-gradient(
    to top,
    #B22222 0%,
    #DC143C 15%,
    #FF4500 35%,
    #FF6347 55%,
    #FF8C00 75%,
    rgba(255, 200, 0, 0.5) 100%
  );
  border-radius: 48% 52% 45% 55% / 68% 68% 32% 32%;
  filter: blur(15px);
  opacity: 0.9;
  animation: flameRiseMid 2s infinite ease-in-out;
  transform-origin: bottom center;
}

@keyframes flameRiseMid {
  0%, 100% {
    transform: translateY(0) scaleY(1) scaleX(1) rotate(-5deg);
    opacity: 0.95;
  }
  25% {
    transform: translateY(-100px) scaleY(1.4) scaleX(0.85) rotate(8deg);
    opacity: 0.85;
  }
  50% {
    transform: translateY(-220px) scaleY(1.2) scaleX(0.9) rotate(-6deg);
    opacity: 0.75;
  }
  75% {
    transform: translateY(-120px) scaleY(1.35) scaleX(0.88) rotate(7deg);
    opacity: 0.88;
  }
}

/* Flammes premier plan - Détails et mouvement rapide */
.flame-front {
  position: absolute;
  bottom: -60px;
  background: linear-gradient(
    to top,
    #DC143C 0%,
    #FF4500 20%,
    #FF6347 40%,
    #FFA500 60%,
    #FFD700 80%,
    rgba(255, 255, 200, 0.7) 100%
  );
  border-radius: 50% 50% 48% 52% / 70% 70% 30% 30%;
  filter: blur(10px);
  opacity: 0.95;
  animation: flameRiseFront 1.5s infinite ease-in-out;
  transform-origin: bottom center;
}

@keyframes flameRiseFront {
  0%, 100% {
    transform: translateY(0) scaleY(1) scaleX(1) rotate(-8deg);
    opacity: 1;
  }
  20% {
    transform: translateY(-80px) scaleY(1.6) scaleX(0.7) rotate(12deg);
    opacity: 0.95;
  }
  40% {
    transform: translateY(-180px) scaleY(1.3) scaleX(0.85) rotate(-10deg);
    opacity: 0.85;
  }
  60% {
    transform: translateY(-280px) scaleY(0.9) scaleX(0.95) rotate(9deg);
    opacity: 0.7;
  }
  80% {
    transform: translateY(-380px) scaleY(0.6) scaleX(1.1) rotate(-7deg);
    opacity: 0.5;
  }
}

/* Braises et particules */
.ember {
  position: absolute;
  bottom: 0;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #FFD700 0%, #FF4500 50%, transparent 100%);
  border-radius: 50%;
  filter: blur(2px);
  animation: emberFloat infinite ease-in;
  opacity: 0.9;
}

@keyframes emberFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50px + 100px * var(--random, 0.5)), 
      -100vh
    ) scale(0.3);
    opacity: 0;
  }
}

/* Lueur orangée globale pour ambiance d'incendie */
.fire-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: radial-gradient(
    ellipse at 50% 100%,
    rgba(255, 69, 0, 0.4) 0%,
    rgba(220, 20, 60, 0.3) 30%,
    rgba(255, 140, 0, 0.2) 50%,
    transparent 80%
  );
  animation: glowPulse 3s ease-in-out infinite;
  pointer-events: none;
  mix-blend-mode: screen;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 0.95;
    transform: scale(1.05);
  }
}

/* Badge pompier */
.firefighter-badge {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #8B0000 100%);
  color: white;
  padding: 20px 40px;
  border-radius: 60px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  box-shadow: 
    0 15px 50px rgba(220, 20, 60, 0.8),
    inset 0 2px 10px rgba(255, 255, 255, 0.2);
  animation: badgePulse 1.5s ease-in-out infinite;
  pointer-events: auto;
  border: 4px solid #FFD700;
  text-shadow: 
    2px 2px 4px rgba(0,0,0,0.8),
    0 0 20px rgba(255, 69, 0, 0.8);
}

.badge-hint {
  font-size: 13px;
  margin-top: 8px;
  opacity: 0.95;
  font-weight: normal;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

@keyframes badgePulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    box-shadow: 
      0 15px 50px rgba(220, 20, 60, 0.8),
      inset 0 2px 10px rgba(255, 255, 255, 0.2);
  }
  50% {
    transform: translateX(-50%) scale(1.08);
    box-shadow: 
      0 20px 70px rgba(255, 69, 0, 1),
      inset 0 2px 10px rgba(255, 255, 255, 0.3);
  }
}
</style>
