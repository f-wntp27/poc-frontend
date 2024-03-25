<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const onClick = () => {
  router.replace({ name: 'home' });
};
</script>
<template>
  <div class="text-err">
    <div style="font-size: 70px">ERROR!</div>
    <div style="font-size: 60px">404</div>
    <div style="font-size: 30px">Page not found</div>
    <Button @click="onClick()" class="p-button-rounded p-button-raised p-button-sm btn-color-home">หน้าแรก</Button>
  </div>
</template>

<style scoped>
.text-err {
  color: #466890;
  align-items: center;
  text-align: center;
}
.btn-color-home {
  background-color: #4584ab;
  color: #e3f2fd;
}
.btn-color-home:hover {
  background-color: #e3f2fd;
  color: #4584ab;
}
</style>
