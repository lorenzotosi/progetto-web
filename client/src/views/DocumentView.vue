<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const documentId = route.params.id; // Leggiamo l'ID dall'URL
</script>

<template>
  <div class="editor-container">
    <h2>Editor del Documento</h2>
    <p>ID Documento: {{ documentId }}</p>
    </div>
</template>

<style scoped>
.editor-container { padding: 2rem; }
</style>