import type {
  NewActivity,
  NewProject,
  Project,
  ProviderAccount,
} from '../entities/index.js'


export type SourceProject = Omit<NewProject, 'connectionId'>

export type SourceActivity = Omit<NewActivity, 'connectionId' | 'projectId'>

export type FetchProjectActivitiesInput = {
  accessToken: string
  project: Project
  account: ProviderAccount
  since: Date | null
}

export type ActivityProvider = {
  fetchAccount(accessToken: string): Promise<ProviderAccount>
  fetchProjects(accessToken: string): AsyncIterable<SourceProject[]>
  fetchProjectActivities(input: FetchProjectActivitiesInput): AsyncIterable<SourceActivity[]>
}
