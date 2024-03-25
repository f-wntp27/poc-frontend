<script setup lang="ts">
import DataTable, { type DataTablePageEvent } from 'primevue/datatable';
import { sleep, numberWithComma } from '@/utils';
import { ref, computed, onMounted, watch } from 'vue';
import moment from 'moment';

type FieldHeader = {
  field: string;
  label: string;
  type: string;
  headerClass?: string;
  bodyClass?: string;
  headerStyle?: string;
  bodyStyle?: string;
  hidden?: boolean;
};

const props = defineProps({
  paging: {
    type: Object,
    default: null,
  },
  data: {
    type: Object,
    default: null,
  },
  fields: {
    type: Array<FieldHeader>,
    default: null,
  },
  searchFunction: {
    type: Function,
    required: true,
  },
  editFunction: {
    type: Function,
  },
  deleteFunction: {
    type: Function,
  },
  rowSelectFn: {
    type: Function,
    default: null,
  },
  rowUnSelectFn: {
    type: Function,
    default: null,
  },
  criteria: { type: Object, default: null },
  selectionMode: { type: String, default: null },
  tableStyle: { type: Object, default: null },
  tableClass: { type: String, default: null },
  dataKey: { type: String, default: 'ID', required: false },
  idDelete: { type: String, default: 'ID', required: false },
  showAllData: { type: Boolean, default: false, required: false },
  images: { type: Boolean, default: false, required: false },
});

const emit = defineEmits<{
  (e: 'on:selected', selected: Array<string | number | any>): void | Promise<void>;
}>();

defineExpose({
  search,
});

const dataTableRef = ref<DataTable | null>(null);
const selected = ref<Array<string | number | any>>([]);
const loading = ref<boolean>(true);
const dataAPI = ref({
  dataList: [] as any,
  paging: {
    currentPage: 0,
    itemPerPage: 10,
    totalItems: 0,
  },
});
const pagination = ref({
  currentPage: 0,
  itemPerPage: 10,
  totalItems: 0,
  offset: 0,
});
const rowsPerPageOptions = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '30', value: '30' },
  { label: '50', value: '50' },
  { label: 'All', value: 'null' },
];

const dataList = computed(() => {
  if (typeof props.searchFunction === 'function') {
    return dataAPI.value.dataList;
  } else {
    if (pagination.value.itemPerPage === 0 || pagination.value.itemPerPage === 9999) {
      return props.data?.dataList;
    } else {
      return (
        props.data?.dataList?.slice(pagination.value.offset, pagination.value.offset + pagination.value.itemPerPage) ||
        []
      );
    }
  }
});

const itemPerPage = computed({
  get() {
    if (pagination.value.itemPerPage !== 0 && pagination.value.itemPerPage !== 9999) {
      return String(pagination.value.itemPerPage);
    } else {
      return 'null';
    }
  },
  set(value) {
    pagination.value.itemPerPage = value === 'null' ? 0 : parseInt(value);
  },
});

function onPage(e: DataTablePageEvent) {
  pagination.value.currentPage = e.page || 0;
  search();
}

function onChangeItemPerPage(v: string) {
  const page = !isNaN(Number(v))
    ? Number(v) > dataAPI.value.dataList.length
      ? 0
      : dataAPI.value.paging.currentPage
    : 0;
  pagination.value.currentPage = page;
  search();
}

async function search() {
  loading.value = true;
  dataAPI.value.dataList = null;

  try {
    const { data } = await props.searchFunction();

    if (!data) {
      pagination.value = {
        currentPage: 0,
        itemPerPage: 10,
        offset: 0,
        totalItems: 0,
      };
      await sleep(500);
      loading.value = false;
      return;
    }

    const page = Number(pagination.value.currentPage);
    const dataLen = Number(data?.length);
    const size = Number(pagination.value.itemPerPage === 0 ? dataLen : pagination.value.itemPerPage);

    const dataLenOfPage = size * (page + 1) > dataLen ? dataLen : size * (page + 1);
    const startData = (page + 1) * size === size ? page : (page + 1) * size < size ? size : page * size;

    const dataTotal = [];
    for (let i = startData; i < dataLenOfPage; i++) {
      dataTotal.push(data[i]);
    }
    await sleep(500);
    loading.value = false;

    dataAPI.value = {
      dataList: dataTotal,
      paging: {
        currentPage: page,
        itemPerPage: pagination.value.itemPerPage,
        totalItems: dataLen,
      },
    };
    if (dataAPI.value.dataList) {
      if (typeof dataAPI.value.paging.currentPage === 'number') {
        pagination.value.currentPage = dataAPI.value.paging.currentPage;
      }
      if (typeof dataAPI.value.paging.itemPerPage === 'number') {
        pagination.value.itemPerPage = dataAPI.value.paging.itemPerPage;
      }
      if (typeof dataAPI.value.paging.totalItems === 'number') {
        pagination.value.totalItems = dataAPI.value.paging.totalItems;
      }
      pagination.value.offset = startData;
    }
  } catch (error) {
    dataAPI.value.dataList = [];
    pagination.value = {
      currentPage: 0,
      itemPerPage: 10,
      offset: 0,
      totalItems: 0,
    };
  }
}

