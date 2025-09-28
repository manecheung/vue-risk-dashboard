<template>
  <div class="relative w-full" ref="selectRef">
    <button @click.prevent="toggleDropdown" @keydown.down.prevent="navigateOptions(1)"
      @keydown.up.prevent="navigateOptions(-1)" @keydown.enter.prevent="selectFocusedOption"
      @keydown.esc.prevent="closeDropdown" type="button"
      class="form-select text-left w-full flex justify-between items-center" aria-haspopup="listbox"
      :aria-expanded="isOpen" :aria-labelledby="labelId">
      <div v-if="multiple && modelValue && modelValue.length > 0" class="flex flex-wrap items-center flex-grow gap-1.5">
        <span v-for="value in modelValue" :key="value" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300">
          {{ getOptionLabelByValue(value) }}
          <button @click.stop.prevent="removeOption(value)" type="button" class="flex-shrink-0 ml-1.5 -mr-0.5 p-0.5 rounded-full inline-flex items-center justify-center text-sky-400 hover:bg-sky-500/40 hover:text-sky-200 focus:outline-none">
            <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
              <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
            </svg>
          </button>
        </span>
      </div>
      <span v-else :id="labelId" class="truncate">{{ selectedLabel }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 transition-transform"
        :class="{ 'rotate-180': isOpen }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>
    <Transition name="page-fade">
      <ul v-if="isOpen"
        :class="panelClasses"
        role="listbox" :aria-activedescendant="focusedOptionId">
        <li v-for="(option, index) in options" :key="index" :id="`option-${uid}-${index}`" role="option"
          :aria-selected="isSelected(option)" @click="selectOption(option)"
          @mouseenter="focusedIndex = index"
          class="px-3 py-2 text-sm text-slate-300 rounded-md cursor-pointer hover:bg-sky-500/20 flex items-center justify-between" :class="{
            'bg-sky-500/30 text-white': isSelected(option),
            'bg-sky-500/40': focusedIndex === index
          }">
          <span>{{ getOptionLabel(option) }}</span>
           <svg v-if="isSelected(option) && multiple" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Array],
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  direction: {
    type: String,
    default: 'down' // 'down' or 'up'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const selectRef = ref(null);
const focusedIndex = ref(-1);

const uid = Math.random().toString(36).substring(2, 9);
const labelId = `select-label-${uid}`;

const panelClasses = computed(() => ({
  'panel panel-simple absolute right-0 w-full p-2 z-30 backdrop-blur-md max-h-60 overflow-y-auto': true,
  'top-full mt-2': props.direction === 'down',
  'bottom-full mb-2': props.direction === 'up',
}));

const isObjectArray = computed(() => props.options.length > 0 && typeof props.options[0] === 'object' && props.options[0] !== null);

const getOptionValue = (option) => isObjectArray.value ? option[props.valueKey] : option;
const getOptionLabel = (option) => isObjectArray.value ? option[props.labelKey] : option;

const getOptionLabelByValue = (value) => {
  const option = props.options.find(opt => getOptionValue(opt) === value);
  return option ? getOptionLabel(option) : value;
};

const isSelected = (option) => {
  const value = getOptionValue(option);
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value);
  }
  return props.modelValue === value;
};

const selectedLabel = computed(() => {
  if (props.multiple) {
    return props.placeholder;
  }

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
  if (!isOpen.value) {
    focusedIndex.value = -1;
  }
};

const removeOption = (valueToRemove) => {
  if (props.multiple) {
    const updatedValues = props.modelValue.filter(value => value !== valueToRemove);
    emit('update:modelValue', updatedValues);
  }
};

const selectOption = (option) => {
  const value = getOptionValue(option);
  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = currentValues.indexOf(value);
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }
    emit('update:modelValue', currentValues);
  } else {
    emit('update:modelValue', value);
    closeDropdown();
  }
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