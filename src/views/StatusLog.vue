<script setup lang="ts">
import { ref } from 'vue';
import { useHttpService } from '@/services/http.services';
import type { ImporttationDrugResponseModel, DatatableRef } from '@/models';
import { useAppStore } from '@/stores/app.store';
import moment from 'moment';

type ImportationDragReqStatusModel = {
  id: string;
  reqId: string;
  drugName: string;
  status: string;
  approvedDate: string;
  approvedBy: string;
  rejectedDate: string;
  rejectedBy: string;
  rejectedReason: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  importationDrugReqStates: {
    id: string;
    state: string;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
  }[];
};

const MapStatus: { [key: string]: { title: string; icon: string; color: string } } = {
  submitted: { title: 'ขอใบอนุญาตนำเข้ายา', icon: 'mdi mdi-circle-slice-8', color: '#9BB0C1' },
  fda_approve: { title: 'อย. แสดงความคิดเห็นใบอนุญาตนำเข้ายา', icon: 'mdi mdi-circle-slice-8', color: '#00338D' },
  excise_approve: { title: 'กรมสรรพสามิตอนุมัติใบอนุญาตนำเข้ายา', icon: 'mdi mdi-circle-slice-8', color: '#00338D' },
  completed_approved: { title: 'อนุมัติ', icon: 'mdi mdi-circle-slice-8', color: '#00A371' },
  completed_rejected: { title: 'ไม่อนุมัติ', icon: 'mdi mdi-circle-slice-8', color: '#E41D3D' },
};

const appStore = useAppStore();
const dataModal = ref<ImportationDragReqStatusModel>();
const mdt = ref<DatatableRef | null>(null);
const visible = ref(false);

const StatusApprove: { [key: string]: { severity: string; value: string; icon: string } } = {
  approved: { severity: 'success', value: 'อนุมัติ', icon: 'mdi mdi-check-circle-outline' },
  rejected: { severity: 'danger', value: 'ไม่อนุมัติ', icon: 'mdi mdi-close' },
  waiting_for_approve: { severity: 'info', value: 'รอการอนุมัติ', icon: 'mdi mdi-clock-time-three-outline' },
};

const tableFields = ref([
  {
    field: 'reqId',
    label: 'เลขที่งาน',
    type: 'string',
    headerClass: 'text-center w-30rem',
  },
  {
    field: 'drugName',
    label: 'ชื่อยา',
    // label: 'ประเภทใบอนุญาตนำเข้า',
    type: 'string',
    headerClass: 'text-center',
  },
  // {
  //   field: '',
  //   label: '-',
  //   type: 'string',
  //   headerClass: 'text-center',
  // },
  // {
  //   field: 'status',
  //   label: 'สถานะ',
  //   type: 'string',
  //   headerClass: 'text-center',
  // },
  {
    field: 'updatedDate',
    label: 'เวลาอัพเดท',
    type: 'datetime, DD/MM/yyyy HH:mm:ss',
    headerClass: 'text-center',
  },
]);

async function getDataList() {
  appStore.isLoading.value = true;
  const response = await useHttpService().get<ImporttationDrugResponseModel[]>('/api/importation-drug-req/list');
  appStore.isLoading.value = false;
  return {
    data: response.entity,
  };
  // [
  //   { taskId: '123456', type: 'ยา', status: 'waiting_for_approve', updatedDate: new Date(2024, 2, 17) },
  //   { taskId: '789012', type: 'วัตถุดิบยา', status: 'approved', updatedDate: new Date(2024, 2, 18) },
  //   { taskId: '135790', type: 'วัตถุดิบยา', status: 'rejected', updatedDate: new Date(2024, 2, 19) },
  // ],
}

async function onAction(data: ImportationDragReqStatusModel) {
  dataModal.value = data;
  visible.value = true;
  await appStore.preLoading(200);
}

function ellipsis(text: string, wordDigit = 30) {
  if (!text) {
    return;
  }
  return text.length > wordDigit ? text.slice(0, wordDigit).concat('...') : text;
}
</script>

