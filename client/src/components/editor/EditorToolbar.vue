<script setup lang="ts">
import { ref } from 'vue';
import type { Editor } from '@tiptap/vue-3';

const props = defineProps<{
  editor: Editor | null;
}>();

// Palette Colori
type HexColor = string;

const predefinedColors: HexColor[] = [
  '#000000', '#434343', '#666666', '#999999', // Scala di grigi
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', // Rossi/Viola
  '#3F51B5', '#2196F3', '#00BCD4', '#009688', // Blu/Azzurri
  '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', // Verdi/Gialli
  '#FF9800', '#FF5722', '#795548', '#607D8B'  // Aranci/Marroni
];

const showColorPalette = ref<boolean>(false);

// Metodo per applicare il colore e chiudere la palette
const applyColor = (color: HexColor) => {
  if (props.editor) {
    props.editor.chain().focus().setColor(color).run();
  }
  showColorPalette.value = false; // Nascondi la palette dopo la selezione
};

const showHighlightPalette = ref<boolean>(false);
const applyHighlight = (color: HexColor) => {
  if (props.editor) {
    if (!color) {
      props.editor.chain().focus().unsetHighlight().run();
    } else {
      props.editor.chain().focus().setHighlight({ color }).run();
    }
  }
  showHighlightPalette.value = false;
};
// Fine palette colori

const executeCommand = (action: () => void) => {
  if (props.editor?.isEditable) {
    action();
  } else {
    console.log("Click ignorato: modalità sola lettura");
  }
};

</script>

<template>
  <div v-if="editor">
    <div class="toolbar">
      <button @click="executeCommand(() => editor?.chain().focus().undo().run())" :disabled="!editor.can().undo()" title="Annulla">
        ⟲
      </button>
      <button @click="executeCommand(() => editor?.chain().focus().redo().run())" :disabled="!editor.can().redo()" title="Ripeti">
        ⟳
      </button>

      <div class="divider"></div>

      <select class="toolbar-select" @change="e => {
        const val = (e.target as HTMLSelectElement).value;
        if (val === 'p') executeCommand(() => editor?.chain().focus().setParagraph().run());
        else executeCommand(() => editor?.chain().focus().toggleHeading({ level: parseInt(val) as 1 | 2 | 3 | 4 | 5 | 6 }).run());
      }">
        <option value="p" :selected="editor.isActive('paragraph')">Testo normale</option>
        <option value="1" :selected="editor.isActive('heading', { level: 1 })">Titolo 1</option>
        <option value="2" :selected="editor.isActive('heading', { level: 2 })">Titolo 2</option>
        <option value="3" :selected="editor.isActive('heading', { level: 3 })">Titolo 3</option>
      </select>

      <div class="divider"></div>

      <select class="toolbar-select" @change="e => executeCommand(() => editor?.chain().focus().setFontFamily((e.target as HTMLSelectElement).value).run())">
        <option value="Arial" :selected="editor.isActive('textStyle', { fontFamily: 'Arial' })">Arial</option>
        <option value="Georgia" :selected="editor.isActive('textStyle', { fontFamily: 'Georgia' })">Georgia</option>
        <option value="Times New Roman" :selected="editor.isActive('textStyle', { fontFamily: 'Times New Roman' })">Times</option>
      </select>

      <div class="divider"></div>

      <input type="number" class="toolbar-input" :value="editor.getAttributes('textStyle').fontSize?.replace(/[pxt]+/g, '') || 11" min="8" max="72" title="Dimensione carattere" @change="e => executeCommand(() => editor?.chain().focus().setFontSize(`${(e.target as HTMLInputElement).value}pt`).run())" />

      <div class="divider"></div>

      <button @click="executeCommand(() => editor?.chain().focus().toggleBold().run())" :class="{ 'is-active': editor.isActive('bold') }" title="Grassetto" >
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
      </button>
      <button @click="executeCommand(() => editor?.chain().focus().toggleItalic().run())" :class="{ 'is-active': editor.isActive('italic') }" title="Corsivo">
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
      </button>
      <button @click="executeCommand(() => editor?.chain().focus().toggleUnderline().run())" :class="{ 'is-active': editor.isActive('underline') }" title="Sottolineato">
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
      </button>
      <div class="divider"></div>
      <button 
        @click="showColorPalette = !showColorPalette; showHighlightPalette = false" 
        :class="{ 'is-active': showColorPalette }"
        title="Colore testo"
      >
        <span 
          class="color-indicator" 
          :style="{ borderBottomColor: editor?.getAttributes('textStyle').color || '#000000' }"
        >
          A
        </span>
      </button>
      <button 
        @click="showHighlightPalette = !showHighlightPalette; showColorPalette = false" 
        :class="{ 'is-active': showHighlightPalette }"
        title="Colore evidenziatore"
      >
        <span 
          class="color-indicator" 
          :style="{ borderBottomColor: editor?.getAttributes('highlight').color || 'transparent' }"
        >
          <svg width="18" height="18" viewBox="0 -960 960 960"><path fill="currentColor" d="M544-400 440-504 240-304l104 104 200-200Zm-47-161 104 104 199-199-104-104-199 199Zm-84-28 216 216-229 229q-24 24-56 24t-56-24l-2-2-26 26H60l126-126-2-2q-24-24-24-56t24-56l229-229Zm0 0 227-227q24-24 56-24t56 24l104 104q24 24 24 56t-24 56L629-373 413-589Z"/></svg>
        </span>
      </button>
      <div class="divider"></div>

      <button @click="executeCommand(() => editor?.chain().focus().setTextAlign('left').run())" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" title="Allinea a sinistra">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21v-2h18v2zm0-4v-2h12v2zm0-4v-2h18v2zm0-4V7h12v2zm0-4V3h18v2z"/></svg>
      </button>
      <button @click="executeCommand(() => editor?.chain().focus().setTextAlign('center').run())" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" title="Allinea al centro">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21v-2h18v2zm4-4v-2h10v2zm-4-4v-2h18v2zm4-4V7h10v2zm-4-4V3h18v2z"/></svg>
      </button>
      <button @click="executeCommand(() => editor?.chain().focus().setTextAlign('right').run())" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" title="Allinea a destra">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21v-2h18v2zm6-4v-2h12v2zm-6-4v-2h18v2zm6-4V7h12v2zm-6-4V3h18v2z"/></svg>
      </button>
      <button @click="executeCommand(() => editor?.chain().focus().setTextAlign('justify').run())" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }" title="Giustifica">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 21v-2h18v2zm0-4v-2h18v2zm0-4v-2h18v2zm0-4V7h18v2zm0-4V3h18v2z"/></svg>
      </button>
      <div class="divider"></div>

      <button @click="executeCommand(() => editor?.chain().focus().toggleBulletList().run())" :class="{ 'is-active': editor.isActive('bulletList') }" title="Elenco puntato">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M8 20v-2h13v2zM4 21q-.825 0-1.412-.587T2 19q0-.825.588-1.412T4 17q.825 0 1.413.588T6 19q0 .825-.587 1.413T4 21m4-7v-2h13v2zM4 14q-.825 0-1.412-.587T2 12q0-.825.588-1.412T4 10q.825 0 1.413.588T6 12q0 .825-.587 1.413T4 14m4-7V5h13v2zM4 7q-.825 0-1.412-.587T2 5q0-.825.588-1.412T4 3q.825 0 1.413.588T6 5q0 .825-.587 1.413T4 7"/></svg>
      </button>
      <button @click="executeCommand(() => editor?.chain().focus().toggleOrderedList().run())" :class="{ 'is-active': editor.isActive('orderedList') }" title="Elenco numerato">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
      </button>
    </div>

    <!-- Palette fluttuante fuori dalla toolbar principale -->
    <div v-if="showColorPalette" class="color-palette-bar">
      <button
        v-for="color in predefinedColors"
        :key="'text-'+color"
        class="color-swatch"
        :style="{ backgroundColor: color }"
        @click="applyColor(color)"
      ></button>
    </div>

    <div v-if="showHighlightPalette" class="color-palette-bar">
      <button class="color-swatch" style="background-color: transparent; border: 1px dashed #ccc;" title="Nessun colore" @click="applyHighlight('')"></button>
      <button
        v-for="color in predefinedColors"
        :key="'bg-'+color"
        class="color-swatch"
        :style="{ backgroundColor: color }"
        @click="applyHighlight(color)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  background: #edf2fa;
  padding: 0.4rem 1rem;
  border-radius: 40px;
  margin-bottom: 2rem;
  position: sticky;
  top: 1rem;
  z-index: 10;
  max-width: 95vw;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}
