import { ref, computed, watch } from 'vue';
import type { NewsArticle } from '@/types/serverTypes';

const hasFetched = ref<boolean>(false);

export function useNews(CACHE_KEY: string) {
  const newsList = ref<NewsArticle[]>([]);
  const activeIndex = ref<number>(0);
  const bLoading = ref<boolean>(true);
  const searchQuery = ref<string>('');
  const currentPage = ref<number>(1);
  const ITEMS_PER_PAGE = 10;

  const currentArticle = computed(() => newsList.value[activeIndex.value] || null);

  const filteredNewsList = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return newsList.value;
    
    return newsList.value.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query)
    );
  });

  const totalPages = computed(() => Math.ceil(filteredNewsList.value.length / ITEMS_PER_PAGE) || 1);

  const paginatedNewsList = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    return filteredNewsList.value.slice(start, start + ITEMS_PER_PAGE);
  });

  watch(searchQuery, () => { currentPage.value = 1; });

  const embedVideoUrl = computed(() => {
    if (!currentArticle.value?.videoUrl) return '';
    const url = currentArticle.value.videoUrl;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2]?.length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  });

  // --- PETICIÓN OPTIMIZADA ---
  const fetchNews = async (forceRefresh = false) => {
    if (hasFetched.value && !forceRefresh) {
      bLoading.value = false;
      return;
    }

    bLoading.value = true;
    try {
      const response = await fetch(`/api/cache/${CACHE_KEY}`);
      
      // Si el backend no encuentra NADA (ni base de datos ni defaults), devolvemos vacío
      if (!response.ok) {
        console.warn('[useNews] API devolvió error, inicializando lista vacía.');
        newsList.value = [];
        hasFetched.value = true;
        return;
      }
      
      const result = await response.json();
      
      // Lógica de extracción de datos flexible:
      // Acepta { news: [...] } o directamente [...]
      const rawData = result.news || (result.data ? result.data.news : null) || result;

      if (Array.isArray(rawData)) {
        newsList.value = rawData;
      } else {
        newsList.value = [];
      }
      
      hasFetched.value = true;
    } catch (error) {
      console.error('[useNews] Error crítico al conectar con el backend:', error);
      newsList.value = [];
    } finally {
      bLoading.value = false;
    }
  };

  const createNewArticleTemplate = () => {
    const newArticle: NewsArticle = {
      id: `news_${Date.now()}`,
      title: 'NUEVA NOTICIA DISPONIBLE',
      subtitle: 'SUMARIO O SUBTÍTULO DEL BOLETÍN',
      content: 'Comienza a escribir aquí el cuerpo principal de tu newsletter...',
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: 'Diseñador',
      category: 'Novedades',
      images: [],
      videoUrl: ''
    };
    newsList.value.unshift(newArticle);
    searchQuery.value = ''; 
    currentPage.value = 1;
    activeIndex.value = 0;
  };

  const deleteCurrentArticle = () => {
    if (newsList.value.length === 0) return;
    if (confirm('¿Estás seguro de que deseas eliminar este boletín por completo?')) {
      newsList.value.splice(activeIndex.value, 1);
      if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
      const startGlobalIdx = (currentPage.value - 1) * ITEMS_PER_PAGE;
      activeIndex.value = Math.max(0, Math.min(startGlobalIdx, newsList.value.length - 1));
    }
  };

  // --- SUBIDA DE IMÁGENES FÍSICAS AL SERVIDOR ---
  const handleAddImage = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !currentArticle.value) return;
    
    const file = input.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { 
      alert(`El archivo excede el límite máximo permitido de 10 MB.`); 
      return; 
    }

    // Preparamos el archivo para enviarlo tal cual (multipart/form-data)
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData // Fetch configura los headers correctamente
      });

      const result = await response.json();

      if (result.success && result.data?.url) {
        // Si fue exitoso, guardamos la URL limpia (/uploads/...) 
        if (!currentArticle.value.images) currentArticle.value.images = [];
        currentArticle.value.images.push(result.data.url);
      } else {
        alert(`Error: ${result.errorDetail || 'No se pudo subir la imagen'}`);
      }
    } catch (error) {
      console.error('[useNews] Error de red subiendo imagen:', error);
      alert('Error de conexión al subir la imagen.');
    } finally {
      // Limpiamos el input para que detecte si se sube el mismo archivo otra vez
      input.value = '';
    }
  };

  const removeImageAtIndex = (index: number) => {
    if (!currentArticle.value?.images) return;
    currentArticle.value.images.splice(index, 1);
  };

  const selectArticleFromPage = (item: NewsArticle) => {
    const globalIdx = newsList.value.findIndex(article => article.id === item.id);
    if (globalIdx !== -1) activeIndex.value = globalIdx;
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  return {
    newsList, activeIndex, bLoading, searchQuery, currentPage, 
    currentArticle, totalPages, paginatedNewsList, embedVideoUrl,
    fetchNews, createNewArticleTemplate, deleteCurrentArticle, 
    handleAddImage, removeImageAtIndex, selectArticleFromPage, changePage
  };
}