<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';
import type { ImporttationDrugMatResponseModel, DatatableRef } from '@/models';
import { StatusApprove } from '@/constant';
import { numberWithComma } from '@/utils';
import { useHttpService } from '@/services/http.services';
import { useAppStore } from '@/stores/app.store';
import Swal from 'sweetalert2';
import { toastMsg } from '@/utils/notification';

const props = defineProps({
  open: { type: Boolean, default: false, required: true },
  data: { type: Object as PropType<ImporttationDrugMatResponseModel> },
  action: { type: String, default: StatusApprove.APPROVE, required: true },
  datatableRef: { type: Object as PropType<DatatableRef | null>, default: null, required: false },
});

const httpService = useHttpService();
const appStore = useAppStore();
const rejectReason = ref('');
const toast = toastMsg();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const visible = computed({
  get() {
    clear();
    return props.open;
  },
  set(value) {
    emit('update:open', value);
  },
});

function clear() {
  rejectReason.value = '';
}

async function onSumbit() {
  appStore.isLoading.value = true;
  const formData = new FormData();
  formData.append('reqId', props.data!.reqId);
  formData.append('taskId', props.data!.taskId);
  formData.append('approveStatus', props.action.toLowerCase());
  if (props.action.toLowerCase() === StatusApprove.REJECT.toLowerCase()) {
    formData.append('rejectedReason', rejectReason.value);
  }

  await httpService
    .post('/api/importation-drug-mat-req/fda-approve-mats/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(async () => {
      appStore.isLoading.value = false;
      toast.success(`${props.action === StatusApprove.REJECT ? 'ไม่' : ''}อนุมัติสำเร็จแล้ว`);
      emit('update:open', false);
      await props.datatableRef?.search();
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
          <span class="text-2xl font-bold">{{ action === StatusApprove.APPROVE ? 'อนุมัติ' : 'ไม่อนุมัติ' }}</span>
        </div>
      </template>
      <div class="w-full flex flex-column">
        <div class="block md:flex align-items-center">
          <div class="md:col-3">
            <label class="text-lg font-bold">เลขใบอนุญาต : &nbsp;</label>
          </div>
          <div class="col-auto text-lg flex align-items-center gap-3">
            <span>{{ props.data!.licenseNo || '-' }}</span>
            <div
              v-if="props.data!.importationDrugsId"
              class="flex justify-content-center align-items-center"
              style="color: green"
            >
              <i class="mdi mdi-check-circle-outline" style="font-size: 30px" /> &nbsp;&nbsp;
              <strong><u>พบใบอนุญาต</u></strong>
            </div>
            <div v-else style="color: red" class="flex justify-content-center align-items-center">
              <i class="mdi mdi-close-circle-outline" style="font-size: 30px" /> &nbsp;&nbsp;
              <strong><u>ไม่พบใบอนุญาต</u></strong>
            </div>
          </div>
        </div>

        <div class="block md:flex align-items-center">
          <div class="md:col-3">
            <label class="text-lg font-bold">Request ID : &nbsp;</label>
          </div>
          <div class="col-auto text-lg">
            <span>{{ props.data!.reqId || '-' }}</span>
          </div>
        </div>

        <div class="block md:flex align-items-center">
          <div class="md:col-3">
            <label class="text-lg font-bold">ชื่อยา : &nbsp;</label>
          </div>
          <div class="col-auto text-lg font-light">
            {{ props.data!.drugName || '-' }}
          </div>
        </div>

        <div class="block md:flex align-items-center">
          <div class="md:col-3">
            <label class="text-lg font-bold">ส่วนประกอบ : &nbsp;</label>
          </div>

          <div class="col-auto text-lg font-light">
            {{ props.data!.drugIngredients || '-' }}
          </div>
        </div>

        <div class="block md:flex align-items-center">
          <div class="md:col-3">
            <label class="text-lg font-bold">ราคาขาย : &nbsp;</label>
          </div>

          <div class="col-auto text-lg font-light">
            {{ numberWithComma(String(props.data!.drugPrice)) + ' บาท' || '-' }}
          </div>
        </div>

        <div class="block md:flex align-items-center">
          <div class="md:col-3">
            <label class="text-lg font-bold">หน่วย : &nbsp;</label>
          </div>

          <div class="col-auto text-lg font-light">
            {{ props.data!.drugUnit || '-' }}
          </div>
        </div>

        <div class="block md:flex align-items-center" v-if="data!.details.length > 0">
          <div class="md:col-3">
            <label class="text-lg font-bold">วัตถุดิบยา : &nbsp;</label>
          </div>
        </div>

        <DataTable
          :value="data!.details"
          class="shadow-4 mb-4"
          showGridlines
          stripedRows
          v-if="data!.details.length > 0"
        >
          <Column header="#" headerStyle="width:3em" headerClass="text-center" bodyClass="text-center">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column
            field="materialName"
            header="ชื่อวัตถุดิบยา"
            bodyClass="text-center"
            headerClass="text-center"
          ></Column>
          <Column field="materialAmount" header="จำนวน" bodyClass="text-center" headerClass="text-center">
            <template #body="{ data }">
              {{ numberWithComma(String(data.materialAmount)) }}
            </template>
          </Column>
          <Column field="materialUnit" header="หน่วย" bodyClass="text-center" headerClass="text-center"> </Column>

          <template #empty>
            <div>ไม่พบข้อมูล</div>
          </template>
        </DataTable>

        <div v-else class="text-center">
          <Divider />
          ไม่พบวัตถุดิบยา
          <Divider />
        </div>

        <template v-if="action === StatusApprove.REJECT">
          <div class="block md:flex align-items-start">
            <div class="md:col-3">
              <label class="text-lg font-bold">เหตุผล : &nbsp;</label>
            </div>

            <div class="col-auto text-2xl">
              <Textarea rows="5" cols="70" style="resize: none" v-model="rejectReason" />
            </div>
          </div>
        </template>

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

<style scoped lang="scss"></style>
