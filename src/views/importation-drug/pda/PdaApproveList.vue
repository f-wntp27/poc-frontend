<script setup lang="ts">
import { ref } from 'vue';
import { useHttpService } from '@/services/http.services';
import type { ImporttationDrugResponseModel, DatatableRef } from '@/models';
import { StatusApprove } from '@/constant';
import { useAppStore } from '@/stores/app.store';
import PdaModal from './PdaModal.vue';

const appStore = useAppStore();
const openApprove = ref(false);
const dataModal = ref<ImporttationDrugResponseModel>();
const statusAction = ref<StatusApprove>();
const mdt = ref<DatatableRef | null>(null);

const tableFields = ref([
  {
    field: 'drugName',
    label: 'ชื่อยา',
    type: 'string',
    headerClass: 'text-center',
  },
  {
    field: 'drugIngredients',
    label: 'ส่วนประกอบ',
    type: 'string',
    headerClass: 'text-center',
  },
  {
    field: 'drugPrice',
    label: 'ราคายา (บาท)',
    type: 'number, 2',
    headerClass: 'text-center',
  },
  {
    field: 'drugUnit',
    label: 'หน่วย',
    type: 'string',
    headerClass: 'text-center',
  },
]);

async function getDataList() {
  appStore.isLoading.value = true;
  const response = await useHttpService().get<ImporttationDrugResponseModel[]>('/api/importation-drug-req/fda-approve');
  appStore.isLoading.value = false;
  return { data: response.entity };
}

async function onAction(data: ImporttationDrugResponseModel, operation: StatusApprove) {
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
            label="แสดงความคิดเห็น"
          />

          <Button
            icon="mdi mdi-close-circle-outline"
            class="p-button-sm ms-2 shadow-4 mx-1 bg-red-500"
            @click="onAction(slotProps.data, StatusApprove.REJECT)"
            label="ปฏิเสธ"
            severity="danger"
          />
        </template>
      </Column>
    </MyDataTable>

    <PdaModal v-model:open="openApprove" :data="dataModal" :action="statusAction" :datatableRef="mdt" />
  </PageLayout>
</template>

<style scoped lang="scss"></style>
