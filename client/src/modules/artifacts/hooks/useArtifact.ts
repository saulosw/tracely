import { useCallback, useEffect, useState } from 'react'

import { describeArtifactError } from '../services/artifactErrors'
import { fetchArtifact } from '../services/artifactsApi'

import type { Artifact } from '../types'


export type ArtifactState =
  | { status: 'loading' }
  | { status: 'ready'; artifact: Artifact }
  | { status: 'error'; message: string }

export function useArtifact(id: string | undefined): ArtifactState {
  const [state, setState] = useState<ArtifactState>({ status: 'loading' })

  const load = useCallback(() => {
    if (!id) {
      setState({ status: 'error', message: 'Esse diário não existe mais.' })
      return undefined
    }

    let active = true
    setState({ status: 'loading' })

    fetchArtifact(id)
      .then((artifact) => {
        if (active) {
          setState({ status: 'ready', artifact })
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
  }, [id])

  useEffect(load, [load])

  return state
}
