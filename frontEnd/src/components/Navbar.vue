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
        <li><router-link :to="{ name: 'home' }">Inicio</router-link></li>
        <li><router-link :to="{ name: 'role-detail', params: { serverId: 1 } }">Roles</router-link></li>
        <li><router-link :to="{ name: 'rules-detail', params: { serverId: 1 } }">Reglas</router-link></li>
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #111;
    padding: 10px 20px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: bold;
  }
  
  .logo img {
    width: 50px;
    height: auto;
    margin-right: 10px;
  }
  
  /* Enlaces en escritorio */
  .nav-links {
    font-family: 'Exo 2', sans-serif;
    list-style: none;
    display: flex;
    gap: 25px;
    margin: 0;
    padding: 0;
  }
  
  .nav-links a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .nav-links a:hover {
    color: var(--color-accent);
  }
  
  .nav-links a.router-link-active {
    color: #63a6da;
    border-bottom: 2px solid #63a6da;
    padding-bottom: 2px;
  }
  
  /* Botón hamburguesa oculto en escritorio */
  .hamburger {
    display: none;
    font-size: 24px;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
  }
  
  /* Vista móvil */
  @media (max-width: 768px) {
    .hamburger {
      display: block;
    }
  
    .nav-links {
      position: absolute;
      top: 60px;
      right: 0;
      background-color: #111;
      flex-direction: column;
      width: 200px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
    }
  
    .nav-links.open {
      max-height: 300px; /* se expande al abrir */
    }
  
    .nav-links li {
      padding: 10px;
      text-align: right;
    }
  }
  </style>
  