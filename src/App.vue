<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { ChatRoom } from "./ChatRoom";
import type { Message } from "./Message";
import { User } from "./User";

const room = reactive(new ChatRoom("Lab chat"));
const alex = new User("alex", "Alex");
const sam = new User("sam", "Sam");

room.join(alex);
room.join(sam);
room.sendMessage(sam.id, "Hey! Are we ready for the chat demo?");
room.sendMessage(alex.id, "Almost. Try editing this message or searching for demo.");

const activeUserId = ref(alex.id);
const query = ref("");
const draft = ref("");
const editingId = ref<number | null>(null);
const editText = ref("");
const history = ref<HTMLElement | null>(null);
const members = computed(() => room.getMembers());
const messages = computed(() =>
  query.value.trim() ? room.searchMessages(query.value) : room.getMessages(),
);

async function sendMessage() {
  if (!draft.value.trim()) return;

  room.sendMessage(activeUserId.value, draft.value);
  draft.value = "";
  query.value = "";
  await nextTick();
  if (history.value) history.value.scrollTop = history.value.scrollHeight;
}

function startEditing(message: Message) {
  editingId.value = message.id;
  editText.value = message.getText();
}

function saveEdit(messageId: number) {
  if (!editText.value.trim()) return;

  room.editMessage(activeUserId.value, messageId, editText.value);
  cancelEdit();
}

function cancelEdit() {
  editingId.value = null;
  editText.value = "";
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
  <main class="chat">
    <aside class="sidebar">
      <p class="brand">MWD <span>Chat</span></p>
      <p class="label">Participants</p>
      <ul class="members">
        <li v-for="member in members" :key="member.id">
          <span class="avatar" :class="member.id">{{ member.name[0] }}</span>
          {{ member.name }}
          <small v-if="member.id === activeUserId">You</small>
        </li>
      </ul>
      <label class="account">
        <span class="label">Chat as</span>
        <select v-model="activeUserId" @change="cancelEdit">
          <option v-for="member in members" :key="member.id" :value="member.id">
            {{ member.name }}
          </option>
        </select>
      </label>
    </aside>

    <section class="conversation" aria-labelledby="room-title">
      <header class="room-header">
        <div>
          <h1 id="room-title">{{ room.name }}</h1>
          <p>{{ members.length }} participants</p>
        </div>
        <input v-model="query" type="search" placeholder="Search messages" aria-label="Search messages">
      </header>

      <div ref="history" class="history">
        <p v-if="!messages.length" class="empty">No messages found.</p>
        <article
          v-for="message in messages"
          :key="message.id"
          class="message"
          :class="{ own: message.author.id === activeUserId }"
        >
          <span class="avatar" :class="message.author.id">{{ message.author.name[0] }}</span>
          <div class="message-content">
            <div class="message-meta">
              <strong>{{ message.author.name }}</strong>
              <time :datetime="message.sentAt.toISOString()">{{ formatTime(message.sentAt) }}</time>
              <small v-if="message.getEditedAt()">Edited</small>
            </div>
            <form v-if="editingId === message.id" class="edit-form" @submit.prevent="saveEdit(message.id)">
              <input v-model="editText" aria-label="Edit message" @keydown.esc="cancelEdit">
              <div class="edit-actions">
                <button type="button" class="secondary" @click="cancelEdit">Cancel</button>
                <button :disabled="!editText.trim()">Save</button>
              </div>
            </form>
            <div v-else class="message-body">
              <p>{{ message.getText() }}</p>
              <button v-if="message.author.id === activeUserId" type="button" class="secondary" @click="startEditing(message)">
                Edit
              </button>
            </div>
          </div>
        </article>
      </div>

      <form class="composer" @submit.prevent="sendMessage">
        <input v-model="draft" placeholder="Write a message…" aria-label="Message">
        <button :disabled="!draft.trim()">Send</button>
      </form>
    </section>
  </main>
</template>
