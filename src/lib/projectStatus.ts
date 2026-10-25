import type { ProjectStatus } from '@/types/project'

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  offline: 'Offline',
  archived: 'Archived',
}

export function isProjectStatus(value: string): value is ProjectStatus {
  return value === 'live' || value === 'offline' || value === 'archived'
}
