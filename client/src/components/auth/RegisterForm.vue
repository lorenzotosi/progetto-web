<script setup lang="ts">
import { ref } from 'vue';
import type { RegisterPayload } from '../../types/auth.types';

defineProps<{ isLoading: boolean }>();
const emit = defineEmits<{
  (e: 'submit', payload: RegisterPayload): void;
  (e: 'switch-view'): void;
}>();

const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');

const onSubmit = () => {
  emit('submit', {
    email: email.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value
  });
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="auth-form">
    <div class="form-row">
      <div class="form-group">
        <label>Nome</label>
        <input v-model="firstName" type="text" required placeholder="Es. Mario" />
      </div>
      <div class="form-group">
        <label>Cognome</label>
        <input v-model="lastName" type="text" required placeholder="Es. Rossi" />
      </div>
    </div>

    <div class="form-group">
      <label>Email</label>
      <input v-model="email" type="email" required placeholder="email@esempio.it" />
    </div>

    <div class="form-group">
      <label>Password</label>
      <input v-model="password" type="password" required placeholder="********" minlength="6" />
    </div>

    <button type="submit" class="submit-btn" :disabled="isLoading">
      {{ isLoading ? 'Creazione in corso...' : 'Registrati' }}
    </button>

    <div class="switch-view">
      <p>Hai già un account? <a @click="$emit('switch-view')">Accedi qui</a></p>
    </div>
  </form>
</template>

<style scoped>
.auth-form { display: flex; flex-direction: column; gap: 1.2rem; }

.form-row { display: flex; flex-direction: column; gap: 1rem; }

@media (min-width: 480px) {
  .form-row { flex-direction: row; }
  .form-row .form-group { flex: 1; }
}

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }

.form-group label { font-size: 0.85rem; font-weight: 600; color: #444; }

.form-group input { padding: 0.8rem; border: 1.5px solid #eee; border-radius: 8px; }

.form-group input:focus { border-color: #4f46e5; outline: none; }

.submit-btn { background: #4f46e5; color: white; border: none; padding: 1rem; border-radius: 8px; font-weight: bold; cursor: pointer; }

.submit-btn:disabled { opacity: 0.6; }

.switch-view { text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #666; }

.switch-view a { color: #4f46e5; font-weight: bold; cursor: pointer; text-decoration: underline; }
</style>