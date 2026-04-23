<script setup lang="ts">
import { ref } from 'vue';
import { useClickOutside } from '../../composables/useClickOutside';
import BaseIcon from '../common/BaseIcon.vue';

const props = defineProps<{
  activeUsers: string[];
}>();

const showViewersDropdown = ref(false);
const viewersWrapperRef = ref<HTMLElement | null>(null);

useClickOutside(viewersWrapperRef, () => {
  showViewersDropdown.value = false;
});
</script>

<template>
  <div class="viewers-wrapper" ref="viewersWrapperRef" @click.stop="showViewersDropdown = !showViewersDropdown">
    <button class="viewers-btn" :title="activeUsers.length + ' persone stanno visualizzando'">
      <BaseIcon name="users" class="viewers-icon" size="18" />
      <span class="viewers-count-badge">{{ activeUsers.length }}</span>
    </button>
    <transition name="dropdown">
      <div class="viewers-dropdown" v-if="showViewersDropdown">
        <div class="viewers-dropdown-header">Persone nel documento</div>
        <div v-if="activeUsers.length === 0" class="viewers-empty">Nessun altro utente</div>
        <ul v-else class="viewers-list">
          <li v-for="name in activeUsers" :key="name" class="viewers-item">
            <span class="viewers-avatar">{{ name[0]?.toUpperCase() }}</span>
            <span class="viewers-name">{{ name }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.viewers-wrapper {
  position: relative;
}

.viewers-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px solid #dadce0;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #3c4043;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  height: 36px;
}

.viewers-btn:hover {
  background-color: rgba(0,0,0,0.04);
  border-color: #bdc1c6;
}

.viewers-icon {
  color: #5f6368;
}

.viewers-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
  min-width: 220px;
  z-index: 1000;
  overflow: hidden;
}

.viewers-dropdown-header {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #80868b;
  padding: 12px 16px 8px;
  border-bottom: 1px solid #f1f3f4;
}

.viewers-empty {
  padding: 12px 16px;
  font-size: 13px;
  color: #80868b;
}

.viewers-list {
  list-style: none;
  margin: 0;
  padding: 6px 0;
}

.viewers-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  transition: background-color 0.15s;
}

.viewers-item:hover {
  background-color: #f8f9fa;
}

.viewers-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.viewers-name {
  font-size: 13px;
  color: #202124;
  font-weight: 400;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
