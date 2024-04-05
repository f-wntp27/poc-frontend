import { ref, computed } from 'vue';
import { createGlobalState, useLocalStorage } from '@vueuse/core';
import { Base64StringSerializer } from '@/utils';
import { USERNAME_KEY } from '@/constant';

export const useUserStore = createGlobalState(() => {
  const getUsername = useLocalStorage<string>(USERNAME_KEY, 'fda', {
    mergeDefaults: true,
    serializer: new Base64StringSerializer(),
  });

  const changeUserName = (name: string): void => {
    getUsername.value = name;
  };

  return {
    getUsername,
    changeUserName,
  };
});
