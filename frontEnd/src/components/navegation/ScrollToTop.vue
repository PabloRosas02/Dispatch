<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from "vue";

const visible = ref(false);

const toggleVisibility = () => {
  visible.value = window.scrollY > 500;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();
});

onUnmounted(() => {
  window.removeEventListener("scroll", toggleVisibility);
});
</script>

<template>
  <Transition name="scroll-button">
    <button
      v-if="visible"
      class="scroll-top"
      @click="scrollToTop"
      aria-label="Volver arriba"
    >
      <ArrowUp :size="22" color="#d4af37" />
    </button>
  </Transition>
</template>
<style scoped>
.scroll-top {
  position: fixed;

  right: 24px;
  bottom: 24px;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;
  border: 1px solid rgba(212, 175, 55, .25);

  background:
    linear-gradient(
      180deg,
      rgba(28, 35, 48, .92),
      rgba(16, 21, 31, .95)
    );

  backdrop-filter: blur(10px);

  color: var(--accent-color);

  cursor: pointer;

  box-shadow:
    0 10px 24px rgba(0,0,0,.35),
    inset 0 1px 0 rgba(255,255,255,.05);

  transition:
    transform .25s ease,
    box-shadow .25s ease,
    border-color .25s ease,
    background .25s ease;

  z-index: 1000;
}

.scroll-top:hover {
  transform: translateY(-4px);

  border-color: rgba(212,175,55,.55);

  background:
    linear-gradient(
      180deg,
      rgba(38,46,61,.96),
      rgba(24,30,42,.98)
    );

  box-shadow:
    0 18px 40px rgba(0,0,0,.45),
    0 0 18px rgba(212,175,55,.18);
}

.scroll-top:active {
  transform: scale(.94);
}

.scroll-top:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 3px;
}

.scroll-button-enter-active,
.scroll-button-leave-active {
  transition:
    opacity .25s ease,
    transform .25s ease;
}

.scroll-button-enter-from,
.scroll-button-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(.9);
}

.scroll-button-enter-to,
.scroll-button-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}


@media (max-width:768px) {
  .scroll-top {
    width: 46px;
    height: 46px;

    right: 16px;
    bottom: 16px;
  }
}
</style>