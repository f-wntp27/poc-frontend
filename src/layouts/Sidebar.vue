<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/stores/app.store';
import { useRoute } from 'vue-router';

const route = useRoute();
const appStore = useAppStore();
const openSidebar = ref(false);

function onSelectMenu() {
  openSidebar.value = false;
}
</script>

<template>
  <div class="card flex justify-center">
    <Sidebar
      v-model:visible="openSidebar"
      position="left"
      style="width: 360px"
      :showCloseIcon="false"
      :baseZIndex="10000"
    >
      <template #header>
        <img src="@/assets/images/sidebar-logo.png" width="320" alt="logo" />
      </template>

      <div v-for="item of appStore.getMenu.value" :key="item.path">
        <router-link
          :to="{
            path: item.path,
          }"
        >
          <a
            class="flex align-items-center cursor-pointer text-color px-3 py-3 cursor-hover p-ripple box border-y shadow-1"
            :class="{ 'active-menu': item.path === route.path }"
            v-ripple
            @click="onSelectMenu"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <span v-if="item.children" class="pi pi-angle-down text-primary ml-auto" />
          </a>
        </router-link>
      </div>
    </Sidebar>
    <Button icon="pi pi-bars" class="p-button-xl shadow-4" @click="openSidebar = true" />
  </div>
</template>

<style lang="scss">
.p-sidebar {
  .p-sidebar-content {
    padding: 0;
  }
}

.cursor-hover {
  font-size: 16px;
  &:hover {
    background-color: rgb(231, 231, 231);
  }
}

.active-menu {
  font-family: 600;
  background-color: rgb(197, 197, 197);
}

.border-y {
  // border-top: 1px solid;
  border-bottom: 1px solid rgb(192, 192, 192);
}
</style>