function totalRecord(): number {
  return pagination.value.totalItems;
}

function itemPerPageTable(): number {
  if (pagination.value.itemPerPage !== 0 && pagination.value.itemPerPage !== 9999) {
    return pagination.value.itemPerPage;
  } else {
    return totalRecord();
  }
}

function showData(val: any, field: string) {
  const f = field.split('.');
  val = props.images ? val.data : val;
  if (f.length > 1) {
    f.forEach((v) => {
      val = val[v ?? ''];
    });
    return val;
  } else {
    return val[field];
  }
}

onMounted(() => {
  search();
  if (props.showAllData) {
    pagination.value.itemPerPage = 0;
  }
});

watch(
  () => [selected.value],
  (v) => {
    emit('on:selected', v);
  },
);
</script>
<template>
  <transition name="fade" appear>
    <Card class="p-table-card shadow-6">
      <template #content>
        <DataTable
          ref="dataTableRef"
          class="shadow-4"
          :value="dataList"
          :lazy="true"
          :loading="loading"
          v-model:selection="selected"
          :first="pagination.offset"
          :dataKey="dataKey"
          :rowHover="true"
          :tableStyle="tableStyle"
          :tableClass="`${tableClass || ''} header-center ${Array.isArray(fields[0]) ? 'multirow-header' : ''}`"
          responsiveLayout="scroll"
          @rowSelect="rowSelectFn"
          @rowUnselect="rowUnSelectFn"
          :paginator="true"
          :rows="itemPerPageTable()"
          :total-records="totalRecord()"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          showGridlines
          stripedRows
          @page="onPage"
        >
          <Column
            v-if="selectionMode && fields?.length !== 0"
            :selectionMode="selectionMode === 'single' ? 'single' : 'multiple'"
            headerStyle="width:3em"
            headerClass="text-center"
            bodyClass="text-center"
          ></Column>

          <Column header="#" headerStyle="width:3em" headerClass="text-center" bodyClass="text-center">
            <template #body="slotProps">
              {{ pagination.offset + (slotProps.index + 1) }}
            </template>
          </Column>

          <Column
            v-for="col in fields"
            :field="col.field"
            :header="col.label"
            :key="col.field"
            :headerClass="col?.headerClass"
            :bodyClass="col?.bodyClass"
            :headerStyle="col?.headerStyle"
            :bodyStyle="col?.bodyStyle"
            :hidden="col?.hidden"
          >
            <template v-if="!!col.type" #body="slotProps">
              <div class="text-center" v-if="col.type.split(',').length === 2">
                <div class="text-center" v-if="col.type.split(',')[0] === 'number'">
                  {{ numberWithComma(showData(slotProps.data, col.field), Number(col.type.split(',')[1])) }}
                </div>
                <div class="text-center" v-else-if="col.type.split(',')[0] === 'datetime'">
                  {{ moment(showData(slotProps.data, col.field)).format(col.type.split(',')[1]) }}
                </div>
              </div>
              <div class="text-center" v-else-if="col.type === 'number'">
                {{ Number(showData(slotProps.data, col.field)) }}
              </div>
              <div class="text-center" v-else>
                {{ showData(slotProps.data, col.field) }}
              </div>
            </template>
          </Column>

          <Column
            v-if="(editFunction || deleteFunction) && fields?.length !== 0"
            header="Action"
            bodyClass="text-center text-nowrap"
            headerClass="text-center"
          >
            <template #body="slotProps">
              <Button
                v-if="editFunction"
                icon="pi pi-pencil"
                class="p-button-sm p-button-rounded ms-2 shadow-4 transition-colors transition-duration-100 bg-primary-700 hover:bg-primary-100 text-primary-100 hover:text-primary-900"
                @click="editFunction('edit', slotProps.data)"
              />
              &nbsp;
              <Button
                v-if="deleteFunction"
                icon="pi pi-trash"
                class="p-button-sm p-button-rounded ms-2 p-button-raised shadow-4 transition-colors transition-duration-100 bg-red-900 hover:bg-red-100 text-red-100 hover:text-red-900"
                @click="deleteFunction(slotProps.data)"
              />
            </template>
          </Column>

          <template #empty>
            <div>ไม่พบข้อมูล</div>
            <!-- No records found. -->
          </template>

          <template #loading>
            <div class="flex justify-content-center align-items-center">
              <span>
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
              </span>
            </div>
          </template>

          <slot> </slot>
          <template #paginatorend>
            <div class="flex justify-content-center align-items-center">
              <Dropdown
                :disabled="dataList?.totalItems === 0"
                v-model="itemPerPage"
                :options="rowsPerPageOptions"
                optionLabel="label"
                optionValue="value"
                @update:model-value="onChangeItemPerPage"
              />
            </div>
          </template>
        </DataTable>
      </template>
    </Card>
  </transition>
</template>

<style scoped lang="scss"></style>
