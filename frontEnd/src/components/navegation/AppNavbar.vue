<template>
    <nav class="navbar">
      <routerLink class="logo" :to="{ name: 'home' }" >
        <img :src="Logo" alt="Logo" />
      </routerLink>

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
            :to="{ name: 'rules-index' }"
          >
            Normativas
          </router-link>
        </li>
        <li>
          <router-link
            @click="isOpen = false"
            :to="{ name: 'housing-home' }"
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
  import Logo from "/icons/Logo.svg";

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

@media (max-width:768px){

  .hamburger{

    display:flex;
    align-items:center;
    justify-content:center;

    width:44px;
    height:44px;

    padding:0;

    border:none;
    border-radius:12px;

    background:rgba(255,255,255,.05);

    color:var(--color-light);

    font-size:26px;

    cursor:pointer;

    transition:
      background .25s ease,
      color .25s ease,
      transform .25s ease;
  }

  .hamburger:hover{

    background:rgba(236,175,68,.15);

    color:var(--color-accent);
  }

  .hamburger:active{

    transform:scale(.95);

  }

  /* ===================== */
 .nav-links {
    position: absolute;   /* antes estaba fixed */
     top:calc(100% + 10px);           /* justo debajo de la navbar */
    right: 12px;

    z-index: 999999;
    width: 240px;

    display: flex;
    flex-direction: column;

    margin: 0;
    padding: 0;
    gap: 2px;

    max-height: 0;
    list-style: none;

    background: rgba(8,18,27,.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;

    box-shadow: 0 15px 40px rgba(0,0,0,.45);

    opacity: 0;
    visibility: hidden;

    transform: translateY(0);
    overflow: hidden;

    transition:
      opacity .25s ease,
      transform .25s ease,
      max-height .25s ease,
      visibility .25s ease;
  }

  .nav-links.open {
    padding: 8px;
    max-height:calc(100vh - 90px);

    overflow-y:auto;
    overflow-x:hidden;

    padding:8px;

    opacity: 1;
    visibility: visible;

    transform: translateY(0);
}

  /* ===================== */

 /* ===================== */
/* ITEMS */
/* ===================== */

.nav-links li{
  list-style:none;
  margin:2px 0;
}

.nav-links a{

  position:relative;

  display:flex;
  align-items:center;

  height:44px;
  padding: 0 16px;

  border-radius:12px;

  background:rgba(255,255,255,.025);

  border:1px solid rgba(255,255,255,.04);

  color:rgba(255,255,255,.92);

  text-decoration:none;

  font-family:"Exo 2",sans-serif;

  font-size:.95rem;

  font-weight:600;

  overflow:hidden;

  transition:
    background .25s ease,
    border-color .25s ease,
    color .25s ease,
    transform .2s ease,
    padding-left .25s ease;
}

/* Barra lateral */

.nav-links a::before{

  content:"";

  position:absolute;

  left:0;
  top:10px;
  bottom:10px;

  width:3px;

  border-radius:999px;

  background:var(--color-accent);

  transform:scaleY(0);

  transition:transform .25s ease;
}

/* Hover */

.nav-links a:hover{

  background:rgba(236,175,68,.08);

  border-color:rgba(236,175,68,.20);

  color:var(--color-accent);

  padding-left:24px;

  transform:translateX(3px);
}

.nav-links a:hover::before{

  transform:scaleY(1);
}

/* Activo */

.nav-links a.router-link-active{

  background:
    linear-gradient(
      90deg,
      rgba(236,175,68,.16),
      rgba(236,175,68,.05)
    );

  border-color:rgba(236,175,68,.25);

  color:var(--color-accent);

  padding-left:24px;
}

.nav-links a.router-link-active::before{

  transform:scaleY(1);
}

  /* ===================== */

  .nav-links::-webkit-scrollbar{

    width:5px;
  }

  .nav-links::-webkit-scrollbar-track{

    background:transparent;
  }

  .nav-links::-webkit-scrollbar-thumb{

    background:
      rgba(236,175,68,.45);

    border-radius:999px;
  }

  .nav-links::-webkit-scrollbar-thumb:hover{

    background:
      rgba(236,175,68,.8);
  }
}
</style>

