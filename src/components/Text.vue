<script setup>
import { ref, onMounted } from "vue";

const typeValue = ref("");
const showEllipsis = ref(false);

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  ellipsis: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["typeEnded", "ellipsisClicked"]);

const typeEffect = () => {
  if (typeValue.value.length < props.text.length) {
    typeValue.value += props.text.charAt(typeValue.value.length);
    setTimeout(typeEffect, 10);
  } else {
    emit("typeEnded");
  }
};

onMounted(() => {
  typeEffect();
  showEllipsis.value = props.ellipsis;
});

function endTyping() {
  typeValue.value = props.text;
}

function goNextSection() {
  showEllipsis.value = false;
  emit("ellipsisClicked");
}
</script>

<template>
  <div class="mb-4">
    <div @click="endTyping">
      {{ typeValue }}
    </div>
    <span
      class="font-bold cursor-pointer"
      v-if="typeValue === props.text && showEllipsis"
      @click="goNextSection"
    >
      >>
    </span>
  </div>
</template>
