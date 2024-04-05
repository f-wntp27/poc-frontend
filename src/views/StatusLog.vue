<script setup lang="ts">
import { ref } from 'vue';
import { useHttpService } from '@/services/http.services';
import type { DatatableRef } from '@/models';
import { useAppStore } from '@/stores/app.store';
import moment from 'moment';
import { ellipsis } from '@/utils';

type LicenseRequestStatusLogsModel = {
  id: string;
  requestId: string;
  requestTypeName: string;
  drugName: string;
  status: string;
  approvedDate: string;
  approvedBy: string;
  rejectedDate: string;
  rejectedBy: string;
  rejectedReason: string;
  currentState: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  licenseNo: string;
  details: {
    id: string;
    state: string;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
  }[];
};

const appStore = useAppStore();
const dataModal = ref<LicenseRequestStatusLogsModel>();
const mdt = ref<DatatableRef | null>(null);
const visible = ref(false);

const StatusApprove: { [key: string]: { severity: string; value: string; icon: string } } = {
  อนุมัติ: { severity: 'success', value: 'อนุมัติ', icon: 'mdi mdi-check-circle-outline' },
  ไม่อนุมัติ: { severity: 'danger', value: 'ไม่อนุมัติ', icon: 'mdi mdi-close' },
  รอการอนุมัติ: { severity: 'info', value: 'รอการอนุมัติ', icon: 'mdi mdi-clock-time-three-outline' },
  กำลังสร้างเลขที่ใบอนุญาต: {
    severity: 'warning',
    value: 'กำลังสร้างเลขที่ใบอนุญาต',
    icon: 'mdi mdi-clock-time-three-outline',
  },
};

const MapStatus: { [key: string]: string } = {
  ขอใบอนุญาตนำเข้ายา: '#9BB0C1',
  ขอใบอนุญาตนำเข้าเครื่องมือทางการแพทย์: '#9BB0C1',
  ตรวจสอบผู้ใช้งาน: 'rgb(245, 158, 11)',
  'ตรวจสอบเอกสาร 1': 'rgb(245, 158, 11)',
  'ตรวจสอบเอกสาร 2': 'rgb(245, 158, 11)',
  'ตรวจสอบเอกสาร 3': 'rgb(245, 158, 11)',
  ไม่ออกใบอนุญาต: '#E41D3D',
  ปิดงานไม่อนุมัติ: '#E41D3D',
  ออกใบอนุญาติเสร็จสิ้น: '#00A371',
  ปิดงานดำเนินพิธีการศุลกากร: '#00A371',
};

const tableFields = ref([
  {
    field: 'requestId',
    label: 'เลขที่งาน',
    type: 'string',
    headerClass: 'text-center w-30rem',
  },
  {
    field: 'requestTypeName',
    label: 'ประเภท',
    type: 'string',
    headerClass: 'text-center w-30rem',
  },
  {
    field: 'updatedDate',
    label: 'เวลาอัพเดท',
    type: 'datetime, DD/MM/yyyy HH:mm:ss',
    headerClass: 'text-center',
  },
]);

async function getDataList() {
  appStore.isLoading.value = true;
  const response = await useHttpService().get<LicenseRequestStatusLogsModel[]>(`/api/license-request/logs`);
  appStore.isLoading.value = false;
  return { data: response.entity };
}

async function onAction(data: LicenseRequestStatusLogsModel) {
  dataModal.value = data;
  visible.value = true;
  await appStore.preLoading(200);
}
</script>

<template>
  <PageLayout :nameHeader="$route.meta.title">
    <MyDataTable ref="mdt" :fields="tableFields" :searchFunction="getDataList">
      <Column header="สถานะ" bodyClass="text-center" headerClass="text-center" style="width: 20rem">
        <template #body="{ data }">
          <Tag
            class="shadow-4 border-round-lg font-bold"
            :icon="StatusApprove[data.status].icon"
            :severity="StatusApprove[data.status].severity"
            :value="StatusApprove[data.status].value"
            v-tooltip.top="StatusApprove[data.status].value"
          >
          </Tag>
        </template>
      </Column>

      <Column header="เลขที่ใบอนุญาต" bodyClass="text-center" headerClass="text-center" style="width: 20rem">
        <template #body="{ data }">
          <div v-tooltip.top="data.licenseNo">
            {{ ellipsis(data.licenseNo) ?? '-' }}
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
          <label class="font-bold text-lg">ประเภท : &nbsp;</label>
        </div>
        <div class="col-auto text-lg">
          <span>{{ dataModal!.requestTypeName || '-' }}</span>
        </div>
      </div>

      <div class="flex align-items-center">
        <div class="md:col-2">
          <label class="font-bold text-lg">เลขที่ใบอนุญาต : &nbsp;</label>
        </div>
        <div class="col-auto text-lg">
          <span>{{ dataModal!.licenseNo || '-' }}</span>
        </div>
      </div>

      <div class="flex align-items-center">
        <div class="md:col-2">
          <label class="font-bold text-lg">Request ID : &nbsp;</label>
        </div>
        <div class="col-auto text-lg">
          <span>{{ dataModal!.requestId || '-' }}</span>
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

      <div class="card mt-4 text-left">
        <Divider />
        <Timeline :value="dataModal?.details" align="left" class="customized-timeline">
          <template #marker="{ item }">
            <i class="mdi mdi-circle-slice-8" :style="{ color: MapStatus[item.state] ?? '' }" />
          </template>
          <template #content="{ item }">
            <div class="font-semibold">
              {{ item.state }}
            </div>
            <div class="text-600 text-xs my-1">
              {{ moment(item.createdDate!).format('DD/MM/yyyy HH:mm:ss') }}
            </div>
          </template>
        </Timeline>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
::v-deep(.customized-timeline) {
  padding: 20px;
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
</style>
