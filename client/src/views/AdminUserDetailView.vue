<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userId = route.params.id;
</script>

<template>
  <div class="p-8 text-white">
    <h1>Dettaglio Utente</h1>
    <p>Stai visualizzando i dati dell'utente con ID: {{ userId }}</p>
    <button @click="router.back()" class="mt-4 p-2 bg-blue-500 rounded">Torna indietro</button>
  </div>
</template>