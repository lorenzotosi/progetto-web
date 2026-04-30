<script setup lang="ts">
import type { User } from '../../types/user.types';
import UserAvatar from '../common/UserAvatar.vue';
import StatusIndicator from './StatusIndicator.vue';
import { computed } from 'vue';

interface Props {
  user: User & { lastSeen?: string; isOnline?: boolean };
}
const props = defineProps<Props>();

const formattedLastSeen = computed(() => {
  if (props.user.isOnline) return 'Online';
  if (!props.user.lastSeen) return 'Mai effettuato';
  return new Date(props.user.lastSeen).toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
});
</script>

<template>
  <tr class="user-row">
    <td class="status-cell">
      <StatusIndicator :is-online="user.isOnline || false" />
    </td>
    <td>
      <UserAvatar :user="user" size="sm" />
    </td>
    <td class="name-cell">
      {{ user.firstName }} {{ user.lastName }}
    </td>
    <td class="email-cell">
      {{ user.email }}
    </td>
    <td class="time-cell">
      <span :class="{ 'online-text': user.isOnline }">
        {{ formattedLastSeen }}
      </span>
    </td>
    <td class="action-cell">
      <router-link :to="`/admin/user/${user.id}`" class="info-link">
        <span class="arrow-icon">→</span>
      </router-link>
    </td>
  </tr>
</template>

<style scoped>
.user-row {
  border-bottom: 1px solid #3f3f3f;
  transition: background-color 0.2s;
}

.user-row:hover {
  background-color: #2b2d31;
}

td {
  padding: 12px 16px;
  color: #dbdee1;
  vertical-align: middle;
}

.online-text {
  color: #23a559;
  font-weight: 500;
}

.info-link {
  color: #b5bac1;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.info-link:hover {
  color: #ffffff;
}

.arrow-icon {
  display: inline-block;
  transition: transform 0.2s;
}

.info-link:hover .arrow-icon {
  transform: translateX(4px);
}
</style>