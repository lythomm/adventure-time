<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  set,
  onValue,
  onChildAdded,
  onDisconnect,
} from "firebase/database";
import fullStory from "./assets/sekaisia.json";
import NameModal from "./components/NameModal.vue";
import Text from "./components/Text.vue";
import ChoiceButton from "./components/ChoiceButton.vue";

const playerId = ref(null);
const playerRef = ref(null);
const playerName = ref(null);
const currentChapter = ref(null);
const step = ref(0);
const { stories } = fullStory;
const loading = ref(true);

function initGame() {
  console.log("init game");
  const allPlayersRef = dbRef(getDatabase(), "players");

  onValue(allPlayersRef, (snapshot) => {
    console.log(snapshot.val());
    localStorage.setItem("players", JSON.stringify(snapshot.val()));
    console.log(localStorage.getItem("players"));
  });
  onChildAdded(allPlayersRef, (snapshot) => {
    console.log("Joueur ajouté :", snapshot.val());
  });
}

function loginPlayer(nameOfPlayer) {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      playerId.value = user.uid;
      playerRef.value = dbRef(getDatabase(), `players/${playerId.value}`);
      playerName.value = localStorage.getItem("playerName");

      set(playerRef.value, {
        name: nameOfPlayer,
        health: 100,
      });

      // Remove from firebase when user logs out
      onDisconnect(playerRef.value).remove();

      initGame();
    }
  });

  signInAnonymously(auth).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  });
}

onMounted(() => {
  if (localStorage.getItem("chapterSave")) {
    currentChapter.value = localStorage.getItem("chapterSave");
  } else {
    currentChapter.value = stories.find((story) => story.chapter === 1);
    console.log(currentChapter.value);
  }
  loading.value = false;
});
</script>

<template>
  <div v-if="!loading">
    <!-- <NameModal @createPlayer="loginPlayer" /> -->
    <!-- <Text
      :text="text"
      @click="step += 1"
      @typeEnded="step = 1"
      :ellipsis="false"
    />
    <Text
      v-if="step >= 1"
      :text="text2"
      :ellipsis="true"
      @typeEnded="step = 2"
      @ellipsisClicked="step = 2"
    /> -->
    <div v-for="(text, index) in currentChapter.texts" :key="text">
      <Text :text="text" @click="step += index" />
    </div>
    <div class="flex justify-around space-x-8">
      <ChoiceButton
        v-for="choice in currentChapter.choices"
        :key="choice"
        :text="choice.text"
      />
    </div>
  </div>
</template>
