export { makeRegisterUser } from './auth/registerUser.js'
export type { AuthResult, RegisterUser, RegisterUserInput } from './auth/registerUser.js'
export { makeLoginUser } from './auth/loginUser.js'
export type { LoginUser, LoginUserInput } from './auth/loginUser.js'
export { makeLogoutUser } from './auth/logoutUser.js'
export type { LogoutUser } from './auth/logoutUser.js'
export { makeGetSessionUser } from './auth/getSessionUser.js'
export type { GetSessionUser } from './auth/getSessionUser.js'
export { makeStartProviderConnection } from './connections/startProviderConnection.js'
export type {
  StartProviderConnection,
  StartProviderConnectionInput,
} from './connections/startProviderConnection.js'
export { makeCompleteProviderConnection } from './connections/completeProviderConnection.js'
export type {
  CompleteProviderConnection,
  CompleteProviderConnectionInput,
} from './connections/completeProviderConnection.js'
export { makeDisconnectProvider } from './connections/disconnectProvider.js'
export type {
  DisconnectProvider,
  DisconnectProviderInput,
} from './connections/disconnectProvider.js'
export { makeListConnections } from './connections/listConnections.js'
export type { ListConnections } from './connections/listConnections.js'
export { makeSyncConnection } from './sync/syncConnection.js'
export type { SyncConnection, SyncConnectionInput, SyncTrigger } from './sync/syncConnection.js'
export { makeGetSyncStatus } from './sync/getSyncStatus.js'
export type { GetSyncStatus, GetSyncStatusInput } from './sync/getSyncStatus.js'
export { makeListActivities } from './timeline/listActivities.js'
export type {
  ActivityPage,
  ListActivities,
  ListActivitiesInput,
} from './timeline/listActivities.js'

import type { GetSessionUser } from './auth/getSessionUser.js'
import type { LoginUser } from './auth/loginUser.js'
import type { LogoutUser } from './auth/logoutUser.js'
import type { RegisterUser } from './auth/registerUser.js'
import type { CompleteProviderConnection } from './connections/completeProviderConnection.js'
import type { DisconnectProvider } from './connections/disconnectProvider.js'
import type { ListConnections } from './connections/listConnections.js'
import type { StartProviderConnection } from './connections/startProviderConnection.js'
import type { GetSyncStatus } from './sync/getSyncStatus.js'
import type { SyncConnection } from './sync/syncConnection.js'
import type { ListActivities } from './timeline/listActivities.js'


export type UseCases = {
  registerUser: RegisterUser
  loginUser: LoginUser
  logoutUser: LogoutUser
  getSessionUser: GetSessionUser
  startProviderConnection: StartProviderConnection
  completeProviderConnection: CompleteProviderConnection
  disconnectProvider: DisconnectProvider
  listConnections: ListConnections
  syncConnection: SyncConnection
  getSyncStatus: GetSyncStatus
  listActivities: ListActivities
}
