import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';

export function useDocumentData(documentId: string) {
  const router = useRouter();
  const documentData = ref<any>(null);
  const isLoading = ref(true);

  const fetchDocumentData = async () => {
    try {
      const response = await api.get(`/documents/${documentId}`);
      documentData.value = response.data;
    } catch (error) {
      console.error("Errore nel caricamento del documento", error);
      alert("Documento non trovato!");
      router.push('/');
    } finally {
      isLoading.value = false;
    }
  };

  const handleRename = async () => {
    if (!documentData.value || !documentData.value.title.trim()) return;
    
    try {
      await api.put('/documents/rename', {
        id: documentId,
        newTitle: documentData.value.title
      });
    } catch (error) {
      console.error("Errore durante la rinomina del documento", error);
    }
  };

  return {
    documentData,
    isLoading,
    fetchDocumentData,
    handleRename
  };
}
