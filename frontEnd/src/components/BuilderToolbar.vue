<script setup lang="ts">
interface Props {
  designer: any // Pasa la instancia del objeto retornado por useDesigner
  onSave: () => void
}
const props = defineProps<Props>()
</script>

<template>
  <div class="builder-toolbar">
    <select @change="e => props.designer.applyInlineStyle('font-family', (e.target as HTMLSelectElement).value)" class="toolbar-select">
      <option value="" disabled selected>Tipografía</option>
      <option v-for="font in props.designer.fontFamilies" :key="font" :value="font">{{ font }}</option>
    </select>

    <select @change="e => props.designer.applyInlineStyle('font-size', (e.target as HTMLSelectElement).value)" class="toolbar-select size-select">
      <option value="" disabled selected>Tamaño</option>
      <option v-for="size in props.designer.fontSizes" :key="size" :value="size">{{ size }}</option>
    </select>

    <div class="toolbar-separator"></div>

    <button class="toolbar-btn" title="Negrita" @mousedown.prevent="props.designer.execCommand('bold')"><b>B</b></button>
    <button class="toolbar-btn" title="Cursiva" @mousedown.prevent="props.designer.execCommand('italic')"><i>I</i></button>
    <button class="toolbar-btn" title="Subrayado" @mousedown.prevent="props.designer.execCommand('underline')"><u>U</u></button>
    <button class="toolbar-btn" title="Hipervínculo" @click="props.designer.addLink">🔗</button>
    
    <div class="color-picker-wrapper">
      <button class="toolbar-btn color-dropdown-trigger" title="Color de texto" @click="props.designer.showColorDropdown.value = !props.designer.showColorDropdown.value">
        <span class="color-icon-text">A</span>
        <div class="color-underline" :style="{ backgroundColor: props.designer.activeColor.value }"></div>
      </button>

      <div v-if="props.designer.showColorDropdown.value" class="color-menu-dropdown">
        <div class="color-grid">
          <button 
            v-for="color in props.designer.presetColors" 
            :key="color" 
            class="color-grid-item" 
            :style="{ backgroundColor: color }"
            @click="props.designer.saveSelection(); props.designer.applyInlineStyle('color', color); props.designer.showColorDropdown.value = false"
          ></button>
        </div>
        
        <div v-if="props.designer.recentColors.value.length > 0" class="recent-colors-section">
          <div class="recent-label">RECIENTES</div>
          <div class="recent-grid">
            <button 
              v-for="(color, index) in props.designer.recentColors.value" 
              :key="index" 
              class="color-grid-item" 
              :style="{ backgroundColor: color }"
              :title="color"
              @click="props.designer.saveSelection(); props.designer.applyInlineStyle('color', color); props.designer.showColorDropdown.value = false"
            ></button>
          </div>
        </div>

        <div class="dropdown-divider"></div>
        
        <div class="custom-color-section">
          <span class="custom-label">PERSONALIZADO</span>
          <button class="custom-color-btn" @click="props.designer.openAdvancedPicker" title="Selector Avanzado">
            <span class="plus-icon">＋</span>
            <span class="picker-icon">✒️</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="props.designer.showAdvancedModal.value" class="advanced-modal-overlay">
      <div class="advanced-modal-card">
        <div class="picker-container">
          <input type="color" :value="props.designer.tempCustomColor.value" class="advanced-color-input" @input="e => props.designer.tempCustomColor.value = (e.target as HTMLInputElement).value" />
          <div class="picker-preview-bar" :style="{ backgroundColor: props.designer.tempCustomColor.value }"></div>
        </div>
        <div class="advanced-inputs-row">
          <div class="hex-box">
            <span class="hex-hash">#</span>
            <input type="text" :value="props.designer.tempCustomColor.value.replace('#','')" readonly class="hex-text-input" />
          </div>
        </div>
        <div class="advanced-modal-actions">
          <button class="modal-btn cancel-btn" @click="props.designer.showAdvancedModal.value = false">Cancelar</button>
          <button class="modal-btn accept-btn" @click="props.designer.acceptCustomColor()">Aceptar</button>
        </div>
      </div>
    </div>

    <div class="toolbar-separator"></div>
    <button class="toolbar-save-btn" @click="props.onSave">💾 Guardar</button>
  </div>
</template>

