<script setup lang="ts">
import { ref } from 'vue';
import { useHttpService } from '@/services/http.services';
import type { ImporttationDrugResponseModel, ImporttationDrugMatResquestModel, DatatableRef } from '@/models';
import { useAppStore } from '@/stores/app.store';
import moment from 'moment';
import { ellipsis, numberWithComma } from '@/utils';

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
  currentState: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  licenseNo: string;
  importationDrugsId: string;
  details: ImporttationDrugMatResquestModel[];
  states: {
    id: string;
    state: string;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
  }[];
};

const MapStatus: { [key: string]: { title: string; icon: string; color: string } } = {
  submitted: { title: 'ขอใบอนุญาตนำเข้าวัตถุดิบยา', icon: 'mdi mdi-circle-slice-8', color: '#9BB0C1' },
  fda_approve: { title: 'อย. อนุมัติใบอนุญาตนำเข้าวัตถุดิบยา', icon: 'mdi mdi-circle-slice-8', color: '#00338D' },
  // excise_approve: { title: 'กรมสรรพสามิตอนุมัติใบอนุญาตนำเข้าวัตถุดิบยา', icon: 'mdi mdi-circle-slice-8', color: '#00338D' },
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
  // waiting_for_approve: { severity: 'info', value: 'รอการอนุมัติ', icon: 'mdi mdi-clock-time-three-outline' },
  fda_approve: { severity: 'info', value: 'อย. อนุมัติ', icon: 'mdi mdi-clock-time-three-outline' },
  // excise_approve: { severity: 'info', value: 'กรมสรรพสามิตอนุมัติ', icon: 'mdi mdi-clock-time-three-outline' },
};

const tableFields = ref([
  {
    field: 'reqId',
    label: 'เลขที่งาน',
    type: 'string',
    headerClass: 'text-center w-30rem',
  },
  // {
  //   field: 'licenseNo',
  //   label: 'ชื่อยา',
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
  const response = await useHttpService().get<ImporttationDrugResponseModel[]>('/api/importation-drug-mat-req/list');
  appStore.isLoading.value = false;
  return {
    data: response.entity,
    // data: response.entity.map((v) => ({ ...v, details: [] })),
  };
}

async function onAction(data: ImportationDragReqStatusModel) {
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
            :icon="StatusApprove[data.currentState].icon"
            :severity="StatusApprove[data.currentState].severity"
            :value="StatusApprove[data.currentState].value"
            v-tooltip.top="StatusApprove[data.currentState].value"
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

      <Column header="เลขที่ใบอนุญาต" bodyClass="text-center" headerClass="text-center">
        <template #body="{ data }">
          <div class="flex justify-content-center align-items-center gap-3">
            <div
              v-if="data.importationDrugsId"
              class="flex justify-content-center align-items-center"
              style="color: green"
            >
              <i class="mdi mdi-check-circle-outline" style="font-size: 30px" v-tooltip.top="'พบใบอนุญาต'" />
              &nbsp;&nbsp;
              <!-- <strong><u>พบใบอนุญาต</u></strong> -->
            </div>
            <div v-else style="color: red" class="flex justify-content-center align-items-center">
              <i class="mdi mdi-close-circle-outline" style="font-size: 30px" v-tooltip.top="'ไม่พบใบอนุญาต'" />
              &nbsp;&nbsp;
              <!-- <strong><u>ไม่พบใบอนุญาต</u></strong> -->
            </div>
            <span v-tooltip.top="data.licenseNo">{{ data.licenseNo || '-' }}</span>
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
          <label class="font-bold text-lg">เลขที่ใบอนุญาต : &nbsp;</label>
        </div>
        <div class="col-auto text-lg flex align-items-center gap-3">
          <span>{{ dataModal!.licenseNo || '-' }}</span>
          <div
            v-if="dataModal!.importationDrugsId"
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
            :icon="StatusApprove[dataModal!.currentState].icon"
            :severity="StatusApprove[dataModal!.currentState].severity"
            :value="StatusApprove[dataModal!.currentState].value"
          >
          </Tag>
          &nbsp;
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

      <div class="block md:flex align-items-center" v-if="dataModal!.details.length > 0">
        <div class="md:col-3">
          <label class="text-lg font-bold">วัตถุดิบยา : &nbsp;</label>
        </div>
      </div>

      <DataTable
        :value="dataModal!.details"
        class="shadow-4 mb-4"
        showGridlines
        stripedRows
        v-if="dataModal!.details.length > 0"
      >
        <Column header="#" headerStyle="width:3em" headerClass="text-center" bodyClass="text-center">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column field="materialName" header="ชื่อวัตถุดิบยา" bodyClass="text-center" headerClass="text-center"></Column>
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
      </div>

      <div class="card mt-4">
        <Divider />
        <Timeline :value="dataModal?.states" align="alternate" class="customized-timeline">
          <template #marker="{ item }">
            <i
              :class="MapStatus[item.state === 'completed' ? `${item.state}_${dataModal?.status}` : item.state].icon"
              :style="{
                color: MapStatus[item.state === 'completed' ? `${item.state}_${dataModal?.status}` : item.state].color,
              }"
            ></i>
          </template>
          <template #content="{ item, index }">
            <div class="font-semibold">
              {{ dataModal!.states.length - 1 === index ? '&rarr;' : '' }}
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
