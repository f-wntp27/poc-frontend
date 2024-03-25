import type { DateTimeFormatOptions, NumberFormatOptions } from '@intlify/core-base';
import { nextTick } from 'vue';
import { createI18n, type Composer } from 'vue-i18n';

export const FALLBACK_LOCALE = 'en-US';
export const SUPPORT_LOCALES = ['en-US', 'th-TH'];

export function setupI18n() {
  // @ts-ignore
  return createI18n({
    legacy: false,
    locale: 'en-US',
    fallbackLocale: FALLBACK_LOCALE,
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false,
    datetimeFormats: {
      'en-US': Intl.DateTimeFormat('en-US').resolvedOptions() as DateTimeFormatOptions,
      'th-TH': Intl.DateTimeFormat('th-TH').resolvedOptions() as DateTimeFormatOptions,
    },
    numberFormats: {
      'en-US': Intl.NumberFormat('en-US').resolvedOptions() as NumberFormatOptions,
      'th-TH': Intl.NumberFormat('th-TH').resolvedOptions() as NumberFormatOptions,
    },
  });
}

export function setI18nLanguage(i18n: Composer, locale: string) {
  i18n.locale.value = locale;
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')?.setAttribute('lang', locale?.split('-')[0]);
}

export async function loadLocaleMessages(i18n: Composer, locale: string) {
  // load locale messages with dynamic import
  // message = await import(/* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`);

  let message;
  if (locale === 'en-US') {
    message = await import('@/locales/en-US.json');
  } else {
    message = await import('@/locales/th-TH.json');
  }

  // set locale and locale message
  i18n.setLocaleMessage(locale, message.default);

  return nextTick();
}

const i18n = setupI18n();
export default i18n;
