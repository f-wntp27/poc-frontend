<script setup lang="ts">
import { ref } from 'vue';
import { useHttpService } from '@/services/http.services';
import type { ImporttationDrugMatResponseModel, DatatableRef } from '@/models';
import { StatusApprove } from '@/constant';
import { useAppStore } from '@/stores/app.store';
import PdaModal from './PdaModal.vue';

const appStore = useAppStore();
const openApprove = ref(false);
const dataModal = ref<ImporttationDrugMatResponseModel>();
const statusAction = ref<StatusApprove>();
const mdt = ref<DatatableRef>();

const tableFields = ref([
  {
    field: 'licenseNo',
    label: 'เลขใบอนุญาต',
    type: 'string',
    headerClass: 'text-center',
  },
  // {
  //   field: 'drugName',
  //   label: 'ชื่อยา',
  //   type: 'string',
  //   headerClass: 'text-center',
  // },
  // {
  //   field: 'drugIngredients',
  //   label: 'ส่วนประกอบ',
  //   type: 'string',
  //   headerClass: 'text-center',
  // },
  // {
  //   field: 'drugPrice',
  //   label: 'ราคายา (บาท)',
  //   type: 'number, 2',
  //   headerClass: 'text-center',
  // },
  // {
  //   field: 'drugUnit',
  //   label: 'หน่วย',
  //   type: 'string',
  //   headerClass: 'text-center',
  // },
]);

async function getDataList() {
  const response = await useHttpService().get<ImporttationDrugMatResponseModel[]>(
    '/api/importation-drug-mat-req/fda-approve-mats',
  );
  return { data: response.entity };
}

async function onAction(data: ImporttationDrugMatResponseModel, operation: StatusApprove) {
  dataModal.value = data;
  openApprove.value = true;
  await appStore.preLoading(200);
  statusAction.value = operation;
}
</script>

<template>
  <PageLayout :nameHeader="$route.meta.title">
    <!-- <div class="flex justify-content-end py-2">
      <Button icon="mdi mdi-magnify" class="p-button-sm ms-2 shadow-4 mx-1" label="ค้นหา" />
    </div> -->
    <MyDataTable ref="mdt" :fields="tableFields" :searchFunction="getDataList">
      <Column header="สถานะ" bodyClass="text-center" headerClass="text-center" style="width: 20rem">
        <template #body="{ data }">
          <div
            v-if="data.importationDrugsId"
            class="flex justify-content-center align-items-center gap-3"
            style="color: green"
          >
            <i class="mdi mdi-check-circle-outline" style="font-size: 30px" /> &nbsp;&nbsp;
            <strong><u>พบใบอนุญาต</u></strong>
          </div>
          <div v-else style="color: red" class="flex justify-content-center align-items-center gap-3">
            <i class="mdi mdi-close-circle-outline" style="font-size: 30px" /> &nbsp;&nbsp;
            <strong><u>ไม่พบใบอนุญาต</u></strong>
          </div>
        </template>
      </Column>
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
  </PageLayout>

  <PdaModal v-model:open="openApprove" :data="dataModal" :action="statusAction" :datatableRef="mdt" />
</template>

<style scoped lang="scss"></style>
