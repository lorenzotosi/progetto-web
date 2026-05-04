import { watch, onUnmounted, type Ref } from 'vue';
import { socketService } from '../services/socket.service';
import { useDocumentStore } from '../stores/document.stores';
import { useFolderStore } from '../stores/folder.store';
import { useAuthStore } from '../stores/auth.store';

export function useDashboardSockets(currentSection: Ref<'private' | 'public' | 'shared'>) {
  const documentStore = useDocumentStore();
  const folderStore = useFolderStore();
  const authStore = useAuthStore();

  const handleGlobalDocumentCreated = (doc: any) => {
    if (!documentStore.documents.find(d => d._id === doc._id)) {
      documentStore.documents.unshift(doc);
    }
  };

  const handleGlobalDocumentDeleted = (deletedId: string) => {
    documentStore.documents = documentStore.documents.filter(d => d._id !== deletedId);
  };

  const handleGlobalDocumentRenamed = (updatedDoc: any) => {
    documentStore.documents = documentStore.documents.map(d => 
      d._id === updatedDoc._id ? updatedDoc : d
    );
  };

  const handleGlobalFolderCreated = (newFolder: any) => {
    if (!folderStore.folders.find(f => f._id === newFolder._id)) {
      folderStore.folders.unshift(newFolder);
    }
  };

  const handleGlobalFolderDeleted = (deletedId: string) => {
    folderStore.folders = folderStore.folders.filter(f => f._id !== deletedId);
  };

  const clearAllListeners = (socket: any) => {
    if (!socket) return;
    socket.off('global-document-created');
    socket.off('document-created');
    socket.off('global-document-deleted');
    socket.off('global-document-renamed');
    socket.off('global-folder-created');
    socket.off('global-folder-deleted');
  };

  const registerListeners = (socket: any) => {
    if (currentSection.value === 'public') {
      socket.emit('join-public-dashboard');
      socket.on('global-document-created', handleGlobalDocumentCreated);
    } else if (currentSection.value === 'shared') {
      // socket.emit('join-shared-dashboard');
      // todo
    }

    // Eventi globali che possono avvenire in background anche se la sezione pubblica non è attiva
    socket.on('global-document-deleted', handleGlobalDocumentDeleted);
    socket.on('global-document-renamed', handleGlobalDocumentRenamed);
    socket.on('global-folder-created', handleGlobalFolderCreated);
    socket.on('global-folder-deleted', handleGlobalFolderDeleted);
  };

  const setupSocketSync = () => {
    if (!socketService.getSocket()) {
      socketService.connect(authStore.token || null);
    }

    const socket = socketService.getSocket();
    if (!socket) return;

    clearAllListeners(socket);
    registerListeners(socket);
  };

  watch(currentSection, () => {
    setupSocketSync();
  }, { immediate: true }); 

  onUnmounted(() => {
    const socket = socketService.getSocket();
    clearAllListeners(socket);
  });
}
