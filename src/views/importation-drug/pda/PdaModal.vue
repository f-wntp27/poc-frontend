<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import type { ImporttationDrugResponseModel, DatatableRef } from '@/models';
import { StatusApprove } from '@/constant';
import { numberWithComma } from '@/utils';
import type { FileUploadSelectEvent } from 'primevue/fileupload';
import { useHttpService } from '@/services/http.services';
import { useAppStore } from '@/stores/app.store';
import Swal from 'sweetalert2';

const props = defineProps({
  open: { type: Boolean, default: false, required: true },
  data: { type: Object as PropType<ImporttationDrugResponseModel> },
  action: { type: String, default: StatusApprove.APPROVE, required: true },
  datatableRef: { type: Object as PropType<DatatableRef | null>, default: null, required: false },
});

const httpService = useHttpService();
const appStore = useAppStore();
const filelist = ref<File[]>([]);
const fdaComment = ref('');
const rejectReason = ref('');

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const visible = computed({
  get() {
    return props.open;
  },
  set(value) {
    emit('update:open', value);
  },
});

function onSelectFiles(event: FileUploadSelectEvent) {
  filelist.value = event.files;
}

async function onSumbit() {
  appStore.isLoading.value = true;
  const formData = new FormData();
  formData.append('reqId', props.data!.reqId);
  formData.append('taskId', props.data!.taskId);
  formData.append('approveStatus', props.action.toLowerCase());
  if (props.action.toLowerCase() === StatusApprove.APPROVE.toLowerCase()) {
    formData.append('fdaComment', fdaComment.value);
    filelist.value.forEach((file) => {
      formData.append('files', file, file.name);
    });
  } else {
    formData.append('rejectedReason', rejectReason.value);
  }

  await httpService
    .post('/api/importation-drug-req/fda-approve/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {
      appStore.isLoading.value = false;
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'การยืนยันสำเร็จแล้ว',
      }).then(async (isConfirm) => {
        if (isConfirm) {
          emit('update:open', false);
          await props.datatableRef?.search();
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error,
      });
      appStore.isLoading.value = false;
    });
}
</script>

<template>
  <template>
    <div class="card flex justify-content-center">
      <Dialog
        v-model:visible="visible"
        :draggable="false"
        modal
        dismissableMask
        position="top"
        :style="{ width: '50vw' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      >
        <template #header>
          <div></div>
          <div class="text-center ml-4">
            <span class="text-2xl font-bold">{{
              action === StatusApprove.APPROVE ? 'แสดงความคิดเห็น' : 'ปฎิเสธ'
            }}</span>
          </div>
        </template>
        <div class="w-full flex flex-column">
          <div class="block md:flex align-items-center mb-5">
            <div class="md:col-3">
              <label class="text-900 text-xl font-bold">Request ID : &nbsp;</label>
            </div>
            <div class="col-auto text-xl">
              <span>{{ props.data!.reqId || '-' }}</span>
            </div>
          </div>

          <div class="block md:flex align-items-center mb-5">
            <div class="md:col-3">
              <label class="text-900 text-xl font-bold">ชื่อยา : &nbsp;</label>
            </div>
            <div class="col-auto text-xl font-light">
              {{ props.data!.drugName || '-' }}
            </div>
          </div>

          <div class="block md:flex align-items-center mb-5">
            <div class="md:col-3">
              <label class="text-900 text-xl font-bold">ส่วนประกอบ : &nbsp;</label>
            </div>

            <div class="col-auto text-xl font-light">
              {{ props.data!.drugIngredients || '-' }}
            </div>
          </div>

          <div class="block md:flex align-items-center mb-5">
            <div class="md:col-3">
              <label class="text-900 text-xl font-bold">ราคาขาย : &nbsp;</label>
            </div>

            <div class="col-auto text-xl font-light">
              {{ numberWithComma(String(props.data!.drugPrice)) + ' บาท' || '-' }}
            </div>
          </div>

          <div class="block md:flex align-items-center mb-5">
            <div class="md:col-3">
              <label class="text-900 text-xl font-bold">หน่วย : &nbsp;</label>
            </div>

            <div class="col-auto text-xl font-light">
              {{ props.data!.drugUnit || '-' }}
            </div>
          </div>

          <template v-if="action === StatusApprove.APPROVE">
            <div class="block md:flex align-items-start mb-5">
              <div class="md:col-3">
                <label class="text-900 text-xl font-bold">แสดงความคิดเห็น : &nbsp;</label>
              </div>

              <div class="col-auto text-2xl">
                <Textarea rows="5" cols="70" style="resize: none" v-model="fdaComment" />
              </div>
            </div>
            <div class="block md:flex align-items-start mb-5">
              <div class="md:col-3">
                <label class="text-900 text-xl font-bold">อัพโหลดไฟล์ : &nbsp;</label>
              </div>

              <div class="col-auto">
                <FileUpload
                  chooseLabel="อัพโหลด"
                  mode="basic"
                  name="demo[]"
                  customUpload
                  @select="onSelectFiles"
                  :multiple="true"
                />
              </div>
            </div>
          </template>

          <div class="block md:flex align-items-start mb-5" v-else>
            <div class="md:col-3">
              <label class="text-xl font-bold">เหตุผล : &nbsp;</label>
            </div>

            <div class="col-auto text-2xl">
              <Textarea rows="5" cols="70" style="resize: none" v-model="rejectReason" />
            </div>
          </div>

          <div class="flex justify-content-end gap-2">
            <Button label="ยืนยัน" class="text-lg" @click="onSumbit" />
            <Button
              label="ยกเลิก"
              class="text-lg bg-red-500"
              severity="danger"
              @click="() => emit('update:open', false)"
            />
          </div>
        </div>
      </Dialog>
    </div>
  </template>
</template>

<style scoped lang="scss"></style>
