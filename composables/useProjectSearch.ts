import type { ProjectFull } from '~/types/megome'

export const useProjectSearch = (projects: Ref<ProjectFull[] | null>) => {
  const query = ref('')
  const debouncedQuery = ref('')
  const debounceMs = 150

  let timeout: ReturnType<typeof setTimeout> | null = null
  watch(query, (value) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedQuery.value = value
    }, debounceMs)
  })

  const results = computed(() => {
    const term = debouncedQuery.value.trim().toLowerCase()
    if (!term) return projects.value ?? []

    return (projects.value ?? []).filter((project) => {
      const title = (project.title ?? '').toLowerCase()
      const description = (project.description ?? '').toLowerCase()
      const techs = (project.technologies ?? [])
        .map((tech) => (tech.name ?? '').toLowerCase())
        .join(' ')

      return title.includes(term) || description.includes(term) || techs.includes(term)
    })
  })

  const hasQuery = computed(() => debouncedQuery.value.trim().length > 0)

  const clear = () => {
    if (timeout) clearTimeout(timeout)
    query.value = ''
    debouncedQuery.value = ''
  }

  return { query, results, hasQuery, clear }
}
