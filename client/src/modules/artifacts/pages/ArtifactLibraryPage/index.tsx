import { FormAlert } from '@/shared/components/FormAlert'
import { PageContainer } from '@/shared/components/PageContainer'
import { PageHeader } from '@/shared/components/PageHeader'
import { ScreenLoader } from '@/shared/components/ScreenLoader'
import { ArtifactGroup } from '../../components/ArtifactGroup'
import { LibraryEmpty } from '../../components/LibraryEmpty'
import { useArtifactLibrary } from '../../hooks/useArtifactLibrary'
import { groupArtifactsByKind } from '../../services/artifactGroups'
import { LoadMoreButton } from './styles'


export function ArtifactLibraryPage() {
  const { state, loadMore } = useArtifactLibrary()

  if (state.status === 'loading') {
    return <ScreenLoader />
  }

  if (state.status === 'error') {
    return (
      <PageContainer align="top">
        <FormAlert>{state.message}</FormAlert>
      </PageContainer>
    )
  }

  const groups = groupArtifactsByKind(state.items)


  return (
    <PageContainer align="top">
      <PageHeader
        title="Meus artefatos"
        subtitle="Tudo o que você já gerou, reunido por tipo e do mais recente ao mais antigo."
      />

      {groups.length > 0 ? (
        <>
          {groups.map((group) => (
            <ArtifactGroup key={group.definition.id} group={group} />
          ))}

          {state.nextCursor ? (
            <LoadMoreButton onClick={loadMore} loading={state.loadingMore}>
              Carregar mais
            </LoadMoreButton>
          ) : null}
        </>
      ) : (
        <LibraryEmpty />
      )}
    </PageContainer>
  )
}
