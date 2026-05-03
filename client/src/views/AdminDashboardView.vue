<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
import AdminUserRow from '../components/admin/AdminUserRow.vue';
import { AdminService, type AdminDashboardUser } from '../services/admin.service';
import { useRouter } from 'vue-router';
import {socketService} from "../services/socket.service.ts";

const router = useRouter();

const users = ref<AdminDashboardUser[]>([]);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);

const navigateBack = () => {
  router.push('/');
};

const fetchUsers = async () => {
  try {
    errorMessage.value = null;
    users.value = await AdminService.getAllUsers();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || 'Errore durante il recupero degli utenti.';
    console.error('[AdminDashboard] Fetch error:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const socket = socketService.getSocket();

  if (socket && socket.connected) {
    bootstrapDashboard(socket);
  } else if (socket) {
    socket.on('connect', () => {
      bootstrapDashboard(socket);
    });
  } else {
    fetchUsers();
  }
});

const bootstrapDashboard = (socket: any) => {
  socket.emit('join_admin_dashboard', () => {
    fetchUsers();
  });

  socket.on('presence_update', (data: { userId: string, isOnline: boolean, lastSeen?: string }) => {
    const index = users.value.findIndex(u => u.id === data.userId);
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        isOnline: data.isOnline,
        ...(data.lastSeen && { lastSeen: data.lastSeen })
      };
    }
  });
};

onUnmounted(() => {
  const socket = socketService.getSocket();
  if (socket) {
    socket.emit('leave_admin_dashboard');
    socket.off('presence_update');
  }
});
</script>

<template>
  <div class="admin-container">
    <header class="admin-header">
      <button @click="navigateBack" class="back-button" aria-label="Torna alla Dashboard">
        <span class="icon">←</span> Torna al Drive
      </button>

      <div class="header-titles">
        <h1>Gestione Utenti</h1>
        <p class="subtitle">Monitoraggio accessi e permessi di sistema</p>
      </div>
    </header>

    <div v-if="isLoading" class="loading-state">
      Caricamento dati di sistema in corso...
    </div>

    <div v-else-if="errorMessage" class="error-state">
      {{ errorMessage }}
    </div>

    <div class="table-container shadow-xl">
      <table class="admin-table">
        <thead>
        <tr>
          <th class="status-col"></th>
          <th>Avatar</th>
          <th>Nome Completo</th>
          <th>Email</th>
          <th>Ultimo Accesso</th>
          <th class="action-col">Info</th>
        </tr>
        </thead>
        <tbody>
        <AdminUserRow
            v-for="user in users"
            :key="user.id"
            :user="user"
        />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #1e1f22;
  padding: 40px 20px;
  color: #f23f42;
}

.admin-header {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.back-button {
  align-self: flex-start;

  border: 1px solid #3f3f3f;
  background: #2b2d31 none;
  color: #dbdee1;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: #3f4147;
  color: #ffffff;
  border-color: #5865F2;
}

.header-titles {
  text-align: center;
}

.header-titles h1 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
  color: #dbdee1;
}

.header-titles .subtitle {
  color: #949BA4;
  font-size: 1rem;
  margin-top: 8px;
}

.loading-state, .error-state {
  padding: 40px;
  text-align: center;
  background-color: #2b2d31;
  border-radius: 8px;
  color: #b5bac1;
}

.error-state {
  color: #f23f42;
  border: 1px solid #f23f42;
}

.table-container {
  background-color: #2b2d31;
  border-radius: 8px;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background-color: #232428;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  color: #949ba4;
}

th {
  padding: 16px;
  font-weight: 600;
}

.status-col { width: 40px; }
.action-col { width: 60px; text-align: center; }

@media (max-width: 768px) {
  .email-cell, th:nth-child(4) { display: none; }
}
</style>