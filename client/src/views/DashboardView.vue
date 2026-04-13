<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFolderStore } from '../stores/folder.store';
import { useDocumentStore } from '../stores/document.stores';
import { useRouter } from 'vue-router';
import { api } from '../services/api';

const router = useRouter();

const folderStore = useFolderStore();

const documentStore = useDocumentStore();

const newFolderName = ref('');

/*
const handleCreateDocument = async () => {
  try {
    const response = await api.post('/documents', { title: 'Nuovo Documento' });
    const newDocId = response.data._id;
    // Naviga verso la nuova pagina dell'editor!
    router.push(`/document/${newDocId}`); 
  } catch (error) {
    console.error("Errore creazione documento", error);
  }
};
*/

const handleCreateDocument = async () => {
  await documentStore.createDocument('Nuovo Documento');
};

const handleDeleteDocument = async (documentId: string) => {
  await documentStore.deleteDocument(documentId);
};

// Hook del ciclo di vita: Appena il componente viene montato, chiama le API
onMounted(() => {
  folderStore.fetchFolders();
  documentStore.fetchDocuments();
});

// Funzione chiamata dal bottone
const handleCreateFolder = async () => {
  if (newFolderName.value.trim() === '') return;
  await folderStore.createFolder(newFolderName.value);
  newFolderName.value = ''; // Svuota l'input dopo la creazione
};

const handleDelete = async (folderId: string) => {
  await folderStore.deleteFolder(folderId);
};
</script>

<template>
  <main class="drive-container">
    <h1>Dok</h1>

    <div class="toolbar">
      <input 
        v-model="newFolderName" 
        type="text" 
        placeholder="Nome nuova cartella..." 
        @keyup.enter="handleCreateFolder"
      />
      <button @click="handleCreateFolder" :disabled="!newFolderName">
        + Crea Cartella
      </button>
      <button @click="handleCreateDocument" style="background-color: #1a73e8;">
        + Crea Documento
      </button>
    </div>

    <hr />

    <div v-if="folderStore.folders.length === 0 && documentStore.documents.length === 0" class="empty-state">
      La tua area di lavoro è vuota. Crea una cartella o un documento per iniziare!
    </div>

    <div v-else class="grid">
      <div v-for="folder in folderStore.folders" :key="folder._id" class="folder-card">
        <span class="folder-icon">🗂️</span>
        <span class="folder-name">{{ folder.name }}</span>
        <button @click.stop="handleDelete(folder._id)">Elimina</button>
      </div>
      <div v-for="document in documentStore.documents" :key="document._id" class="document-card" @click="router.push(`/document/${document._id}`)">
        <span class="document-icon">📄</span>
        <span class="document-name">{{ document.title }}</span>
        <button @click.stop="handleDeleteDocument(document._id)">Elimina</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.drive-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.toolbar input {
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1;
  max-width: 300px;
}

.toolbar button {
  padding: 0.8rem 1.5rem;
  background-color: #0b57d0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.toolbar button:disabled {
  background-color: #a0c1fc;
  cursor: not-allowed;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.folder-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  border: 1px solid #dadce0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.document-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  border: 1px solid #dadce0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.folder-card:hover {
  background-color: #f8f9fa;
}

.document-card:hover {
  background-color: #f8f9fa;
}

.folder-icon {
  font-size: 1.5rem;
}

.document-icon {
  font-size: 1.5rem;
}

.empty-state {
  color: #5f6368;
  font-style: italic;
  margin-top: 2rem;
}
</style>