import { ref, onBeforeUnmount } from 'vue';
import * as Y from 'yjs';
import { io } from 'socket.io-client';
import { Awareness } from 'y-protocols/awareness';
import * as awarenessProtocol from 'y-protocols/awareness';

export function useCollaboration(documentId: string, wsUrl: string, token?: string) {
  const ydoc = new Y.Doc();
  
  const socket = io(wsUrl, {
    query: {
      documentId
    },
    auth: {
      token
    }
  });

  socket.emit('join-document', documentId);

  socket.on('sync-document', (fullState: ArrayBuffer) => {
    Y.applyUpdate(ydoc, new Uint8Array(fullState));
  });

  ydoc.on('update', (update: Uint8Array) => {
    socket.emit('crdt-update', { 
      documentId, 
      update 
    });
  });

  socket.on('crdt-update', (update: ArrayBuffer) => {
    Y.applyUpdate(ydoc, new Uint8Array(update));
  });

  const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  const awareness = new Awareness(ydoc);
  const provider = { awareness };

  socket.on('awareness-update', (update: ArrayBuffer) => {
    awarenessProtocol.applyAwarenessUpdate(awareness, new Uint8Array(update), socket);
  });

  const activeUsers = ref<string[]>([]);

  const updateActiveUsers = () => {
    const states = awareness.getStates();
    const names: string[] = [];
    states.forEach((state, clientId) => {
      if (clientId !== awareness.clientID && state?.user?.name) {
        const name = state.user.name as string;
        if (!names.includes(name)) {
          names.push(name);
        }
      }
    });
    activeUsers.value = names;
  };

  awareness.on('update', ({ added, updated, removed }: any) => {
    const changedClients = added.concat(updated, removed);
    const update = awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients);
    socket.emit('awareness-update', { documentId, update });
    updateActiveUsers();
  });

  onBeforeUnmount(() => {
    if (socket) {
      socket.emit('leave-document', documentId);
      socket.disconnect();
    }
    if (ydoc) {
      ydoc.destroy();
    }
  });

  return {
    ydoc,
    provider,
    activeUsers,
    getRandomColor
  };
}
