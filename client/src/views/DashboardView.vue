<script setup lang="ts">
import { onMounted } from 'vue';
import { useFolderStore } from '../stores/folder.store';
import { useDocumentStore } from '../stores/document.stores';
import TopBar from '../components/dashboard/TopBar.vue';
import SideBar from '../components/dashboard/SideBar.vue';
import MainWorkspace from '../components/dashboard/MainWorkspace.vue';

const folderStore = useFolderStore();
const documentStore = useDocumentStore();

onMounted(() => {
  folderStore.fetchFolders();
  documentStore.fetchDocuments();
});

const handleCreateDocument = async (name: string) => {
  await documentStore.createDocument(name);
};

const handleCreateFolder = async (name: string) => {
  await folderStore.createFolder(name);
};

const handleDeleteFolder = async (id: string) => {
  await folderStore.deleteFolder(id);
};

const handleDeleteDocument = async (id: string) => {
  await documentStore.deleteDocument(id);
};
</script>

<template>
  <div class="dashboard-layout">
    <TopBar />
    <div class="dashboard-body">
      <SideBar 
        @create-document="handleCreateDocument"
        @create-folder="handleCreateFolder"
      />
      <MainWorkspace 
        :folders="folderStore.folders"
        :documents="documentStore.documents"
        @delete-folder="handleDeleteFolder"
        @delete-document="handleDeleteDocument"
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