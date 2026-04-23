import { onMounted, onBeforeUnmount, type Ref } from 'vue';

export function useClickOutside(elRef: Ref<HTMLElement | null>, callback: () => void) {
  const handleClickOutside = (event: MouseEvent) => {
    if (elRef.value && !elRef.value.contains(event.target as Node)) {
      callback();
    }
  };

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });
}
