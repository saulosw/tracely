import { useCallback, useEffect, useState } from 'react'

import { describeArtifactError } from '../services/artifactErrors'
import { fetchArtifacts } from '../services/artifactsApi'

import type { ArtifactSummary } from '../types'


export type ArtifactLibraryState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; items: ArtifactSummary[]; nextCursor: string | null; loadingMore: boolean }

export function useArtifactLibrary(): {
  state: ArtifactLibraryState
  loadMore: () => Promise<void>
} {
  const [state, setState] = useState<ArtifactLibraryState>({ status: 'loading' })

  useEffect(() => {
    let active = true

    fetchArtifacts()
      .then((page) => {
        if (active) {
          setState({
            status: 'ready',
            items: page.items,
            nextCursor: page.nextCursor,
            loadingMore: false,
          })
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({ status: 'error', message: describeArtifactError(error) })
        }
      })

    return () => {
      active = false
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (state.status !== 'ready' || !state.nextCursor || state.loadingMore) {
      return
    }
    setState({ ...state, loadingMore: true })
    try {
      const page = await fetchArtifacts(state.nextCursor)
      setState({
        status: 'ready',
        items: [...state.items, ...page.items],
        nextCursor: page.nextCursor,
        loadingMore: false,
      })
    } catch {
      setState({ ...state, loadingMore: false })
    }
  }, [state])

  return { state, loadMore }
}
