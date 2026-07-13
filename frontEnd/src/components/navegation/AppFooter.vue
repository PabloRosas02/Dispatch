<template>
  <footer class="footer">
    <div class="footer-container">
        <div class="footer-brand">
            <img
            src="/icons/Logo.svg"
            alt="Kinsfolk"
            class="footer-logo"
            />

            <p>
            Comunidad GTA V Roleplay enfocada en experiencias inmersivas,
            historias memorables y una comunidad de calidad.
            </p>
        </div>

        <div class="footer-links">

            <div class="footer-column">
            <h3>Legal</h3>

            <a href="#">Normativa</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Política de cookies</a>
            <a href="#">Términos y condiciones</a>
            </div>

            <div class="footer-column">
            <h3>Comunidad</h3>

            <a href="#">Discord</a>
            <a href="#">Twitter / X</a>
            <a href="#">Staff</a>
            <a href="#">Whitelist</a>
            </div>

        </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {

  font-family: "Exo 2", sans-serif;
  background: rgba(6, 15, 22, 0.75);
  backdrop-filter: blur(10px);

  border-top: 1px solid rgba(255,255,255,.08);

  padding: 60px 40px 20px;
}

.footer-container {
  max-width: 1400px;

  margin: 0 auto;

  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 80px;
}

.footer-brand {
  max-width: 450px;
}

.footer-logo {
  width: 120px;
  margin-bottom: 20px;
}

.footer-links {
  display: contents;
}

.footer-brand p {
  color: rgba(255,255,255,.75);
  line-height: 1.8;
}

.footer-column h3 {
  color: white;
  margin-bottom: 20px;
  font-weight: 600;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-column a {
  color: rgba(255,255,255,.65);
  text-decoration: none;
  margin-bottom: 12px;

  transition: color .2s ease;
}

.footer-column a:hover {
  color: var(--color-accent);
}

.footer-bottom {
  margin-top: 50px;
  padding-top: 20px;

  border-top: 1px solid rgba(255,255,255,.08);

  color: rgba(255,255,255,.5);
  text-align: center;
  font-size: 14px;
}

@media (max-width: 768px) {

  .footer {
    padding: 40px 24px 20px;
  }

  .footer-container {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  .footer-brand {
    max-width: 100%;
    text-align: center;
  }

  .footer-logo {
    width: 90px;
    margin: 0 auto 20px;
    display: block;
  }

  .footer-brand p {
    font-size: 15px;
    line-height: 1.7;
  }

  .footer-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .footer-column {
    align-items: center;
    text-align: center;
  }

  .footer-column h3 {
    margin-bottom: 14px;
  }

  .footer-column a {
    margin-bottom: 8px;
    font-size: 14px;
  }

  .footer-bottom {
    margin-top: 30px;
    font-size: 13px;
  }
}
</style>