<style scoped>
/* Pegas aquí todos tus estilos CSS existentes del constructor (.builder-toolbar, .color-menu-dropdown, etc.) */
.builder-toolbar { 
    position: fixed; 
    top: 24px; 
    left: 50%; 
    transform: translateX(-50%); 
    z-index: 10000; 
    background: #1e1e1e; 
    border: 1px solid #3a3a3a; 
    padding: 8px 20px; 
    border-radius: 40px; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7); 
}
.toolbar-select { 
    background: #2b2b2b; 
    color: #fff; 
    border: 1px solid #444; 
    padding: 6px 10px; 
    border-radius: 6px; 
    cursor: pointer; 
    font-size: 0.85rem; 
    outline: none; 
}
.size-select { 
    width: 90px; 
}
.toolbar-separator { 
    width: 1px; 
    height: 22px; 
    background: #444; 
    margin: 0 4px; 
}
.toolbar-btn { 
    background: transparent; 
    border: none; 
    color: #ccc; 
    width: 34px; 
    height: 34px; 
    border-radius: 6px; 
    cursor: pointer; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    transition: all 0.2s; 
}
.toolbar-btn:hover { 
    background: #333; 
    color: #fff; 
}
.color-picker-wrapper { 
    position: relative; 
    display: inline-block; 
}
.color-icon-text { 
    font-size: 1.1rem; 
    font-weight: bold; 
    line-height: 1; 
    color: #fff; 
}
.color-underline { 
    width: 18px; 
    height: 4px; 
    margin-top: 2px; 
    border-radius: 2px; 
    transition: background-color 0.2s; 
}
.color-menu-dropdown { 
    position: absolute; 
    top: 42px; 
    left: 50%; 
    transform: translateX(-50%); 
    background: #ffffff; 
    border: 1px solid #ccc; 
    border-radius: 8px; 
    padding: 12px; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.3); 
    z-index: 10001; 
    width: 190px; 
}
.color-grid { 
    display: grid; 
    grid-template-columns: repeat(8, 18px); 
    gap: 5px; 
    justify-content: center; 
}
.color-grid-item { 
    width: 18px; 
    height: 18px; 
    border-radius: 50%; 
    border: 1px solid rgba(0,0,0,0.2); 
    cursor: pointer; 
    padding: 0; 
    transition: transform 0.1s; 
}
.color-grid-item:hover { 
    transform: scale(1.2); 
}
.dropdown-divider { 
    height: 1px; 
    background: #e0e0e0; 
    margin: 10px 0; 
}
.custom-color-section { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    padding: 0 4px; 
}
.custom-label { 
    font-size: 0.68rem; 
    font-weight: 700; 
    color: #555555; 
    letter-spacing: 0.5px; 
}
.custom-color-btn { 
    background: transparent; 
    border: 1px solid #ccc; 
    border-radius: 50%; 
    width: 26px; 
    height: 26px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    cursor: pointer; 
    position: relative; 
    transition: background 0.2s; 
}
.custom-color-btn:hover { 
    background: #f0f0f0; 
}
.plus-icon { 
    font-size: 0.65rem; 
    color: #444; 
    font-weight: bold; 
    position: absolute; 
    top: 1px; 
    left: 4px; 
}
.picker-icon { 
    font-size: 0.75rem; 
    position: absolute; 
    bottom: 2px; 
    right: 3px; 
}
.toolbar-save-btn { 
    background: #ecaf44; 
    color: #111; 
    border: none; 
    padding: 6px 16px; 
    border-radius: 20px; 
    cursor: pointer; 
    font-weight: 700; 
    font-size: 0.85rem; 
}
.advanced-modal-overlay { 
    position: fixed; 
    top: 90px; 
    left: 50%; 
    transform: translateX(-50%); 
    z-index: 10005; 
}
.advanced-modal-card { 
    background: #ffffff; 
    border-radius: 8px; 
    padding: 16px; 
    width: 240px; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.4); 
    border: 1px solid #ddd; 
}
.picker-container { 
    position: relative; 
    width: 100%; 
    height: 120px; 
    margin-bottom: 12px; 
    border-radius: 6px; 
    overflow: hidden; 
}
.advanced-color-input { 
    width: 100%; 
    height: 100%; 
    border: none; 
    cursor: pointer; 
    background: transparent; 
    padding: 0; 
}
.picker-preview-bar { 
    position: absolute; 
    bottom: 0; 
    left: 0; 
    width: 100%; 
    height: 8px; 
}
.advanced-inputs-row { 
    display: flex; 
    justify-content: center; 
    margin-bottom: 16px; 
}
.hex-box { 
    display: flex; 
    align-items: center; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    padding: 4px 8px; 
    background: #f9f9f9; 
    width: 120px; 
}
.hex-hash { 
    font-size: 0.9rem; 
    color: #666; 
    font-weight: bold; 
    margin-right: 4px; 
}
.hex-text-input { 
    border: none; 
    background: transparent; 
    width: 100%; 
    font-family: monospace; 
    outline: none; color: #222; 
    text-transform: uppercase; 
    font-size: 0.9rem; 
}
.advanced-modal-actions { 
    display: flex; 
    justify-content: flex-end; 
    gap: 10px; 
}
.modal-btn { 
    padding: 6px 14px; 
    border-radius: 4px; 
    font-size: 0.85rem; 
    font-weight: 600; 
    cursor: pointer; 
    border: none; 
}
.cancel-btn { 
    background: transparent; 
    color: #4a86e8; 
}
.cancel-btn:hover { 
    background: #f0f4ff; 
}
.accept-btn { 
    background: #4a86e8; 
    color: white; 
}
.accept-btn:hover { 
    background: #357ae8; 
}
.recent-colors-section { 
    margin-top: 10px; 
    border-top: 1px solid #eee; 
    padding-top: 8px; 
}
.recent-label { 
    font-size: 0.65rem; 
    font-weight: 700; 
    color: #777; 
    margin-bottom: 6px; 
    letter-spacing: 0.5px; 
}
.recent-grid { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 5px; 
    min-height: 18px; 
    }
</style>