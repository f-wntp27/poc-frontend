<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useHttpService } from '@/services/http.services';
import Swal from 'sweetalert2';
import type { ImporttationDrugMatResquestModel } from '@/models';
import { useAppStore } from '@/stores/app.store';
import { toastMsg } from '@/utils/notification';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';
import { numberWithComma } from '@/utils';

const httpService = useHttpService();
const appStore = useAppStore();
const toast = toastMsg();

const license = reactive({ licenseNo: '' });
// const foundLicense = ref();

const form = reactive<ImporttationDrugMatResquestModel>({
  materialName: '',
  materialAmount: 0,
  materialUnit: '',
});
const formList = ref<ImporttationDrugMatResquestModel[]>([]);

const vlicense$ = useVuelidate(
  {
    licenseNo: { required },
  },
  license,
  { $autoDirty: true, $lazy: true },
);

const v$ = useVuelidate(
  {
    materialName: { required },
    materialAmount: { required, minValue: minValue(1) },
    materialUnit: { required },
  },
  form,
  { $autoDirty: true, $lazy: true },
);

function clearForm() {
  form.materialName = '';
  form.materialAmount = 0;
  form.materialUnit = '';

  v$.value.$reset();
  vlicense$.value.$reset();
}

async function onSubmitForm() {
  const valid = await vlicense$.value.$validate();

  if (!valid) {
    toast.warning('กรุณากรอกเลขใบอนุญาต');
    return;
  } else if (formList.value.length === 0) {
    const valid = await v$.value.$validate();
    if (!valid) {
      toast.warning('ต้องกรอกข้อมูลให้ครบถ้วน');
      return;
    } else {
      toast.warning('ต้องมีอย่างน้อย 1 แถว');
      return;
    }
  }
  Swal.fire({
    title: 'ยืนยัน ?',
    text: 'คุณต้องการยืนยันการขอใบอนุญาตนำเข้าวัตถุดิบยาหรือไม่ ?',
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
        .post('/api/importation-drug-mat-req/submit', { licenseNo: license.licenseNo, details: formList.value })
        .then(() => {
          toast.success('ยืนยันการขอใบขออนุญาตนำเข้าวัตถุดิบยาสำเร็จแล้ว');
          license.licenseNo = '';
          formList.value = [];
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
      license.licenseNo = '';
      // foundLicense.value = null;
      formList.value = [];
      clearForm();
    }
  });
}

// async function onSearchLicenseDrug() {
//   const valid = await vlicense$.value.$validate();

//   if (!valid) {
//     toast.warning('กรุณากรอกเลขใบอนุญาต');
//     return;
//   }

//   appStore.isLoading.value = true;
//   await httpService
//     .get(`/api/importation-drug-mat-req/search-by-license/${license.licenseNo}`)
//     .then((response) => {
//       if (response.entity) {
//         foundLicense.value = true;
//         toast.success('พบใบอนุญาต');
//       } else {
//         foundLicense.value = false;
//         toast.error('ไม่พบใบอนุญาต');
//       }
//     })
//     .catch((error) => {
//       Swal.fire({
//         icon: 'error',
//         title: 'เกิดข้อผิดพลาด',
//         text: error,
//       });
//     });

//   appStore.isLoading.value = false;
// }

async function onAdd() {
  const valid = await v$.value.$validate();

  if (!valid) {
    toast.warning('ต้องกรอกข้อมูลให้ครบถ้วน');
    return;
  }

  formList.value.push({
    materialAmount: form.materialAmount,
    materialName: form.materialName,
    materialUnit: form.materialUnit,
  });
  toast.info(`เพิ่ม ชื่อวัตถุดิบ '${form.materialName}' แล้ว`);

  clearForm();
}

function onRemove(data: ImporttationDrugMatResquestModel, idx: number) {
  Swal.fire({
    title: 'ลบ ?',
    text: `คุณต้องการลบ ชื่อวัตถุดิบ '${data.materialName}'  หรือไม่ ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await appStore.preLoading(200);
      formList.value.splice(idx, 1);
      toast.success(`ลบ ชื่อวัตถุดิบ '${data.materialName}' แล้ว`);
    }
  });
}
</script>

<template>
  <PageLayout :nameHeader="$route.meta.title">
    <div class="w-full flex flex-column">
      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-xl font-medium required">เลขใบอนุญาต : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputText
            type="text"
            placeholder="เลขใบอนุญาต"
            class="w-20rem lg:w-30rem"
            v-model="license.licenseNo"
            variant="filled"
            :invalid="vlicense$['licenseNo'].$invalid"
          />
        </div>

        <!-- <Button label="ค้นหา" class="text-lg mx-4" @click="onSearchLicenseDrug()" />
        &nbsp;&nbsp;
        <div v-if="foundLicense === true" class="flex align-items-center gap-3" style="color: green">
          <i class="mdi mdi-check-circle-outline" style="font-size: 30px" />
          <strong><u>พบใบอนุญาต</u></strong>
        </div>
        <div v-else-if="foundLicense === false" class="flex align-items-center gap-3" style="color: red">
          <i class="mdi mdi-close-circle-outline" style="font-size: 30px" />
          <strong><u>ไม่พบใบอนุญาต</u></strong>
        </div> -->
      </div>

      <Divider />

      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-xl font-medium required">ชื่อวัตถุดิบ : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputText
            type="text"
            placeholder="ชื่อวัตถุดิบ"
            class="w-20rem lg:w-30rem"
            v-model="form.materialName"
            variant="filled"
            :invalid="v$['materialName'].$invalid"
          />
        </div>
      </div>

      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-xl font-medium required">จำนวน : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputNumber
            type="number"
            placeholder="จำนวน"
            class="w-20rem lg:w-30rem"
            v-model="form.materialAmount"
            variant="filled"
            :invalid="v$['materialAmount'].$invalid"
          />
        </div>
      </div>

      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-xl font-medium required">หน่วย : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputText
            type="text"
            placeholder="หน่วย"
            class="w-20rem lg:w-30rem"
            v-model="form.materialUnit"
            variant="filled"
            :invalid="v$['materialUnit'].$invalid"
          />
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button label="เพิ่ม" class="text-lg" @click="onAdd()" />
      </div>
      <Divider />

      <DataTable :value="formList" class="shadow-4" showGridlines stripedRows>
        <Column header="#" headerStyle="width:3em" headerClass="text-center" bodyClass="text-center">
          <template #body="slotProps">
            {{ slotProps.index + 1 }}
          </template>
        </Column>
        <Column field="materialName" header="ชื่อวัตถุดิบยา" bodyClass="text-center" headerClass="text-center"></Column>
        <Column field="materialAmount" header="จำนวน" bodyClass="text-center" headerClass="text-center">
          <template #body="{ data }">
            {{ numberWithComma(String(data.materialAmount), 1) }}
          </template>
        </Column>
        <Column field="materialUnit" header="หน่วย" bodyClass="text-center" headerClass="text-center"> </Column>
        <Column header="แอคชั่น" bodyClass="text-center" headerClass="text-center" style="width: 20rem">
          <template #body="{ data, index }">
            <Button
              icon="mdi mdi-trash-can-outline"
              class="p-button-sm bg-red-500"
              severity="danger"
              @click="onRemove(data, index)"
            />
          </template>
        </Column>

        <template #empty>
          <div>ไม่พบข้อมูล</div>
        </template>
      </DataTable>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button label="ยืนยัน" class="text-lg" @click="onSubmitForm()" />
        <Button label="ล้าง" class="text-lg bg-red-500" severity="danger" @click="onClear()" />
      </div>
    </div>
  </PageLayout>
</template>
