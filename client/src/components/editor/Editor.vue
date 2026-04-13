<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { onBeforeUnmount } from 'vue';

// Definiamo le props che il componente padre ci passerà
const props = defineProps<{
  initialContent: Record<string, any>; // Il JSON del documento
}>();

// Inizializziamo Tiptap
const editor = useEditor({
  content: props.initialContent,
  extensions: [
    StarterKit, // Abilita grassetto, corsivo, liste, etc.
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose focus:outline-none', // Classe base per lo stile
    },
  },
});

// Pulizia della memoria quando cambiamo pagina
onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div class="editor-wrapper" v-if="editor">
    <div class="toolbar">
      <button 
        @click="editor.chain().focus().toggleBold().run()" 
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <b>B</b>
      </button>
      <button 
        @click="editor.chain().focus().toggleItalic().run()" 
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <i>I</i>
      </button>
      <button 
        @click="editor.chain().focus().toggleStrike().run()" 
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <s>S</s>
      </button>
      <div class="divider"></div>
      <button 
        @click="editor.chain().focus().setTextAlign('left').run()" 
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
      >
        Left
      </button>
      <button 
        @click="editor.chain().focus().setTextAlign('center').run()" 
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      >
        Center
      </button>
      <button 
        @click="editor.chain().focus().setTextAlign('right').run()" 
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      >
        Right
      </button>
      <button 
        @click="editor.chain().focus().setTextAlign('justify').run()" 
        :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
      >
        Justify
      </button>
      <div class="divider"></div>
      <button @click="editor.chain().focus().clearNodes().run()">
        Pulisci Formattazione
      </button>
    </div>

    <div class="document-page" @click="editor?.commands.focus()">
      <EditorContent :editor="editor" class="editor-content" />
    </div>
  </div>
</template>

<style scoped>
/* Stile per simulare un foglio di Google Docs */
.editor-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-top: 1rem;
}

.toolbar {
  display: flex;
  gap: 0.5rem;
  background: black;
  padding: 0.5rem 1rem;
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  margin-bottom: 2rem;
  position: sticky;
  top: 1rem;
  z-index: 10;
}

.toolbar button {
  border: none;
  background: transparent;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  min-width: 32px;
}

.toolbar button:hover {
  background-color: #f1f3f4;
}

.toolbar button.is-active {
  background-color: #d3e3fd;
  color: #0b57d0;
}

.divider {
  width: 1px;
  background-color: #e0e0e0;
  margin: 0 0.5rem;
}

.document-page {
  background: white;
  width: 21cm;
  min-height: 29.7cm;
  padding: 2.5cm;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  border-radius: 2px;
  margin-bottom: 2rem;
  text-align: left;
  cursor: text; 
}

:deep(.ProseMirror) {
  min-height: 24cm;
  outline: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 11pt;
  line-height: 1.5;
  color: #000000;
}

:deep(.ProseMirror p) {
  margin-top: 0;
  margin-bottom: 1rem;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror:focus) {
  outline: none;
}
</style>