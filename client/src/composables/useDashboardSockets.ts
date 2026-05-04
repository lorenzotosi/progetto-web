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
      d._id === updatedDoc._id ? { ...updatedDoc, myRole: d.myRole } : d
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

  const handleDocumentShared = (doc: any) => {
    // Caso 1: Siamo nella sezione 'shared' -> Aggiungi il documento se non c'è
    if (currentSection.value === 'shared') {
      if (!documentStore.documents.find(d => d._id === doc._id)) {
        documentStore.documents.unshift(doc);
      } else {
        // Se c'è già, aggiornalo per sicurezza (es. cambio ruolo)
        documentStore.documents = documentStore.documents.map(d => d._id === doc._id ? doc : d);
      }
    }
    // Caso 2: Siamo nella sezione 'public' -> Se il documento è pubblico, aggiorna solo il tag myRole
    else if (currentSection.value === 'public' && doc.visibility === 'public') {
      documentStore.documents = documentStore.documents.map(d =>
        d._id === doc._id ? { ...d, myRole: doc.myRole } : d
      );
    }
    // TODO: Qui si potrebbe aggiungere una notifica push/toast UI per avvisare l'utente
  };

  const handleDocumentUnshared = (documentId: string) => {
    // Troviamo il documento interessato nella lista locale
    const doc = documentStore.documents.find(d => d._id === documentId);

    // Se siamo nella sezione 'public' e il documento è pubblico, togliamo solo il tag 'myRole'
    if (currentSection.value === 'public' && doc?.visibility === 'public') {
      documentStore.documents = documentStore.documents.map(d =>
        d._id === documentId ? { ...d, myRole: null } : d
      );
    } else {
      // In tutti gli altri casi (sezione 'shared' o documento privato), rimuoviamo il file dalla lista
      documentStore.documents = documentStore.documents.filter(d => d._id !== documentId);
    }
  };

  const handleDocumentDeleted = (deletedId: string) => {
    documentStore.documents = documentStore.documents.filter(d => d._id !== deletedId);
  };

  const handleDocumentRenamed = (updatedDoc: any) => {
    documentStore.documents = documentStore.documents.map(d =>
      d._id === updatedDoc._id ? updatedDoc : d
    );
  };

  const handlePrivateDocumentCreated = (doc: any) => {
    documentStore.documents.unshift(doc);
  };

  const handlePrivateDocumentDeleted = (documentId: string) => {
    documentStore.documents = documentStore.documents.filter(d => d._id !== documentId);
  };

  const clearAllListeners = (socket: any) => {
    if (!socket) return;
    socket.off('global-document-created');
    socket.off('document-created');
    socket.off('global-document-deleted');
    socket.off('global-document-renamed');
    socket.off('global-folder-created');
    socket.off('global-folder-deleted');
    socket.off('document-shared');
    socket.off('document-unshared');
    socket.off('document-deleted');
    socket.off('document-renamed');
    socket.off('private-document-created');
  };

  const registerListeners = (socket: any) => {
    if (currentSection.value === 'public') {
      socket.emit('join-public-dashboard');
      socket.on('global-document-created', handleGlobalDocumentCreated);
    }

    // Eventi globali o personali che possono avvenire in background
    socket.on('global-document-deleted', handleGlobalDocumentDeleted);
    socket.on('global-document-renamed', handleGlobalDocumentRenamed);
    socket.on('global-folder-created', handleGlobalFolderCreated);
    socket.on('global-folder-deleted', handleGlobalFolderDeleted);

    // Ascolta sempre se qualcuno condivide qualcosa con te (stanza user:ID)
    socket.on('document-shared', handleDocumentShared);
    socket.on('document-unshared', handleDocumentUnshared);
    socket.on('document-deleted', handleDocumentDeleted);
    socket.on('document-renamed', handleDocumentRenamed);
    socket.on('private-document-created', handlePrivateDocumentCreated);
    socket.on('private-document-deleted', handlePrivateDocumentDeleted);
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
