<template>
    <nav class="navbar">
      <div class="logo">
        <img :src="Logo" alt="Logo" />
      </div>
  
      <!-- Botón hamburguesa -->
      <button class="hamburger" @click="toggleMenu">
        ☰
      </button>
  
      <!-- Enlaces -->
      <ul class="nav-links" :class="{ open: isOpen }">
        <li>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'home' }"
          >
            Inicio
          </router-link>
        </li>

        <li>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'role-detail', params: { serverId: 'leo' } }"
          >
            Roles
          </router-link>
        </li>

        <li>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'rules-detail', params: { serverId: 'leo' } }"
          >
            Reglas
          </router-link>
        </li>
        <li>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'housing' }"
          >
            Housing
          </router-link>
        </li>
        <li>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'controls' }"
          >
            Controles
          </router-link>
        </li>
        <li>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'news' }"
          >
            Noticias
          </router-link>
        </li>
      </ul>
    </nav>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  import Logo from "@/assets/icons/Logo.svg";
  
  const isOpen = ref(false);
  const toggleMenu = () => {
    isOpen.value = !isOpen.value;
  };
  </script>
  
  <style scoped>
 .navbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(6, 15, 22, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border-bottom: 1px solid rgba(99, 166, 218, 0.15);

  padding: 10px 20px;
  z-index: 9999;
}

.logo img {
  width: 50px;
  display: block;
}

/* =========================
   ESCRITORIO
   ========================= */

.nav-links {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 2rem;

  margin: 0;
  padding: 0;

  list-style: none;
  font-family: "Exo 2", sans-serif;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--color-secondary);
}

.nav-links a.router-link-active {
  color: var(--color-accent);
  border-bottom: 2px solid var(--color-accent);
}

.hamburger {
  display: none;

  background: none;
  border: none;

  color: white;
  font-size: 28px;

  cursor: pointer;
}

/* =========================
   MÓVIL
   ========================= */

@media (max-width: 768px) {

  .hamburger {
    display: block;
  }

  .nav-links {
    position: absolute;
    top: calc(100% + 8px);
    right: 12px;

    width: 220px;

    display: flex;
    flex-direction: column;
    gap: 0;
    flex: none;

    margin: 0;
    padding: 0;

    background: rgba(27, 27, 27, 0.98);
    backdrop-filter: blur(12px);

    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,.4);

    max-height: 0;
    overflow: hidden;

    z-index: 1000;

    transition: max-height .3s ease;
  }

  .nav-links.open {
    max-height: 400px;
  }

  .nav-links li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .nav-links li:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,.08);
  }

  .nav-links a {
    display: flex;
    align-items: center;

    width: 100%;
    min-height: 56px;

    padding: 0 18px;
    box-sizing: border-box;

    color: white;
    text-decoration: none;

    transition:
      background-color .2s ease,
      color .2s ease;
  }

  .nav-links a:hover,
  .nav-links a:focus {
    background: rgba(99,166,218,.15);
  }

  .nav-links a.router-link-active {
    background: rgba(99,166,218,.18);
    color: #63a6da;
    border-bottom: none;
  }
}
  </style>
  