<template>
  <PageLayout nameHeader="สถานะการขออนุมัติใบอนุญาต">
    <MyDataTable ref="mdt" :fields="tableFields" :searchFunction="getDataList">
      <Column header="สถานะ" bodyClass="text-center" headerClass="text-center" style="width: 20rem">
        <template #body="slotProps">
          <Tag
            class="shadow-4 border-round-lg font-bold"
            :icon="StatusApprove[slotProps.data.status].icon"
            :severity="StatusApprove[slotProps.data.status].severity"
            :value="StatusApprove[slotProps.data.status].value"
            v-tooltip.top="StatusApprove[slotProps.data.status].value"
          >
          </Tag>
        </template>
      </Column>

      <Column header="ความคิดเห็น" bodyClass="text-center" headerClass="text-center" style="width: 20rem">
        <template #body="slotProps">
          <div v-tooltip.top="slotProps.data.rejectedReason">
            {{ ellipsis(slotProps.data.rejectedReason) ?? '-' }}
          </div>
        </template>
      </Column>

      <Column header="แอคชั่น" bodyClass="text-center" headerClass="text-center" style="width: 20rem">
        <template #body="slotProps">
          <Button
            icon="mdi mdi-eye-outline"
            class="p-button-sm ms-2 shadow-4 border-round-xl"
            @click="onAction(slotProps.data)"
            label=""
            v-tooltip.top="'ดูทามไลน์'"
          />
        </template>
      </Column>
    </MyDataTable>
  </PageLayout>

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
          <span class="text-2xl font-bold">ทามไลน์</span>
        </div>
      </template>

      <div class="flex align-items-center">
        <div class="md:col-2">
          <label class="font-bold text-lg">Request ID : &nbsp;</label>
        </div>
        <div class="col-auto text-lg">
          <span>{{ dataModal!.reqId || '-' }}</span>
        </div>
      </div>

      <div class="flex align-items-center">
        <div class="md:col-2">
          <label class="font-bold text-lg">สถานะ : &nbsp;</label>
        </div>
        <div class="flex col-auto text-lg">
          <Tag
            class="shadow-4 border-round-lg font-bold"
            :icon="StatusApprove[dataModal!.status].icon"
            :severity="StatusApprove[dataModal!.status].severity"
            :value="StatusApprove[dataModal!.status].value"
          >
          </Tag>
          &nbsp;
          <div v-if="dataModal!.status === 'waiting_for_approve'" style="margin-top: 8px; font-size: 14px">
            {{
              dataModal!.importationDrugReqStates[dataModal!.importationDrugReqStates.length - 1].state === 'submitted'
                ? '(อย.)'
                : '(กรมสรรพสามิต)'
            }}
          </div>
        </div>
      </div>

      <div class="flex align-items-center" v-if="dataModal!.status === 'rejected'">
        <div class="md:col-2">
          <label class="font-bold text-lg">เหตุผล : &nbsp;</label>
        </div>
        <div class="col-auto text-lg">
          <span>{{ dataModal!.rejectedReason || '-' }}</span>
        </div>
      </div>

      <div class="flex align-items-center">
        <div class="md:col-2">
          <label class="font-bold text-lg">ชื่อยา : &nbsp;</label>
        </div>
        <div class="col-auto text-lg">
          <span>{{ dataModal!.drugName || '-' }}</span>
        </div>
      </div>

      <div class="card mt-4">
        <Timeline :value="dataModal?.importationDrugReqStates" align="alternate" class="customized-timeline">
          <template #marker="{ item }">
            <i
              :class="MapStatus[item.state === 'completed' ? `${item.state}_${dataModal?.status}` : item.state].icon"
              :style="{
                color: MapStatus[item.state === 'completed' ? `${item.state}_${dataModal?.status}` : item.state].color,
              }"
            ></i>
          </template>
          <template #content="{ item }">
            <div class="font-semibold">
              {{ MapStatus[item.state === 'completed' ? `${item.state}_${dataModal?.status}` : item.state].title }}
            </div>
            <div class="text-sm my-1">
              {{ moment(item.createdDate!).format('DD/MM/yyyy HH:mm:ss') }}
            </div>
            <div v-if="dataModal?.status === 'rejected' && item.state === 'completed'" class="text-sm my-1">
              <strong> <u>เหตุผล</u> :</strong>
              {{ dataModal?.rejectedReason || '-' }}
            </div>
          </template>
        </Timeline>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
@media screen and (max-width: 960px) {
  ::v-deep(.customized-timeline) {
    .p-timeline-event:nth-child(even) {
      flex-direction: row;

      .p-timeline-event-content {
        text-align: left;
      }
    }

    .p-timeline-event-opposite {
      flex: 0;
    }
  }
}
</style>
