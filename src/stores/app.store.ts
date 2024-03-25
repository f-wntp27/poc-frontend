import { ref, computed } from 'vue';
import { createGlobalState, useLocalStorage } from '@vueuse/core';
import { menuList } from '@/router/menu-list';
import { loadLocaleMessages, setI18nLanguage, SUPPORT_LOCALES } from '@/i18n';
import { useI18n, type Composer } from 'vue-i18n';
import { Base64StringSerializer } from '@/utils';
import { sleep } from '@/utils';

export const useAppStore = createGlobalState(() => {
  const i18n = useI18n({ useScope: 'global' });

  const locale = useLocalStorage('locale', 'en-US', {
    serializer: new Base64StringSerializer(),
  });

  //getter
  const listLocale = computed(() => SUPPORT_LOCALES).value;
  const localeProvider = computed(() => locale.value).value;
  // actions
  async function changeLocale(newLocale: string | undefined = undefined) {
    const shouldReload = newLocale !== undefined;
    newLocale = newLocale || locale.value;

    if (shouldReload) {
      locale.value = newLocale;
      setTimeout(() => window.location.reload(), 100);
    } else {
      setI18nLanguage(i18n as unknown as Composer, newLocale as string);
      await loadLocaleMessages(i18n as unknown as Composer, newLocale as string);
      locale.value = newLocale;
    }
  }

  const getMenu = computed(() => menuList);
  const getCollapsed = computed(() => false);

  const isLoading = ref(false);

  async function preLoading(ms: number) {
    isLoading.value = true;
    await sleep(ms);
    isLoading.value = false;
  }

  return { getMenu, getCollapsed, changeLocale, locale, listLocale, localeProvider, preLoading, isLoading };
});
