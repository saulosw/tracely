export type StoryState = { status: 'empty' } | { status: 'written' }


export function useStoryState(): StoryState {
  return { status: 'empty' }
}
