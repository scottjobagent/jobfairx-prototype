import { ref, computed } from 'vue'
import type { JobData } from '@/types/job'

export function useEditJob(initialData: JobData) {
  const data = ref<JobData>({ ...initialData })
  const original = ref<JobData>({ ...initialData })
  const isDirty = computed<boolean>(() => JSON.stringify(data.value) !== JSON.stringify(original.value))

  const reset = (): void => {
    data.value = { ...original.value }
  }

  const save = (): void => {
    original.value = { ...data.value }
  }

  const updateField = (field: keyof JobData, value: string): void => {
    data.value[field] = value
  }

  return {
    data,
    isDirty,
    reset,
    save,
    updateField,
  }
}
