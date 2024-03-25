<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import UserService from '@/services/userService';
// import { useUserStore } from '@/stores/user.store';
import Footer from '@/layouts/Footer.vue';
import type { Login } from '@/models';

import { useToast } from 'primevue/usetoast';
import { sleep } from '@/utils';
import Button from 'primevue/button';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Swal from 'sweetalert2';

import { useAppStore } from '@/stores/app.store';

const form = ref<Login>({
  username: '',
  password: '',
});

// const user = useUserStore();
const toast = useToast();
const appStore = useAppStore();
const isLoading = ref<boolean>(false);

const rules = {
  username: { required },
  password: { required },
};

const v$ = useVuelidate(rules, form.value, { $autoDirty: true, $lazy: true });

const onLogin = async () => {
  isLoading.value = true;
};

onMounted(() => {
  // images.value.then((data: any) => (images.value = data));
});
</script>

<template>
  <div class="flex flex-column lg:flex-row lg:p-8">
    <div class="w-full lg:w-5 flex flex-column align-items-center justify-content-center gap-3 lg:py-5 pt-5">
      <div class="flex justify-content-center">
        <img src="@/assets/images/extend-logo.jpg" width="350" height="180" />
      </div>
    </div>

    <div class="w-full lg:w-2">
      <Divider layout="vertical" class="hidden lg:flex"></Divider>
      <Divider layout="horizontal" class="flex lg:hidden"></Divider>
    </div>
    <div class="w-full lg:w-5 flex flex-column align-items-center justify-content-center">
      <div class="text-center mb-5">
        <div class="text-900 text-4xl font-medium mb-3">POC · เข้าสู่ระบบ</div>
      </div>
      <div>
        <label for="username" class="block text-900 text-xl font-medium mb-2">ชื่อผู้ใช้ :</label>
        <InputText
          id="username"
          type="text"
          placeholder="Username"
          class="w-full lg:w-30rem mb-5"
          v-model="form.username"
        />
        <label for="password" class="block text-900 font-medium text-xl mb-2">รหัสผ่าน :</label>
        <Password
          id="password"
          v-model="form.password"
          placeholder="Password"
          :toggleMask="true"
          class="w-full mb-5"
        ></Password>
        <Button label="เข้าสู่ระบบ" class="w-full text-lg" @click="onLogin()"></Button>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped lang="scss">
@media only screen and (max-width: 600px) {
  img {
    width: 200px;
    height: 100px;
  }
}
</style>
