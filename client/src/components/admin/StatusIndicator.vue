<script setup lang="ts">
interface Props {
  isOnline: boolean;
}
defineProps<Props>();
</script>

<template>
  <div class="status-dot" :class="{ online: isOnline }" :title="isOnline ? 'Online' : 'Offline'"></div>
</template>

<style scoped>
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #747f8d;
  border: 2px solid #1e1f22;
  flex-shrink: 0;
}

.status-dot.online {
  background-color: #23a559;
}
</style>