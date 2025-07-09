<template>
  <div class="relative w-full" ref="selectRef">
    <button @click.prevent="toggleDropdown" @keydown.down.prevent="navigateOptions(1)"
      @keydown.up.prevent="navigateOptions(-1)" @keydown.enter.prevent="selectFocusedOption"
      @keydown.esc.prevent="closeDropdown" type="button"
      class="form-select text-left w-full flex justify-between items-center" aria-haspopup="listbox"
      :aria-expanded="isOpen" :aria-labelledby="labelId">
      <span :id="labelId" class="truncate">{{ selectedLabel }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 transition-transform"
        :class="{ 'rotate-180': isOpen }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>
    <Transition name="page-fade">
      <ul v-if="isOpen"
        class="panel panel-simple absolute top-full right-0 mt-2 w-full p-2 z-30 backdrop-blur-md max-h-60 overflow-y-auto"
        role="listbox" :aria-activedescendant="focusedOptionId">
        <li v-for="(option, index) in options" :key="index" :id="`option-${uid}-${index}`" role="option"
          :aria-selected="modelValue === getOptionValue(option)" @click="selectOption(option)"
          @mouseenter="focusedIndex = index"
          class="px-3 py-2 text-sm text-slate-300 rounded-md cursor-pointer hover:bg-sky-500/20" :class="{
            'bg-sky-500/30 text-white': modelValue === getOptionValue(option),
            'bg-sky-500/40': focusedIndex === index
          }">
          {{ getOptionLabel(option) }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择'
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const selectRef = ref(null);
const focusedIndex = ref(-1);

const uid = Math.random().toString(36).substring(2, 9);
const labelId = `select-label-${uid}`;

const isObjectArray = computed(() => props.options.length > 0 && typeof props.options[0] === 'object' && props.options[0] !== null);

const getOptionValue = (option) => isObjectArray.value ? option.value : option;
const getOptionLabel = (option) => isObjectArray.value ? option.label : option;

const selectedLabel = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null || props.modelValue === '') {
    return props.placeholder;
  }
  const selectedOption = props.options.find(opt => getOptionValue(opt) === props.modelValue);
  return selectedOption ? getOptionLabel(selectedOption) : props.placeholder;
});

const focusedOptionId = computed(() => {
  return focusedIndex.value >= 0 ? `option-${uid}-${focusedIndex.value}` : null;
});

const closeDropdown = () => {
  isOpen.value = false;
  focusedIndex.value = -1;
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    focusedIndex.value = props.options.findIndex(opt => getOptionValue(opt) === props.modelValue);
  } else {
    focusedIndex.value = -1;
  }
};

const selectOption = (option) => {
  emit('update:modelValue', getOptionValue(option));
  closeDropdown();
};

const selectFocusedOption = () => {
  if (isOpen.value && focusedIndex.value >= 0) {
    selectOption(props.options[focusedIndex.value]);
  } else if (!isOpen.value) {
    isOpen.value = true;
  }
};

const navigateOptions = (direction) => {
  if (!isOpen.value) {
    isOpen.value = true;
    return;
  }
  const newIndex = focusedIndex.value + direction;
  if (newIndex >= 0 && newIndex < props.options.length) {
    focusedIndex.value = newIndex;
    nextTick(() => {
      const optionEl = document.getElementById(`option-${uid}-${newIndex}`);
      optionEl?.scrollIntoView({ block: 'nearest' });
    });
  }
};

const closeOnOutsideClick = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => document.addEventListener('click', closeOnOutsideClick));
onUnmounted(() => document.removeEventListener('click', closeOnOutsideClick));
</script>