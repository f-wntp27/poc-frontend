<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import { useHttpService } from '@/services/http.services';
import Swal from 'sweetalert2';
import type { ImportationLicenseResquestModel, DataOptionProcessDefKeyModel, DataOption, InputUpload } from '@/models';
import { useAppStore } from '@/stores/app.store';
import { toastMsg } from '@/utils/notification';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { convertToBase64, transferFileSize } from '@/utils';
import { useRouter } from 'vue-router';

const httpService = useHttpService();
const appStore = useAppStore();
const toast = toastMsg();
const router = useRouter();

const fileRef = ref();

const optionsProcessDefKey = ref<DataOption[]>([
  // { value: 'important_drug_request', label: 'ขอใบอนุญาตนำเข้ายา' },
  // { value: 'important_medical_tool_request', label: 'ขอใบอนุญาตนำเข้าเครื่องทางการแพทย์' },
]);
const form = reactive<ImportationLicenseResquestModel>({
  email: '',
  processDefKey: '',
  // drugResquest: { drugName: '', drugIngredients: '', drugPrice: null, drugUnit: '' },
  // medicalToolRequest: {
  //   toolName: '',
  //   toolBrand: '',
  //   toolAmount: null,
  //   toolAmountUnit: '',
  //   toolPrice: null,
  // },
  document: [],
});

const FILE_LIST = ref<InputUpload[]>([]);
const onFileChange = async (event: EventTarget | any) => {
  const files: File[] = event.target.files;

  for (const file of files) {
    const src = await convertToBase64(file);
    form.document.push(file);
    FILE_LIST.value.push({ name: file.name, size: file.size, type: file.type, src: src });
  }
  (fileRef.value as HTMLInputElement).value = '';
  await appStore.preLoading(500);
};

function onRemove(index: number) {
  Swal.fire({
    title: 'ลบ ?',
    text: 'คุณต้องการลบไฟล์นี้หรือไม่ ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
  }).then(async (result) => {
    if (result.isConfirmed) {
      appStore.preLoading(500);
      FILE_LIST.value.splice(index, 1);
      form.document.splice(index, 1);
    }
  });
}

const v$ = useVuelidate(
  {
    email: {
      required: helpers.withMessage('กรุณากรอกอีเมล', required),
    },
    processDefKey: { required },
  },
  form,
  {
    $autoDirty: true,
    $lazy: true,
  },
);

async function getProcessDefKey() {
  return (await httpService.get<DataOptionProcessDefKeyModel[]>('api/data-option/process-def')).entity;
}

onBeforeMount(async () => {
  try {
    optionsProcessDefKey.value = (await getProcessDefKey()).map((v) => ({ value: v.requestKey, label: v.requestName }));
  } catch (error: any) {
    toast.error(error.response);
  }
});

async function clearForm() {
  form.email = '';
  form.processDefKey = '';
  form.document = [];
  FILE_LIST.value = [];
  v$.value.$reset();
}

