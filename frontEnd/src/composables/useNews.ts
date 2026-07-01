import { ref, computed, watch } from 'vue';
import type { NewsArticle } from '@/types/serverTypes';

// Esta bandera vive fuera de la función useNews para mantener el estado de carga global del módulo
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

  watch(searchQuery, () => {
    currentPage.value = 1;
  });

  const embedVideoUrl = computed(() => {
    if (!currentArticle.value?.videoUrl) return '';
    const url = currentArticle.value.videoUrl;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2]?.length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  });

  // --- PETICIÓN DE CONTROL ÚNICO ---
  const fetchNews = async (forceRefresh = false) => {
    // Si ya se ha cargado previamente y no se está forzando una recarga, detenemos la ejecución
    if (hasFetched.value && !forceRefresh) {
      bLoading.value = false;
      return;
    }

    bLoading.value = true;
    try {
      const response = await fetch(`http://localhost:3000/api/cache/${CACHE_KEY}`);
      
      // Control de seguridad: Si database.json no existe (404), inicializamos un arreglo vacío
      if (response.status === 404) {
        newsList.value = [];
        hasFetched.value = true;
        return;
      }
      
      const result = await response.json();
      const rawData = result.data ?? result.value ?? result;

      if (rawData && Array.isArray(rawData.news)) {
        newsList.value = rawData.news;
      } else if (Array.isArray(rawData)) {
        // CORRECCIÓN: Asignamos los datos directamente a la variable reactiva
        newsList.value = rawData;
      } else {
        newsList.value = [];
      }
      
      // Marcamos la bandera de control como completada exitosamente
      hasFetched.value = true;
    } catch (error) {
      console.error('[useNews] Error al conectar con database.json:', error);
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

  const handleAddImage = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !currentArticle.value) return;
    
    const file = input.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(`El archivo excede el límite máximo permitido de 10 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Result = e.target?.result as string;
      if (base64Result && currentArticle.value) {
        if (!currentArticle.value.images) currentArticle.value.images = [];
        currentArticle.value.images.push(base64Result);
      }
    };
    reader.readAsDataURL(file);
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
    newsList, 
    activeIndex, 
    bLoading, 
    searchQuery, 
    currentPage, 
    currentArticle, 
    totalPages, 
    paginatedNewsList, 
    embedVideoUrl,
    fetchNews, 
    createNewArticleTemplate, 
    deleteCurrentArticle, 
    handleAddImage, 
    removeImageAtIndex, 
    selectArticleFromPage, 
    changePage
  };
}