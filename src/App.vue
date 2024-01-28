<script setup>
import { onMounted, ref, reactive } from "vue";
import fullStory from "./assets/sekaisia.json";
import NameModal from "./components/NameModal.vue";
import NewObjectModal from "./components/NewObjectModal.vue";
import Text from "./components/Text.vue";
import ChoiceButton from "./components/ChoiceButton.vue";

const currentChapter = ref(null);
const nextChapter = ref(null);
const step = ref(0);
const { stories } = fullStory;
const loading = ref(true);
let player = reactive({
  name: null,
  currentHp: 100,
  maxHp: 100,
  currentMp: 20,
  maxMp: 20,
  str: 10,
  dex: 10,
  int: 10,
});

const newObjModal = ref(null);

function goToNextChapter(nxtChapter) {
  step.value = 0;
  currentChapter.value = stories.find((story) => story.chapter === nxtChapter);
  localStorage.setItem("chapterSave", JSON.stringify(currentChapter.value));
}

function checkChoiceBtn(choice) {
  nextChapter.value = choice.nextChapter;
  if (choice.newItem) {
    // look if there is already items in localstorage
    // if yes add new item to the items array
    if (localStorage.getItem("items")) {
      const items = JSON.parse(localStorage.getItem("items"));
      items.push(choice.newItem);
      localStorage.setItem("items", JSON.stringify(items));
    } else {
      // else create new array with the new item
      localStorage.setItem("items", JSON.stringify([choice.newItem]));
    }
    // trigger modal to show the new item
    newObjModal.value.getItem();
  } else {
    // if there is no new item, go to next chapter
    goToNextChapter(nextChapter.value);
  }
}

function initGame() {
  if (localStorage.getItem("chapterSave")) {
    currentChapter.value = JSON.parse(localStorage.getItem("chapterSave"));
    player = JSON.parse(localStorage.getItem("player"));
  } else {
    currentChapter.value = stories.find((story) => story.chapter === 1);
  }
}

onMounted(async () => {
  await initGame();
  loading.value = false;
});

function nextStep(ellipsis) {
  if (step.value > currentChapter.value.texts.length || ellipsis) {
    return;
  }
  step.value += 1;
}

function setPlayerName(name) {
  player.name = name;
  localStorage.setItem("player", JSON.stringify(player));
}
</script>

<template>
  <div>
    <NameModal @createPlayer="setPlayerName" />
    <div v-if="!loading && player.name">
      <div v-for="(text, index) in currentChapter.texts" :key="text">
        <Text
          v-if="index <= step"
          :text="text.text"
          @typeEnded="nextStep(text.ellipsis)"
          :ellipsis="text.ellipsis"
          @ellipsisClicked="nextStep"
        />
      </div>
      <div
        v-if="step >= currentChapter.texts.length"
        class="flex justify-around space-x-8"
      >
        <ChoiceButton
          v-for="choice in currentChapter.choices"
          :key="choice"
          :text="choice.text"
          @click="checkChoiceBtn(choice)"
        />
        <NewObjectModal
          ref="newObjModal"
          @NewObjModalClosed="goToNextChapter(nextChapter)"
        />
      </div>
    </div>
  </div>
</template>
