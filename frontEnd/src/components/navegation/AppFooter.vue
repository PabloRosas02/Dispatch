<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Importamos la lógica generalizada del diseñador
import { useDesigner } from '@/composables/useDesigner'
// Importamos la autenticación global
import { useAuth } from '@/composables/useAuth'

// Definimos la estructura basada en lo que agregaste a serversDefault.json
interface FooterConfig {
  footerText: string
  normativa: string
  politicapriv: string
  politivacookies: string
  Terminos: string
  discordLink: string
  twitterLink: string 
  staff: string
  whitelist: string
}

// Configuración reactiva inicial (fallbacks seguros)
const pageConfig = ref<FooterConfig>({
  footerText: 'Comunidad GTA V Roleplay enfocada en experiencias inmersivas, historias memorables y una comunidad de calidad.',
  normativa: '#',
  politicapriv: '#',
  politivacookies: '#',
  Terminos: '#',
  discordLink: '#',
  twitterLink: '#',
  staff: '#',
  whitelist: '#'
})

// Referencia para el nodo de texto editable
const footerTextRef = ref<HTMLParagraphElement | null>(null)

const designer = useDesigner({
  cacheKey: 'footer_page_config'
})

// Validación de seguridad para mostrar los controles
const { isAuthenticated } = useAuth()
const isAuthorizedDesigner = computed(() => isAuthenticated.value)

onMounted(async () => {
  try {
    const response = await fetch('/api/cache/footer_page_config')
    if (!response.ok) return

    const result = await response.json()
    const data = result.data ? result.data : result

    if (data && Object.keys(data).length > 0) {
      pageConfig.value = {
        ...pageConfig.value,
        ...data
      }
    }
  } catch (error) {
    console.error('[AppFooter.vue] Error cargando configuración:', error)
  }
})

// Función para guardar los cambios
const handleSaveOrEdit = () => {
  designer.toggleEdit(pageConfig, {
    footerText: footerTextRef
  })
}
</script>

<template>
  <footer class="footer">
    
    <!-- Controles de Edición Exclusivos del Footer -->
    <div v-if="isAuthorizedDesigner" class="footer-designer-controls">
      <button v-if="!designer.isEditing.value" class="designer-trigger" @click="handleSaveOrEdit">
        📝 Editar Footer
      </button>
      <button v-else class="designer-save-trigger" @click="handleSaveOrEdit">
        💾 Guardar Cambios
      </button>
    </div>

    <div class="footer-container">
        <div class="footer-brand">
            <img
            src="/icons/Logo.svg"
            alt="Kinsfolk"
            class="footer-logo"
            />

            <!-- Texto descriptivo normal o editable -->
            <p 
              v-if="!designer.isEditing.value" 
              v-html="pageConfig.footerText"
            ></p>
            <p 
              v-else 
              ref="footerTextRef" 
              contenteditable="true" 
              class="editable-container" 
              v-html="pageConfig.footerText"
            ></p>
        </div>

        <div class="footer-links">

            <div class="footer-column">
              <h3>Legal</h3>

              <!-- MODO VISUALIZACIÓN -->
              <template v-if="!designer.isEditing.value">
                <a :href="pageConfig.normativa" target="_blank" rel="noopener noreferrer">Normativa</a>
                <a :href="pageConfig.politicapriv" target="_blank" rel="noopener noreferrer">Política de privacidad</a>
                <a :href="pageConfig.politivacookies" target="_blank" rel="noopener noreferrer">Política de cookies</a>
                <a :href="pageConfig.Terminos" target="_blank" rel="noopener noreferrer">Términos y condiciones</a>
              </template>

              <!-- MODO EDICIÓN -->
              <template v-else>
                <div class="link-edit-group">
                  <label>Normativa:</label>
                  <input type="text" v-model="pageConfig.normativa" class="link-editor-input" />
                </div>
                <div class="link-edit-group">
                  <label>Privacidad:</label>
                  <input type="text" v-model="pageConfig.politicapriv" class="link-editor-input" />
                </div>
                <div class="link-edit-group">
                  <label>Cookies:</label>
                  <input type="text" v-model="pageConfig.politivacookies" class="link-editor-input" />
                </div>
                <div class="link-edit-group">
                  <label>Términos:</label>
                  <input type="text" v-model="pageConfig.Terminos" class="link-editor-input" />
                </div>
              </template>
            </div>

            <div class="footer-column">
              <h3>Comunidad</h3>

              <!-- MODO VISUALIZACIÓN -->
              <template v-if="!designer.isEditing.value">
                <a :href="pageConfig.discordLink" target="_blank" rel="noopener noreferrer">Discord</a>
                <a :href="pageConfig.twitterLink" target="_blank" rel="noopener noreferrer">Twitter / X</a>
                <a :href="pageConfig.staff" target="_blank" rel="noopener noreferrer">Staff</a>
                <a :href="pageConfig.whitelist" target="_blank" rel="noopener noreferrer">Whitelist</a>
              </template>

              <!-- MODO EDICIÓN -->
              <template v-else>
                <div class="link-edit-group">
                  <label>Discord:</label>
                  <input type="text" v-model="pageConfig.discordLink" class="link-editor-input" />
                </div>
                <div class="link-edit-group">
                  <label>Twitter/X:</label>
                  <input type="text" v-model="pageConfig.twitterLink" class="link-editor-input" />
                </div>
                <div class="link-edit-group">
                  <label>Staff:</label>
                  <input type="text" v-model="pageConfig.staff" class="link-editor-input" />
                </div>
                <div class="link-edit-group">
                  <label>Whitelist:</label>
                  <input type="text" v-model="pageConfig.whitelist" class="link-editor-input" />
                </div>
              </template>
            </div>

        </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-designer-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.designer-trigger, .designer-save-trigger {
  background: rgba(236, 175, 68, 0.12);
  color: var(--color-accent, #ecaf44);
  border: 1px solid var(--color-accent, #ecaf44);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  backdrop-filter: blur(8px);
  transition: all 0.2s;
  font-family: "Exo 2", sans-serif;
}

.designer-save-trigger {
  background: var(--color-accent, #ecaf44);
  color: #111;
}

.designer-trigger:hover, .designer-save-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 175, 68, 0.2);
}

.editable-container {
  border: 1px dashed var(--color-accent, #ecaf44);
  outline: none;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.2);
  min-height: 60px;
}

.link-edit-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  width: 100%;
}

.link-edit-group label {
  font-size: 0.75rem;
  color: var(--color-accent, #ecaf44);
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 4px;
}

.link-editor-input {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  width: 100%;
  transition: border-color 0.2s;
}

.link-editor-input:focus {
  border-color: var(--color-accent, #ecaf44);
}

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