async function onSubmitForm() {
  await v$.value.$validate();

  if (v$.value.email.required.$invalid) {
    toast.warning(v$.value.email.required.$message);
    return;
  }

  if (form.document.length === 0) {
    toast.warning('กรุณาอัพโหลดไฟล์');
    return;
  }

  const labelLicense = optionsProcessDefKey.value.find((v) => v.value === form.processDefKey)?.label;

  const formData = new FormData();
  formData.append('email', form.email);
  formData.append('processDefKey', form.processDefKey);
  form.document.forEach((file) => {
    formData.append('document', file, file.name);
  });

  Swal.fire({
    title: 'ยืนยัน ?',
    text: `คุณต้องการยืนยันการ${labelLicense}หรือไม่ ?`,
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
        .post('/api/license-request/submit', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(() => {
          toast.success(`ยืนยันการ${labelLicense}สำเร็จแล้ว`);
          clearForm();
          appStore.isLoading.value = false;
          router.push({ name: 'license-status-log' });
        })
        .catch((error: any) => {
          toast.error(error.response.data.errors);
          appStore.isLoading.value = false;
        });
      appStore.isLoading.value = false;
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
  <PageLayout :showHeader="false">
    <div class="w-full flex flex-column">
      <div class="block md:flex align-items-center mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-xl font-medium required">อีเมล : &nbsp;</label>
        </div>
        <div class="col-auto">
          <InputText
            type="text"
            placeholder="อีเมล"
            class="lg:w-30rem"
            v-model="form.email"
            variant="filled"
            :invalid="v$['email'].$invalid"
          />
          <transition name="message" appear>
            <div class="p-error">
              <small v-if="v$['email'].required.$invalid">{{ v$['email'].required.$message }}</small>
            </div>
          </transition>
        </div>
      </div>
      <Divider />

      <div class="block md:flex mb-2">
        <div class="md:col-2 mb-2">
          <label class="text-xl font-medium required">ใบอนุญาตนำเข้า : &nbsp;</label>
        </div>
        <div class="col-auto">
          <Dropdown
            v-model="form.processDefKey"
            placeholder="-- เลือกใบอนุญาตนำเข้า --"
            :options="optionsProcessDefKey"
            optionLabel="label"
            optionValue="value"
            class="lg:w-30rem"
            :showClear="!!form.processDefKey"
            :invalid="v$['processDefKey'].$invalid"
            :highlightOnSelect="true"
          />
        </div>
      </div>

      <!-- <div class="w-full flex flex-column" v-if="form.processDefKey === ProcessDefKey.Drug">
        <Divider />

        <div class="block md:flex align-items-center mb-2">
          <div class="md:col-2 mb-2">
            <label class="text-xl font-medium required">ชื่อยา : &nbsp;</label>
          </div>

          <div class="col-auto">
            <InputText
              type="text"
              placeholder="ชื่อยา"
              class="w-20rem lg:w-30rem"
              v-model="form.drugResquest.drugName"
              variant="filled"
              :invalid="vDrug$['drugName'].$invalid"
            />
          </div>
        </div>

        <div class="block md:flex align-items-center mb-2">
          <div class="md:col-2 mb-2">
            <label class="text-xl font-medium required">ส่วนประกอบ : &nbsp;</label>
          </div>
          <div class="col-auto">
            <InputText
              type="text"
              placeholder="ส่วนประกอบ"
              class="w-20rem lg:w-30rem"
              v-model="form.drugResquest.drugIngredients"
              variant="filled"
              :invalid="vDrug$['drugIngredients'].$invalid"
            />
          </div>
        </div>

        <div class="block md:flex align-items-center mb-2">
          <div class="md:col-2 mb-2">
            <label class="text-xl font-medium required">ราคาขาย : &nbsp;</label>
          </div>
          <div class="col-auto">
            <InputNumber
              type="number"
              placeholder="ราคาขาย"
              class="w-20rem lg:w-30rem"
              v-model="form.drugResquest.drugPrice"
              variant="filled"
              suffix=" บาท"
              :invalid="vDrug$['drugPrice'].$invalid"
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
              v-model="form.drugResquest.drugUnit"
              variant="filled"
              :invalid="vDrug$['drugUnit'].$invalid"
            />
          </div>
        </div>
      </div>

      <div class="w-full flex flex-column" v-if="form.processDefKey === ProcessDefKey.MedicalTool">
        <Divider />

        <div class="block md:flex align-items-center mb-2">
          <div class="md:col-2 mb-2">
            <label class="text-xl font-medium required">ชื่ออุปกรณ์ : &nbsp;</label>
          </div>
          <div class="col-auto">
            <InputText
              type="text"
              placeholder="ชื่ออุปกรณ์"
              class="w-20rem lg:w-30rem"
              v-model="form.medicalToolRequest.toolName"
              variant="filled"
              :invalid="vMedicalTool$['toolName'].$invalid"
            />
          </div>
        </div>

        <div class="block md:flex align-items-center mb-2">
          <div class="md:col-2 mb-2">
            <label class="text-xl font-medium required">ยี่ห้อ : &nbsp;</label>
          </div>
          <div class="col-auto">
            <InputText
              type="text"
              placeholder="ยี่ห้อ"
              class="w-20rem lg:w-30rem"
              v-model="form.medicalToolRequest.toolBrand"
              variant="filled"
              :invalid="vMedicalTool$['toolBrand'].$invalid"
            />
          </div>
        </div>

        <div class="block md:flex align-items-center mb-2">
          <div class="md:col-2 mb-2">
            <label class="text-xl font-medium required">ราคา : &nbsp;</label>
          </div>
          <div class="col-auto">
            <InputNumber
              type="number"
              placeholder="ราคา"
              class="w-20rem lg:w-30rem"
              v-model="form.medicalToolRequest.toolPrice"
              variant="filled"
              suffix=" บาท"
              :invalid="vMedicalTool$['toolPrice'].$invalid"
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
              v-model="form.medicalToolRequest.toolAmount"
              variant="filled"
              :invalid="vMedicalTool$['toolAmount'].$invalid"
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
              v-model="form.medicalToolRequest.toolAmountUnit"
              variant="filled"
              :invalid="vMedicalTool$['toolAmountUnit'].$invalid"
            />
          </div>
        </div>
      </div> -->

      <div v-if="form.processDefKey">
        <Divider />

        <div class="block md:flex align-items-start mb-2">
          <div class="md:col-2 mb-2">
            <label class="text-xl font-medium required">อัพโหลดไฟล์ : &nbsp;</label>
          </div>
          <div class="col-auto lg:w-30rem">
            <input hidden ref="fileRef" id="file_ref" type="file" @change="onFileChange" multiple />
            <Button
              class="p-button p-component p-button-sm"
              @click="(e: Event) => fileRef.click(e)"
              aria-controls="overlay_add_image_multi"
              icon="pi pi-file"
              label="อัพโหลด"
            />
            <div
              v-if="FILE_LIST.length > 0"
              class="border-primary-500 surface-overlay border-2 border-round-md mt-2 p-3"
            >
              <div v-for="(file, index) of FILE_LIST" :key="index" class="block">
                <div class="flex justify-content-between align-items-center">
                  <div class="flex justify-content-center align-items-center">
                    <div class="mr-2 border-right-1 border-primary-500" style="width: 50px">
                      <img
                        role="presentation"
                        class="p-fileupload-file-thumbnail"
                        :alt="file.name"
                        :src="file.src"
                        width="40"
                        height="40"
                        v-if="file.type.startsWith('image')"
                      />
                      <i
                        v-else-if="file.name.endsWith('.pdf')"
                        class="pi pi-file-pdf text-red-500"
                        style="font-size: 40px"
                      />
                      <i
                        v-else-if="file.name.endsWith('.docx')"
                        class="pi pi-file-word text-blue-700"
                        style="font-size: 40px"
                      />
                      <i
                        v-else-if="file.name.endsWith('.xlsx')"
                        class="pi pi-file-excel text-green-400"
                        style="font-size: 40px"
                      />
                      <i v-else class="pi pi-file" style="font-size: 40px" />
                    </div>

                    <span
                      class="w-14rem lg:w-20rem overflow-hidden text-overflow-ellipsis"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      :title="file.name + ' (' + transferFileSize(file.size) + ')'"
                    >
                      {{ file.name }}
                    </span>
                  </div>

                  <div class="pl-2 border-left-1 border-primary-500">
                    <!-- <i class="pi pi-times text-red-500" style="font-size: 25px" /> -->
                    <Button
                      icon="pi pi-times"
                      @click="onRemove(index)"
                      class="p-button-sm p-button-danger p-button-rounded bg-red-500"
                      size="small"
                      v-tooltip.top="'ลบ'"
                    />
                  </div>
                </div>
                <Divider class="bg-primary-500" v-if="index < FILE_LIST.length - 1" />
              </div>
            </div>

            <!-- <FileUpload
              chooseLabel="อัพโหลด"
              :mode="form.document.length === 0 ? 'basic' : 'advanced'"
              @select="onSelectFiles"
              :multiple="true"
            /> -->
          </div>
        </div>
        <Divider />
        <div class="flex justify-content-end gap-2">
          <Button label="ยืนยัน" class="text-lg" @click="onSubmitForm()" />
          <Button label="ล้าง" class="text-lg bg-red-500" severity="danger" @click="onClear()" />
        </div>
      </div>
    </div>
  </PageLayout>
</template>
