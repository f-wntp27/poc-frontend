<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useHttpService } from '@/services/http.services';
import type { DatatableRef } from '@/models';
import { StatusApprove } from '@/constant';
import { useAppStore } from '@/stores/app.store';
import { useUserStore } from '@/stores/user.store';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

type ApproveResponse = {
  taskId: string;
  requestId: string;
  fdaComment: string;
  email: string;
};

const LicenseType = {
  Drug: 'ใบอนุญาตนำเข้ายา',
  Medical: 'ใบอนุญาตนำเข้าเครื่องทางการแพทย์',
};

const router = useRouter();
const appStore = useAppStore();
const httpService = useHttpService();
const userStore = useUserStore();
const openApprove = ref(false);
const dataModal = ref<ApproveResponse>();
const statusAction = ref<StatusApprove>();
const mdt = ref<DatatableRef | null>(null);
const titleLicense = computed(() => {
  if (['fda', 'oap'].includes(userStore.getUsername.value)) {
    return LicenseType.Medical;
  } else {
    return LicenseType.Drug;
  }
});
const rejectReason = ref('');

const tableFields = ref([
  {
    field: 'requestId',
    label: 'Request ID',
    type: 'string',
    headerClass: 'text-center w-30rem',
  },
  {
    field: 'taskId',
    label: 'เลขที่งาน',
    type: 'string',
    headerClass: 'text-center w-30rem',
  },
  {
    field: 'email',
    label: 'อีเมล',
    type: 'string',
    headerClass: 'text-center',
  },
]);

async function getDataList() {
  let response;
  appStore.isLoading.value = true;

  if (['fda', 'oap'].includes(userStore.getUsername.value)) {
    response = await httpService.get<ApproveResponse[]>(
      `/api/important-medical-tool-req/${userStore.getUsername.value}`,
    );
  } else {
    response = await httpService.get<ApproveResponse[]>(`/api/important-drug-req/${userStore.getUsername.value}`);
  }
  appStore.isLoading.value = false;
  return { data: response.entity };
}

async function onAction(data: ApproveResponse, operation: StatusApprove) {
  dataModal.value = data;
  openApprove.value = true;
  await appStore.preLoading(200);
  statusAction.value = operation;
}

watch(
  () => userStore.getUsername.value,
  async () => {
    await appStore.preLoading(200);
    await mdt.value?.search();
  },
);

async function onSumbit() {
  const url = ['fda', 'oap'].includes(userStore.getUsername.value)
    ? `/api/important-medical-tool-req/${userStore.getUsername.value}/submit`
    : `/api/important-drug-req/${userStore.getUsername.value}/submit`;

  const rejectedReason =
    statusAction.value?.toLowerCase() === StatusApprove.REJECT.toLowerCase()
      ? { rejectedReason: rejectReason.value }
      : undefined;

  const statusApprove = statusAction.value === StatusApprove.APPROVE ? 'อนุมัติ' : 'ไม่อนุมัติ';
  Swal.fire({
    title: `${statusApprove} ?`,
    text: `คุณต้องการยืนยัน${statusApprove}${titleLicense.value}หรือไม่ ?`,
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
        .post(url, {
          taskId: dataModal.value?.taskId,
          requestId: dataModal.value?.requestId,
          status: statusAction.value?.toLowerCase(),
          ...rejectedReason,
        })
        .then(() => {
          appStore.isLoading.value = false;
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'การยืนยันสำเร็จแล้ว',
          }).then(async (isConfirm) => {
            if (isConfirm) {
              router.push({ name: 'license-status-log' });
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
      appStore.isLoading.value = false;
    }
  });
}
</script>

<template>
  <PageLayout :nameHeader="`อนุมัติ${titleLicense}`">
    <MyDataTable
      ref="mdt"
      :fields="tableFields"
      :searchFunction="getDataList"
      hiddenHeader
      hiddenEditButton
      hiddenViewButton
      hiddenDeleteButton
    >
      <Column header="แอคชั่น" bodyClass="text-center" headerClass="text-center" style="width: 20rem">
        <template #body="slotProps">
          <Button
            icon="mdi mdi-checkbox-marked-circle-outline"
            class="p-button-sm ms-2 shadow-4 mx-1"
            @click="onAction(slotProps.data, StatusApprove.APPROVE)"
            label="อนุมัติ"
          />

          <Button
            icon="mdi mdi-close-circle-outline"
            class="p-button-sm ms-2 shadow-4 mx-1 bg-red-500"
            @click="onAction(slotProps.data, StatusApprove.REJECT)"
            label="ไม่อนุมัติ"
            severity="danger"
          />
        </template>
      </Column>
    </MyDataTable>

    <div class="card flex justify-content-center">
      <Dialog
        v-model:visible="openApprove"
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
              statusAction === StatusApprove.APPROVE ? 'อนุมัติ' : 'ไม่อนุมัติ'
            }}</span>
          </div>
        </template>

        <Divider />
        <div class="flex align-items-center">
          <div class="md:col-2">
            <label class="font-bold text-lg">ประเภท : &nbsp;</label>
          </div>
          <div class="col-auto text-lg">
            <span>{{ titleLicense }}</span>
          </div>
        </div>

        <div class="flex align-items-center">
          <div class="md:col-2">
            <label class="font-bold text-lg">Request ID : &nbsp;</label>
          </div>
          <div class="col-auto text-lg">
            <span>{{ dataModal?.requestId }}</span>
          </div>
        </div>

        <div class="flex align-items-center">
          <div class="md:col-2">
            <label class="font-bold text-lg">เลขที่งาน : &nbsp;</label>
          </div>
          <div class="col-auto text-lg">
            <span>{{ dataModal?.taskId }}</span>
          </div>
        </div>

        <div class="flex align-items-center">
          <div class="md:col-2">
            <label class="font-bold text-lg">อีเมล : &nbsp;</label>
          </div>
          <div class="col-auto text-lg">
            <span>{{ dataModal?.email }}</span>
          </div>
        </div>
        <Divider v-if="statusAction === StatusApprove.REJECT" />
        <div class="flex align-items-start" v-if="statusAction === StatusApprove.REJECT">
          <div class="md:col-2">
            <label class="text-lg font-bold">เหตุผล : &nbsp;</label>
          </div>

          <div class="col-auto text-lg py-2">
            <Textarea rows="5" cols="70" style="resize: none" v-model="rejectReason" />
          </div>
        </div>

        <Divider />

        <div class="flex justify-content-end gap-2">
          <Button
            :label="statusAction === StatusApprove.APPROVE ? 'อนุมัติ' : 'ยืนยัน'"
            class="text-lg"
            @click="onSumbit"
          />
          <Button label="ยกเลิก" class="text-lg bg-red-500" severity="danger" @click="openApprove = false" />
        </div>
      </Dialog>
    </div>
  </PageLayout>
</template>

<style scoped lang="scss"></style>
