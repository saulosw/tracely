import { useAuth } from '@/modules/auth'
import { PageContainer } from '@/shared/components/PageContainer'
import { EmptyStory } from '../../components/EmptyStory'
import { useStoryState } from '../../hooks/useStoryState'


export function DashboardPage() {
  const { user } = useAuth()
  const story = useStoryState()


  return (
    <PageContainer>
      {story.status === 'empty' ? <EmptyStory firstName={user?.firstName} /> : null}
    </PageContainer>
  )
}
