import { ref, nextTick } from 'vue'

export interface DesignerOptions {
  cacheKey: string
  apiEndpoint?: string
  onSaveSuccess?: () => void
}

export function useDesigner(options: DesignerOptions) {
  const { cacheKey, apiEndpoint = '/api/cache' } = options

  // Estados del Modo Diseñador
  const isEditing = ref<boolean>(false)
  const showColorDropdown = ref<boolean>(false)
  const showAdvancedModal = ref<boolean>(false)

  // Estados de Colores
  const activeColor = ref<string>('#ecaf44')
  const tempCustomColor = ref<string>('#ff0000')
  const recentColors = ref<string[]>([])

  // Respaldo de selección nativa del navegador
  let savedRange: Range | null = null

  // Listas de configuración para la Toolbar
  const fontFamilies = [
    'Exo 2', 'Arial', 'Inter', 'Helvetica', 'Montserrat', 'Roboto', 'Segoe UI', 'Tahoma', 'Verdana',
    'Georgia', 'Times New Roman', 'Garamond', 'Merriweather', 'Playfair Display', 'Courier New', 'Fira Code'
  ]
  const fontSizes = ['14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px']
  const presetColors = [
    '#000000', '#434343', '#666666', '#999999', '#cccccc', '#efefef', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff',
    '#ecaf44', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75'
  ]

  // --- LÓGICA DE ACTIVACIÓN Y PERSISTENCIA ---
  const toggleEdit = async (pageConfigRef: any, elementsRefs: Record<string, any>) => {
    if (!isEditing.value) {
      isEditing.value = true
      await nextTick()
      // Inyectar el HTML guardado en los contenedores editables
      Object.keys(elementsRefs).forEach(key => {
        if (elementsRefs[key]?.value && pageConfigRef.value[key] !== undefined) {
          elementsRefs[key].value.innerHTML = pageConfigRef.value[key]
        }
      })
    } else {
      // Extraer el contenido del contenedor editable de vuelta al objeto reactivo
      Object.keys(elementsRefs).forEach(key => {
        if (elementsRefs[key]?.value) {
          pageConfigRef.value[key] = elementsRefs[key].value.innerHTML
        }
      })

      isEditing.value = false
      showColorDropdown.value = false
      showAdvancedModal.value = false

      // Guardar en la API utilizando el mapa dinámico de rutas del backend /:key
      try {
        await fetch(`${apiEndpoint}/${cacheKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            key: cacheKey, 
            value: pageConfigRef.value 
          })
        })
        if (options.onSaveSuccess) options.onSaveSuccess()
      } catch (error) {
        console.error(`[useDesigner] Error al persistir cambios para ${cacheKey}:`, error)
      }
    }
  }

  // --- COMANDOS DE FORMATO ---
  const execCommand = (command: string, value: string = ''): void => {
    document.execCommand(command, false, value)
  }

  const saveSelection = (): void => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      savedRange = selection.getRangeAt(0).cloneRange()
    }
  }

  const restoreSelection = (): void => {
    const selection = window.getSelection()
    if (selection && savedRange) {
      selection.removeAllRanges()
      selection.addRange(savedRange)
    }
  }

  const applyInlineStyle = (styleProperty: 'font-family' | 'font-size' | 'color', value: string): void => {
    restoreSelection()
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (range.collapsed) return

    const span = document.createElement('span')
    if (styleProperty === 'font-family') span.style.fontFamily = value
    if (styleProperty === 'font-size') span.style.fontSize = value
    if (styleProperty === 'color') {
      span.style.color = value
      activeColor.value = value
    }

    try {
      span.appendChild(range.extractContents())
      range.insertNode(span)
      selection.removeAllRanges()
    } catch (err) {
      console.error('Error aplicando estilo inline:', err)
    }
  }

  const addLink = (): void => {
    const url = prompt('Introduce la URL para el hipervínculo:')
    if (url) execCommand('createLink', url)
  }

  // --- SELECCIÓN AVANZADA DE COLOR ---
  const openAdvancedPicker = (): void => {
    saveSelection()
    showColorDropdown.value = false
    showAdvancedModal.value = true
  }

  const acceptCustomColor = (): void => {
    const selectedColor = tempCustomColor.value
    if (recentColors.value.includes(selectedColor)) {
      recentColors.value = recentColors.value.filter(c => c !== selectedColor)
    }
    recentColors.value.push(selectedColor)
    if (recentColors.value.length > 8) recentColors.value.shift()

    applyInlineStyle('color', selectedColor)
    showAdvancedModal.value = false
  }

  // --- LÓGICA DE IMÁGENES FÍSICAS (SUBIR, CAMBIAR, ELIMINAR) ---
  const handleImageUpload = async (event: Event, targetConfigObject: any, propertyKey: string) => {
    const target = event.target as HTMLInputElement
    if (!target.files || target.files.length === 0) return
    
    const file = target.files[0]
    if (!file) return

    // Añadimos la misma seguridad de peso que en los otros archivos
    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`El archivo excede el límite máximo permitido de 10 MB.`)
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      // Usamos el endpoint global de subida
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success && result.data?.url) {
        // Asignamos la URL limpia devuelta por el servidor a la propiedad dinámica
        targetConfigObject[propertyKey] = result.data.url
      } else {
        alert(`Error: ${result.errorDetail || 'No se pudo subir la imagen'}`)
      }
    } catch (error) {
      console.error('[useDesigner] Error de red subiendo imagen:', error)
      alert('Error de conexión al subir la imagen.')
    } finally {
      // Limpiamos el input para permitir volver a cargar la misma imagen de ser necesario
      target.value = ''
    }
  }

  const removeImage = (targetConfigObject: any, propertyKey: string): void => {
    targetConfigObject[propertyKey] = '' // Deja el string vacío para ocultar o poner un placeholder
  }

  return {
    isEditing,
    showColorDropdown,
    showAdvancedModal,
    activeColor,
    tempCustomColor,
    recentColors,
    fontFamilies,
    fontSizes,
    presetColors,
    toggleEdit,
    execCommand,
    saveSelection,
    applyInlineStyle,
    openAdvancedPicker,
    acceptCustomColor,
    addLink,
    handleImageUpload,
    removeImage
  }
}
