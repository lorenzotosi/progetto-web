<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title?: string;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <button class="close-btn" @click="$emit('close')" aria-label="Chiudi modale">&times;</button>
        <h2 v-if="title" class="modal-title">{{ title }}</h2>

        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  width: 95%;
  max-width: 450px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.modal-title { margin-top: 0; margin-bottom: 1rem; color: #333; }

.close-btn {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; font-size: 1.5rem;
  cursor: pointer; color: #666; transition: color 0.2s;
}

.close-btn:hover { color: #000; }

@media (min-width: 480px) {
  .modal-content {
    padding: 2rem;
  }
}
</style>