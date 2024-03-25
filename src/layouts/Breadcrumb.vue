<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter, type RouteLocationMatched } from 'vue-router';

const route = useRoute();
const router = useRouter();
const bdcItems = ref(BDCItems(route.matched));

watch(
  () => [route.matched],
  (v) => {
    bdcItems.value = BDCItems(v[0]);
  },
);

function BDCItems(route: RouteLocationMatched[]) {
  return [
    route[0].children[0],
    ...route
      .filter((e) => e.name !== 'home')
      .map((e) => e)
      .slice(1),
  ];
}
</script>
<template>
  <div class="card-breadcrumb flex flex-wrap">
    <div v-for="(item, index) of bdcItems" :key="item.path" class="flex align-items-center">
      <router-link
        :to="{
          path: item.path,
        }"
        custom
      >
        <a
          v-ripple
          :disabled="item.path === route.path"
          :class="{ disabled: item.path === route.path }"
          class="font-breadcrumb p-ripple box flex flex-wrap"
          @click="() => router.push({ name: item.name })"
        >
          {{ item.meta?.title!.toLocaleUpperCase() }}
        </a>
      </router-link>
      <i class="mdi mdi-chevron-right text-3xl mx-1" v-show="index < bdcItems.length - 1" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.font-breadcrumb {
  font-size: 16px;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
    text-decoration: underline;
  }
}

@media only screen and (max-width: 600px) {
  .font-breadcrumb {
    font-size: 12px;
  }
}

a.disabled {
  pointer-events: none;
  font-weight: 500;
  text-decoration: underline;
}

.card-breadcrumb {
  background-color: rgb(255, 255, 255);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  padding: 7px;
  min-height: 46px;
}
</style>
