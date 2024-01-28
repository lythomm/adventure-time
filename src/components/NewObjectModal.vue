<script setup>
import { ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import itemsList from "../assets/items.json";

const isOpen = ref(false);
const newItem = ref(null);
const { items } = itemsList;

const emit = defineEmits(["NewObjModalClosed"]);

function closeModal() {
  isOpen.value = false;
  emit("NewObjModalClosed");
}
function openModal() {
  isOpen.value = true;
}

function getItem() {
  const itemsArray = JSON.parse(localStorage.getItem("items"));
  newItem.value = items.find(
    (item) => item.id === itemsArray[itemsArray.length - 1],
  );
  openModal();
}

defineExpose({
  getItem,
});
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                Vous avez obtenu un nouvel objet !
              </DialogTitle>
              <div class="mt-2">
                <p class="text-md font-bold">
                  {{ newItem.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ newItem.description }}
                </p>
                <div>
                  <p v-if="newItem.atk">Dégats d'attaque : {{ newItem.atk }}</p>
                  <p v-if="newItem.str">Force : +{{ newItem.str }}</p>
                  <p v-if="newItem.dex">Dextérité : +{{ newItem.dex }}</p>
                  <p v-if="newItem.int">Intelligence : +{{ newItem.int }}</p>
                </div>
              </div>

              <div class="mt-4 flex justify-end">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Confirmer
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
