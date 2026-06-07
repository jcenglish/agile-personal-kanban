import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "../../store/uiStore";
import type { EnergyType, Epic, Sprint, Story } from "../../types";
import { useDeleteStory, useUpdateStory } from "../../hooks/useStories";
import {  useState } from "react";
import { StoryUpdate } from "../../api/stories";
import PointsPicker from "./PointsPicker";
import EnergyTypePicker from "./EnergyTypePicker";

interface Props {
  boardId: string;
  epics: Epic[];
  sprints: Sprint[];
}

/**
 * StoryModal — detail view and inline editor for a single story.
 *
 * Implementation guide:
 *
 * 1. Read uiStore.selectedStoryId and uiStore.isModalOpen. If not open or no
 *    ID, render nothing (return null).
 *
 * 2. Fetch story data from the React Query cache using the story's ID from
 *    useStories or useBacklog. Do not make a separate network request if the
 *    story is already cached.
 *
 * 3. Inline-editable title: clicking the title renders an <input>; on blur or
 *    Enter, call useUpdateStory({ title }) and switch back to display mode.
 *
 * 4. All other fields are form controls:
 *    - description: <textarea>, saves on blur
 *    - points: <PointsPicker>
 *    - energy_type: <EnergyTypePicker>
 *    - epic_id: <select> populated from props.epics
 *    - is_urgent / is_important: <input type="checkbox">
 *    Each field update calls useUpdateStory immediately (no Save button needed).
 *
 * 5. Show sprint name or "Backlog" in a read-only badge.
 *
 * 6. Delete button: show a confirmation dialog (window.confirm or inline).
 *    On confirm, call useDeleteStory, then uiStore.closeModal().
 *
 * 7. Close button (✕) and clicking the backdrop call uiStore.closeModal().
 *
 * Interview note: optimistic field updates — call mutation immediately on
 * change; React Query will roll back on error. Use useMutation's onError
 * to restore the previous value and show a toast.
 */
const TitleInput = ({ showTitleInput, setShowTitleInput, updateStory, storyTitle, setStoryTitle, storyId }: {
  showTitleInput: boolean,
  setShowTitleInput: (show: boolean) => void,
  updateStory: UseMutationResult<Story, Error, {
    storyId: string;
  } & StoryUpdate>,
  storyTitle: string,
  setStoryTitle: (title: string) => void,
  storyId: string
}) => {
  if (showTitleInput) {
    return <input type="text" onKeyDown={(event) => {
      event.preventDefault()
      if (event.code === "Enter") {
        updateStory.mutate({
          storyId,
          ...{ title: event.currentTarget.value }
        })
        event.currentTarget.value = ""
        setStoryTitle(event.currentTarget.value)
        setShowTitleInput(false)
      }
    }}/>
  } else {
    return <div onClick={() => setShowTitleInput(true)}>{storyTitle}</div>
  }
}

export default function StoryModal({boardId, epics, sprints}: Props) {
  // TODO: USER IMPLEMENTS
  const uiStore = useUIStore()
  const selectedStoryId = useUIStore((state) => state.selectedStoryId)
  const isModalOpen = useUIStore((state) => state.isModalOpen)
  const queryClient = useQueryClient()
  const [showTitleInput, setShowTitleInput] = useState(false)
  const cachedStories = queryClient.getQueryData<Story[]>(["stories", boardId]);
  const [points, setPoints] = useState<number |null>(null)
  const [energyType, setEnergyType] = useState<EnergyType |null>(null)
  const [urgentChecked, setUrgentChecked] = useState<boolean |null>(null)
  const [importantChecked, setImportantChecked] = useState<boolean |null>(null)
  
  const story = cachedStories?.find(item => item.id === selectedStoryId)
  const [storyTitle, setStoryTitle] = useState(story?.title ?? "")
  const updateStory = useUpdateStory(boardId)
  const deleteStory = useDeleteStory(boardId)
  const sprint = sprints.find(sprint => sprint.board_id === boardId)

  if (!isModalOpen || !selectedStoryId) return null;

  if (!story) return null;

  const handlePointsPicker = () => {
    updateStory.mutate({ storyId: story.id, ...{ points } })
    setPoints(points)
  }

  const handleDescription = (description: string) => {
    updateStory.mutate({storyId: story.id, ...{description }})
  }

  const handleUrgentCheckbox = () => {
    setUrgentChecked((prev) => !prev)
    updateStory.mutate({ storyId: story.id, ...{ is_urgent: urgentChecked } })
  }

  const handleImportantCheckbox = () => {
    setImportantChecked((prev) => !prev)
    updateStory.mutate({ storyId: story.id, ...{ is_important: importantChecked } })
  }

  const handleEnergyPicker = () => {
    updateStory.mutate({storyId: story.id, ...{energy_type: energyType }})
    setEnergyType(energyType)
  }

  const handleDelete = () => {
    const confirm = window.confirm("Delete?")
    if (confirm) {
      deleteStory.mutate(story.id)
      uiStore.closeModal()
    }
  }

  const handleClose = () => {
    uiStore.closeModal()
  }


  return (
    <div>
      <div>
        <button onClick={handleClose}>X</button>
        <TitleInput showTitleInput={showTitleInput} setShowTitleInput={setShowTitleInput} updateStory={updateStory} storyTitle={storyTitle} setStoryTitle={setStoryTitle} storyId={story.id} />
        <label>
          Description:
          <textarea rows={5} cols={40} value="" onBlur={(event) => handleDescription(event.currentTarget.value)} />
        </label>
        <label>
          Points:
          <PointsPicker value={points} onChange={ handlePointsPicker} />
        </label>
        <label>
          Energy type:
          <EnergyTypePicker value={energyType} onChange={ handleEnergyPicker} />
        </label>
        <label>
          Urgent?:
          <input type="checkbox" checked={!!urgentChecked} onClick={handleUrgentCheckbox} />
        </label>
        <label>
          Important?:
          <input type="checkbox" checked={!!importantChecked} onClick={handleImportantCheckbox} />
        </label>
        <div>{sprint ? sprint.name : "Backlog"}</div>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
