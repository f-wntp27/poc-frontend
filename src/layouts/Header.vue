<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import { useRoute, useRouter } from 'vue-router';
import defaultAvatar from '@/assets/images/default-avatar.png';
import thaiFlag from '@/assets/flag/th-TH.svg';
import engFlag from '@/assets/flag/en-US.svg';
import { useAppStore } from '@/stores/app.store';

const router = useRouter();
const appStore = useAppStore();
const userProfile = ref();
const locale = ref();
const items = ref([
  { label: 'โปรไฟล์', icon: 'mdi mdi-account' },
  // { separator: true },
  {
    label: 'ออกจากระบบ',
    icon: 'pi pi-fw pi-power-off',
    command: () => onLogout(),
  },
]);

const localteList = appStore.listLocale.map((v) => ({
  label: v,
}));

function onLogout() {
  router.push({ name: 'login' });
}

const toggle = (event: MouseEvent) => {
  userProfile.value.toggle(event);
};
</script>

<template>
  <Toolbar class="app-header">
    <template #start>
      <div class="flex align-items-center gap-2">
        <div class="flex align-items-center">
          <Sidebar />
        </div>
        <div class="d-flex align-items-center ml-4 font-bold text-xl">{{ `POC - ${useRoute().meta.title}` }}</div>
      </div>
    </template>

    <template #end>
      <!-- <div style="width: 40px" class="flex">
        <img
          :src="appStore.localeProvider === 'th-TH' ? thaiFlag : engFlag"
          class=""
          @click="(event) => locale.toggle(event)"
        />
        <Menu ref="locale" :model="localteList" :popup="true" class="mt-1 shadow-4" id="flag">
          <template #item="{ item }">
            <div class="flex justify-content-center" style="width: 10px">
              <img :src="item.label === 'th-TH' ? thaiFlag : engFlag" width="40" class="my-1" />
            </div>
          </template>
        </Menu>
      </div>
      &nbsp; &nbsp; 

      <span class="text-lg pr-4"> Anonymous </span>

      <div class="flex justify-content-center">
        <Avatar
          v-ripple
          :image="defaultAvatar"
          @click="toggle"
          style="width: 45px; height: 45px"
          shape="circle"
          class="avatar-profile shadow-4 p-ripple box"
        />

        <Menu ref="userProfile" :model="items" :popup="true" class="mt-1 shadow-4" />
      </div>-->
    </template>
  </Toolbar>
</template>

<style lang="scss">
.avatar-profile {
  border-radius: 50%;
  border: 2px solid white;
  &:hover {
    cursor: pointer;
    border: 2px solid opacity 0.7;
    background-color: rgb(0, 0, 0);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    // transition: 0.3s;
  }
}
</style>