.toolbar::-webkit-scrollbar {
  display: none;
}

.toolbar button {
  border: none;
  background: transparent;
  padding: 0.4rem;
  margin: 0 0.1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444746;
  transition: background-color 0.2s ease;
}

.toolbar button:hover:not(:disabled) {
  background-color: #e1e5ea;
}

.toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar button.is-active {
  background-color: #d3e3fd;
  color: #0b57d0;
}

.toolbar-select, .toolbar-input {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0.3rem;
  font-size: 0.9rem;
  color: #444746;
  cursor: pointer;
}
.toolbar-select:hover, .toolbar-input:hover {
  background-color: #e1e5ea;
}
.toolbar-input {
  width: 50px;
  text-align: center;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: #c7c7c7;
  margin: 0 0.5rem;
  flex-shrink: 0;
}

/* Stile per la "A" col trattino colorato sotto */
.color-indicator {
  font-family: 'Times New Roman', serif;
  font-size: 1.1rem;
  font-weight: bold;
  color: #444746;
  border-bottom: 3px solid #000000;
  padding-bottom: 1px;
  line-height: 1;
  display: inline-block;
}

/* Contenitore della palette - appare come una barra secondaria */
.color-palette-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 1px solid #e1e5ea;
  border-radius: 8px;
  max-width: 95vw;
  margin-top: -1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  animation: slideDown 0.2s ease-out;
  position: sticky;
  top: 4.5rem;
  z-index: 9;
}

/* I singoli quadratini di colore - Grandezza ottimizzata per il touch (Mobile) */
.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.1s;
}

.color-swatch:hover, .color-swatch:active {
  transform: scale(1.1);
  border-color: rgba(0,0,0,0.3);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
