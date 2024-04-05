<script setup lang="ts">
import { useAppStore } from '@/stores/app.store';
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { sleep } from '@/utils';

const appStore = useAppStore();
const props = defineProps({
  nameHeader: {
    type: String,
    default: '',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  onBeforeMounted: { type: Function, required: false },
});
const isLoading = ref(true);
onBeforeMount(async () => {
  if (props.onBeforeMounted) {
    try {
      await props.onBeforeMounted();
      isLoading.value = false;
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error,
      });
    }
  } else {
    await sleep(500);
    isLoading.value = false;
  }
});
</script>

<template>
  <Loading :show="isLoading" />
  <div class="p-4">
    <div class="text-left mb-5" v-if="props.showHeader">
      <span class="text-900 text-2xl font-medium my-3 header-layout shadow-4">{{ props.nameHeader }}</span>
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.header-layout {
  padding: 12px;
  border-radius: 10px;
  background: rgb(186 230 253);
}
</style>
