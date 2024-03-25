<script setup lang="ts">
import { reactive } from 'vue';
import { useHttpService } from '@/services/http.services';
import Swal from 'sweetalert2';
import type { ImporttationDrugResquestModel } from '@/models';
import { useAppStore } from '@/stores/app.store';
import { toastMsg } from '@/utils/notification';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const httpService = useHttpService();
const appStore = useAppStore();
const toast = toastMsg();

const form = reactive<ImporttationDrugResquestModel>({
  drugName: '',
  drugIngredients: '',
  drugPrice: 0,
  drugUnit: '',
});

const v$ = useVuelidate(
  {
    drugName: { required },
    drugIngredients: { required },
    drugPrice: { required },
    drugUnit: { required },
  },
  form,
  { $autoDirty: true, $lazy: true },
);

async function clearForm() {
  form.drugName = '';
  form.drugIngredients = '';
  form.drugPrice = 0;
  form.drugUnit = '';

  v$.value.$reset();
}

async function onSubmitForm() {
  const valid = await v$.value.$validate();

  if (!valid) {
    toast.warning('ต้องกรอกข้อมูลให้ครบถ้วน');
    return;
  }

  Swal.fire({
    title: 'ยืนยัน ?',
    text: 'คุณต้องการยืนยันการขอใบขออนุญาตนำเข้ายาหรือไม่ ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
  }).then(async (result) => {
    if (result.isConfirmed) {
      appStore.isLoading.value = true;
      await httpService
        .post('/api/importation-drug-req/submit', form)
        .then(() => {
          toast.success('ยืนยันการขอใบขออนุญาตนำเข้ายาสำเร็จแล้ว');
          clearForm();
          appStore.isLoading.value = false;
        })
        .catch((error) => {
          toast.error(error.response.data.errors);
          appStore.isLoading.value = false;
        });
    }
  });
}

function onClear() {
  Swal.fire({
    title: 'ล้าง ?',
    text: 'คุณต้องการยืนยันการเครียร์ข้อมูลหรือไม่ ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ล้าง',
    cancelButtonText: 'ยกเลิก',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await appStore.preLoading(200);
      toast.success('เครียร์ข้อมูลแล้ว');
      clearForm();
    }
  });
}
</script>

<template>
  <PageLayout :nameHeader="$route.meta.title">
    <div class="w-full flex flex-column">
      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-900 text-xl font-medium required">ชื่อยา : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputText
            type="text"
            placeholder="ชื่อยา"
            class="w-20rem lg:w-30rem"
            v-model="form!.drugName"
            variant="filled"
            :invalid="v$['drugName'].$invalid"
          />
        </div>
      </div>

      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-900 text-xl font-medium required">ส่วนประกอบ : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputText
            type="text"
            placeholder="ส่วนประกอบ"
            class="w-20rem lg:w-30rem"
            v-model="form!.drugIngredients"
            variant="filled"
            :invalid="v$['drugIngredients'].$invalid"
          />
        </div>
      </div>

      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-900 text-xl font-medium required">ราคาขาย : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputNumber
            type="number"
            placeholder="ราคาขาย"
            class="w-20rem lg:w-30rem"
            v-model="form!.drugPrice"
            variant="filled"
            suffix=" บาท"
            :invalid="v$['drugPrice'].$invalid"
          />
        </div>
      </div>

      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-900 text-xl font-medium required">หน่วย : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputText
            type="text"
            placeholder="หน่วย"
            class="w-20rem lg:w-30rem"
            v-model="form!.drugUnit"
            variant="filled"
            :invalid="v$['drugUnit'].$invalid"
          />
        </div>
      </div>

      <div class="flex justify-content-end gap-2">
        <Button label="ยืนยัน" class="text-lg" @click="onSubmitForm()" />
        <Button label="ล้าง" class="text-lg" severity="danger" @click="onClear()" />
      </div>
    </div>
  </PageLayout>
</template>
