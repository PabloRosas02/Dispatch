<script setup lang="ts">
defineProps<{
  imageSrc?: string;
  altText?: string;
}>();
</script>

<template>
  <div class="postal-wrapper">
    <div class="postal-card main-polaroid">
      <div class="image-viewport">
        <img :src="imageSrc" :alt="altText" class="postal-image" />
      </div>
      <div class="postal-footer">
        <span class="postal-brand">VISIT KINSFOLK</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.postal-wrapper { 
  flex-shrink: 0; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
}
.postal-card {
  background-color: #fff; 
  padding: 16px 16px 45px 16px; 
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  border-radius: 4px; 
  width: 450px; 
  box-sizing: border-box; 
  transform: rotate(-3.5deg);
}
.image-viewport { 
  position: relative; 
  width: 100%; 
  aspect-ratio: 1/1; 
  background-color: var(--color-primary); 
  overflow: hidden; 
}
.postal-image { 
  width: 100%; 
  height: 100%; 
  object-fit: contain; 
  display: block; 
  border: 1px solid #ededed; 
}
.postal-footer { 
  margin-top: 20px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
}
.postal-brand { 
  font-family: 'Impact', 'Arial Black', sans-serif; 
  font-size: 1.3rem; 
  color: #c4c4c4; 
  letter-spacing: 1.5px; 
}

@media (max-width: 1024px) {
  .postal-card { 
    width: 100%; 
    max-width: 300px; 
    padding: 12px 12px 30px 12px; 
    margin: 0 auto; 
  }
}
</style>