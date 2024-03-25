import { useToast } from 'primevue/usetoast';

export function toastMsg() {
  const toast = useToast();
  const success = (detail: string, life: number = 5000) =>
    toast.add({ severity: 'success', life: life, detail: detail });
  const info = (detail: string, life: number = 5000) => toast.add({ severity: 'info', life: life, detail: detail });
  const warning = (detail: string, life: number = 5000) => toast.add({ severity: 'warn', life: life, detail: detail });
  const error = (detail: string, life: number = 5000) => {
    if (typeof detail === 'object') {
      for (const key of Object.keys(detail)) {
        return toast.add({ severity: 'error', life: life, detail: `${key} : ${detail[key]}` });
      }
    } else {
      return toast.add({ severity: 'error', life: life, detail: detail });
    }
  };

  return {
    toast,
    success,
    info,
    warning,
    error,
  };
}
