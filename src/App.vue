<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useAppStore } from '@/stores/app.store';

const appStore = useAppStore();

onBeforeMount(() => {
  // app.changeLocale();
  appStore.preLoading(700);
});
</script>

<template>
  <div class="app-main">
    <Toast position="top-right" />
    <Loading :show="appStore.isLoading.value" />
    <router-view />
  </div>
</template>

<style global lang="scss">
@import '@/styles/_variable.scss';
@import '@/styles/_base.scss';
@import '@/styles/_theme.scss';
@import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
@import '@mdi/font/css/materialdesignicons.css';
</style>
