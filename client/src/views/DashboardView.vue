<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { useFolderStore } from '../stores/folder.store';
import { useDocumentStore } from '../stores/document.stores';
import { useAuthStore } from '../stores/auth.store';
import TopBar from '../components/dashboard/TopBar.vue';
import SideBar from '../components/dashboard/SideBar.vue';
import MainWorkspace from '../components/dashboard/MainWorkspace.vue';
import { useFolderNavigation } from '../composables/useFolderNavigation';
import { socketService } from '../services/socket.service';

const folderStore = useFolderStore();
const documentStore = useDocumentStore();
const authStore = useAuthStore();
const currentSection = ref<'private' | 'public' | 'shared'>('private');
const searchQuery = ref('');

const setupSocketSync = () => {

  if (!socketService.getSocket()) {
    socketService.connect(authStore.token || null);
  }

  const socket = socketService.getSocket();
  if (!socket) return;
  socket.off('global-document-created');
  socket.off('document-created');
  if (currentSection.value === 'public') {
    socket.emit('join-public-dashboard');
    socket.on('global-document-created', (doc) => {
      if (!documentStore.documents.find(d => d._id === doc._id)) {
        documentStore.documents.unshift(doc);
      }
    });
  } else if (currentSection.value === 'shared') {
    //socket.emit('join-shared-dashboard');
    //todo
  }

  socket.off('global-document-deleted');
  socket.on('global-document-deleted', (deletedId) => {
    documentStore.documents = documentStore.documents.filter(d => d._id !== deletedId);
  });

  socket.off('global-document-renamed');
  socket.on('global-document-renamed', (updatedDoc) => {
    documentStore.documents = documentStore.documents.map(d => d._id === updatedDoc._id ? updatedDoc : d);
  });

  socket.off('global-folder-created');
  socket.on('global-folder-created', (newFolder) => {
    if (!folderStore.folders.find(f => f._id === newFolder._id)) {
      folderStore.folders.unshift(newFolder);
    }
  });
};  

watch(currentSection, () => {
  setupSocketSync();
}, { immediate: true }); 

onUnmounted(() => {
  const socket = socketService.getSocket();
  if (socket) {
    socket.off('global-document-created');
    socket.off('document-created');
    socket.off('global-document-deleted');
    socket.off('global-document-renamed');
    socket.off('global-folder-created');
  }
});

const refreshData = () => {
  if (currentSection.value === 'shared') {
    documentStore.fetchSharedDocuments();
    folderStore.folders = [];
  } else {
    folderStore.fetchFolders(currentFolderId.value);
    documentStore.fetchDocuments(currentFolderId.value);
  }
};

const { 
  currentFolderId, 
  handleSectionChange, 
  handleEnterFolder, 
  handleBack, 
  currentTitle 
} = useFolderNavigation(currentSection, authStore, refreshData, folderStore);

watch(() => authStore.token, (newToken) => {
  if (newToken) {
    handleSectionChange('private');
  } else if (!newToken && (currentSection.value === 'private' || currentSection.value === 'shared')) {
    handleSectionChange('public');
  } else {
    refreshData();
  }
});

const handleCreateDocument = async (name: string) => {
  const visibility = currentSection.value === 'public' ? 'public' : 'private';
  await documentStore.createDocument(name, visibility, currentFolderId.value);
};

const handleCreateFolder = async (name: string) => {
  const visibility = currentSection.value === 'public' ? 'public' : 'private';
  await folderStore.createFolder(name, currentFolderId.value, visibility);
};

const handleDeleteFolder = async (id: string) => {
  await folderStore.deleteFolder(id, currentFolderId.value);
};

const handleDeleteDocument = async (id: string) => {
  await documentStore.deleteDocument(id, currentFolderId.value);
};

const filteredDocuments = computed(() => {
  return documentStore.documents.filter(doc => {
    const matchesVisibility = currentSection.value === 'shared' || doc.visibility === currentSection.value;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesVisibility && matchesSearch;
  });
});

const filteredFolders = computed(() => {
  return folderStore.folders.filter(folder => {
    const matchesVisibility = folder.visibility === currentSection.value;
    const matchesSearch = folder.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesVisibility && matchesSearch;
  });
});
</script>

<template>
  <div class="dashboard-layout">
    <TopBar @search="val => searchQuery = val"/>
    <div class="dashboard-body">
      <SideBar 
        :active-section="currentSection"
        @create-document="handleCreateDocument"
        @create-folder="handleCreateFolder"
        @section-change="handleSectionChange"
      />
      <MainWorkspace 
        :title="currentTitle"
        :show-back="currentFolderId !== null"
        :folders="filteredFolders"
        :documents="filteredDocuments"
        :is-public="currentSection === 'public'"
        @delete-folder="handleDeleteFolder"
        @delete-document="handleDeleteDocument"
        @enter-folder="handleEnterFolder"
        @back="handleBack"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #3c4043;
}

.dashboard-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>