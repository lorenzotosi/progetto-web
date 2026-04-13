<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../services/api';
import Editor from '../components/editor/Editor.vue';

const route = useRoute();
const router = useRouter();
const documentId = route.params.id as string;

// Stato del componente
const documentData = ref<any>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // Leggiamo il documento dal Database via API REST
    const response = await api.get(`/documents/${documentId}`);
    documentData.value = response.data;
  } catch (error) {
    console.error("Errore nel caricamento del documento", error);
    alert("Documento non trovato!");
    router.push('/'); // Torna alla dashboard se c'è un errore
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="view-container">
    <header class="doc-header">
      <button class="back-btn" @click="router.push('/')">← Torna al Drive</button>
      <h2 v-if="documentData">{{ documentData.title }}</h2>
    </header>

    <div v-if="isLoading" class="loading">
      Caricamento editor in corso...
    </div>

    <Editor 
      v-else-if="documentData" 
      :initialContent="documentData.tiptapJson" 
    />
  </div>
</template>

<style scoped>
.doc-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: red;
  border-bottom: 1px solid #e0e0e0;
}

.back-btn {
  background: transparent;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background: #f1f3f4;
}

.loading {
  text-align: center;
  margin-top: 3rem;
  color: #666;
}
</style>