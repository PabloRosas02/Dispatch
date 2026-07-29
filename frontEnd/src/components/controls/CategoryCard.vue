<script setup lang="ts">
import {
  Footprints,
  Car,
  MessagesSquare,
  Monitor,

  Backpack,
  Smartphone,
  Mic,
  Smile,
  CircleDot,

  PersonStanding,
  ArrowUp,
  ChevronDown,

  DoorOpen,
  Power,
  Lock,
  Shield,

  Volume2,
} from "lucide-vue-next";

const iconMap = {
  Footprints,
  Car,
  MessagesSquare,
  Monitor,

  Backpack,
  Smartphone,
  Mic,
  Smile,
  CircleDot,

  PersonStanding,
  ArrowUp,
  ChevronDown,

  DoorOpen,
  Power,
  Lock,
  Shield,

  Volume2,
};

interface Control {
  title: string;
  description: string;
  icon: string;
  key: string;
}

interface Category {
  title: string;
  description: string;
  icon: string;
  controls: Control[];
}

defineProps<{
  category: Category;
}>();
</script>

<template>
  <section class="category-card">
    <header class="category-header">
      <div class="category-icon">
        <component
          :is="iconMap[category.icon as keyof typeof iconMap]"
          :size="30"
        />
      </div>

      <div>
        <h2>{{ category.title }}</h2>
        <p>{{ category.description }}</p>
      </div>
    </header>

    <div class="controls-grid">
      <article
        v-for="control in category.controls"
        :key="control.title"
        class="control-card"
      >
        <div class="control-icon">
          <component
            :is="iconMap[control.icon as keyof typeof iconMap]"
            :size="26"
          />
        </div>

        <h3>{{ control.title }}</h3>

        <p>{{ control.description }}</p>

        <span class="control-key">
          {{ control.key }}
        </span>
      </article>
    </div>
  </section>
</template>
<style scoped>
.category-card {
  position: relative;

  background: linear-gradient(
    180deg,
    rgba(20, 27, 40, 0.98),
    rgba(13, 18, 29, 0.98)
  );

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 20px;

  overflow: hidden;

  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255,255,255,.03);
}

.category-card::before{
  content:"";

  position:absolute;

  left:0;
  top:0;

  width:100%;
  height:4px;

  background:var(--accent-color);
}

.category-header {
  display:flex;
  align-items:center;
  gap:1.25rem;

  padding:2rem;

  border-bottom:1px solid rgba(255,255,255,.06);
}

.category-icon {
  width:64px;
  height:64px;

  display:flex;
  align-items:center;
  justify-content:center;

  border-radius:16px;

  background:linear-gradient(
    180deg,
    rgba(255,184,77,.20),
    rgba(255,184,77,.08)
  );

  border:1px solid rgba(255,184,77,.30);

  color:#ffb84d;

  box-shadow:
      inset 0 1px 0 rgba(255,255,255,.10),
      0 8px 20px rgba(255,184,77,.15);

  flex-shrink:0;
}

.category-header h2{
  margin:0;

  font-size:1.45rem;

  font-weight:700;

  color:#ffb84d;
}

.category-header p{
  margin-top:.45rem;

  color:rgba(255,255,255,.70);

  line-height:1.6;
}

.controls-grid{
  display:grid;

  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));

  gap:1.5rem;

  padding:2rem;
}

.control-card{

  display:flex;
  flex-direction:column;

  gap:1rem;

  padding:1.7rem;

  border-radius:18px;

  background:linear-gradient(
      180deg,
      rgba(33,40,56,.92),
      rgba(22,28,42,.96)
  );

  border:1px solid rgba(255,255,255,.08);

  box-shadow:
      0 10px 22px rgba(0,0,0,.25);

  transition:
      transform .25s,
      border-color .25s,
      box-shadow .25s,
      background .25s;
}

.control-card:hover{

  transform:translateY(-6px);

  border-color:var(--accent-color);

  background:linear-gradient(
      180deg,
      rgba(38,47,66,.98),
      rgba(26,34,49,.98)
  );

  box-shadow:
      0 20px 35px rgba(0,0,0,.40),
      0 0 20px rgba(255,184,77,.12);
}

.control-icon{

  width:58px;
  height:58px;

  display:flex;
  justify-content:center;
  align-items:center;

  border-radius:15px;

  background:linear-gradient(
      180deg,
      rgba(255,184,77,.20),
      rgba(255,184,77,.08)
  );

  border:1px solid rgba(255,184,77,.28);

  color:#ffb84d;

  box-shadow:
      inset 0 1px 0 rgba(255,255,255,.08),
      0 8px 18px rgba(255,184,77,.12);

  transition:.25s;
}

.control-card:hover .control-icon{

  transform:scale(1.08);

  box-shadow:
      inset 0 1px 0 rgba(255,255,255,.12),
      0 12px 26px rgba(255,184,77,.25);
}

.control-card h3{

  margin:0;

  font-size:1.08rem;

  color:#ffb84d;
}

.control-card p{

  flex:1;

  margin:0;

  color:rgba(255,255,255,.72);

  line-height:1.6;

  font-size:.93rem;
}

.control-key{

  align-self:flex-start;

  min-width:76px;

  padding:.75rem 1rem;

  border-radius:12px;

  text-align:center;

  background:linear-gradient(
      180deg,
      #39455d,
      #242d40
  );

  border:1px solid rgba(255,255,255,.10);

  box-shadow:
      inset 0 1px 0 rgba(255,255,255,.08),
      0 8px 16px rgba(0,0,0,.30);

  color:white;

  font-weight:700;

  letter-spacing:.12em;
}

@media (max-width:768px){

  .category-header{
      padding:1.5rem;
  }

  .controls-grid{
      grid-template-columns:1fr;
      padding:1.5rem;
  }

}
</style>