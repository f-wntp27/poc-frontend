<script setup lang="ts">
import Header from './Header.vue';
import Footer from './Footer.vue';
import Breadcrumb from './Breadcrumb.vue';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Swal from 'sweetalert2';

const authicationCheckerUnscribe = ref<number>(0);
const sessionExpired = ref<boolean>(false);
</script>

<template>
  <Header />
  <div class="app-container px-3 pt-2">
    <div class="pb-2">
      <Breadcrumb />
    </div>
    <div class="card-content">
      <div class="px-0">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="`${route.path}`" />
        </router-view>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped lang="scss">
.card-content {
  background-color: rgb(255, 255, 255);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;

  min-height: calc(100vh - 150px);
}
</style>
