<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHttpService } from '@/services/http.services';

type StatusDashboard = {
  waitingForApprove: number;
  approved: number;
  rejected: number;
};

const httpServise = useHttpService();
onMounted(async () => {
  const response = await getDashboard();
  chartOptions.value = setChartOptions();
  chartDataDrug.value = setChartData(response.entity.drugRequest);
  chartDataMat.value = setChartData(response.entity.materialRequest);
});

async function getDashboard() {
  return await httpServise.get<{ drugRequest: StatusDashboard; materialRequest: StatusDashboard }>('api/dashboard');
}

const chartDataDrug = ref();
const chartDataMat = ref();

const chartOptions = ref();

const setChartData = (value: StatusDashboard) => {
  // const documentStyle = getComputedStyle(document.body);

  return {
    labels: ['อนุมัติ', 'ไม่อนุมัติ', 'รอการอนุมัติ'],
    datasets: [
      {
        data: [value.approved, value.rejected, value.waitingForApprove],
        // backgroundColor: SetColor(),
        // hoverBackgroundColor: SetColor(),

        backgroundColor: ['#77CEFF', '#123E6B', '#97B0C4'],

        // backgroundColor: [
        //   documentStyle.getPropertyValue('--blue-800'),
        //   documentStyle.getPropertyValue('--gray-700'),
        //   documentStyle.getPropertyValue('--gray-500'),
        // ],
        // hoverBackgroundColor: [
        //   documentStyle.getPropertyValue('--blue-800'),
        //   documentStyle.getPropertyValue('--gray-700'),
        //   documentStyle.getPropertyValue('--gray-500'),
        // ],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
};

// const SetColor = () => {
//   let result: string[] = [];
//   for (let i = result.length; i < 3; i++) {
//     result.push('#' + (Math.floor(Math.random() * 26367) + 16750848).toString(16));
//   }
//   return result;
// };
</script>

<template>
  <PageLayout nameHeader="หน้าแรก">
    <div class="flex justify-content-center flex-wrap gap-4">
      <div class="shadow-6 text-center p-4">
        <span class="text-xl">ขออนุมัติใบอนุญาตนำเข้ายา</span>
        <Chart type="doughnut" :data="chartDataDrug" :options="chartOptions" class="w-full" />

        <div class="flex justify-content-center mt-4 pt-4">
          <div v-for="(item, index) of chartDataDrug?.labels" :key="index">
            <span class="text-xl">
              <strong :style="{ color: chartDataDrug?.datasets[0].backgroundColor[index] }"> {{ item }}: </strong>
              <span>{{ chartDataDrug?.datasets[0].data[index] }}</span>
              &nbsp;
            </span>
          </div>
        </div>
      </div>

      <div class="shadow-6 text-center p-4">
        <span class="text-xl">ขออนุมัติใบอนุญาตนำเข้าวัตถุดิบยา</span>
        <Chart type="doughnut" :data="chartDataMat" :options="chartOptions" class="w-full" />

        <div class="flex justify-content-center mt-4 pt-4">
          <div v-for="(item, index) of chartDataMat?.labels" :key="index">
            <span class="text-xl">
              <strong :style="{ color: chartDataMat?.datasets[0].backgroundColor[index] }"> {{ item }}: </strong>
              <span>{{ chartDataMat?.datasets[0].data[index] }}</span>
              &nbsp;
            </span>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>
