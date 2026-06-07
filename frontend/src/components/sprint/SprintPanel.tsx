import { useState } from "react";
import type { Sprint, Story } from "../../types";
import styles from "./SprintPanel.module.css";
import { useStories, useUpdateStory } from "../../hooks/useStories";
import { useCreateSprint, useStartSprint } from "../../hooks/useSprints";
import SprintForm from "./SprintForm";

interface Props {
  sprints: Sprint[];
  boardId: string;
  backlogStories: Story[];
}

/**
 * SprintPanel — left panel on BacklogPage for sprint planning.
 *
 * Implementation guide:
 *
 * 1. Sprint selector: a <select> dropdown listing all planning-status sprints
 *    by name. Selecting one sets local state for the active planning sprint.
 *
 * 2. Show stories in the selected sprint (filter from props or query by sprint_id).
 *    Each story row shows title, points, and a "Remove" button that calls
 *    useUpdateStory({ sprint_id: null }) to move it back to the backlog.
 *
 * 3. "Create Sprint" button — shows SprintForm in a modal or inline. On submit,
 *    call useCreateSprint and auto-select the new sprint.
 *
 * 4. Show the sprint's total story points at the top of the sprint's story list.
 *
 * 5. Start Sprint button — enabled only if the sprint has stories. Calls
 *    useStartSprint. The server will 409 if another sprint is already active;
 *    surface the error via toast.
 */
export default function SprintPanel({sprints, boardId}: Props) {
  // TODO: USER IMPLEMENTS
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
  const [showCreateSprintForm, setShowCreateSprintForm] = useState(false)
  const stories = useStories(boardId).data ?? []
  const updateStory = useUpdateStory(boardId)
  const createSprint = useCreateSprint(boardId)
  const startSprint = useStartSprint(boardId)
  const selectedSprintStories = stories.filter(story => story.sprint_id === selectedSprint?.id)
  const selectedSprintPoints = selectedSprintStories.reduce((acc, story) => acc += (story.points ?? 0), 0)

  const planningSprints = sprints.filter(sprint => sprint.status === "planning")

  const handleRemoveFromSprint = (storyId:string) => {
    updateStory.mutate({storyId, ...{sprint_id: null}})
  }

  const handleStartSprint = () => {
    startSprint.mutate(selectedSprint?.id!)
  }

  return <div className={styles.panel}>
    <label>
      Select sprint:
      <select>
        {planningSprints.map(sprint => {
          return <option value={sprint.name} key={sprint.id} onClick={() => setSelectedSprint(sprint)}>{sprint.name}</option>
        })}
      </select>
    </label>
    <div>
      <div>{`Total points: ${selectedSprintPoints}`}</div>
      <button onClick={handleStartSprint} disabled={selectedSprintStories.length === 0}>Start sprint</button>
      <div>
      {selectedSprintStories.map(story => {
        return (
          <div key={story.id}>
            <div>{story.title}</div>
            <div>{story.points}</div>
            <button onClick={()=>handleRemoveFromSprint(story.id)}>Remove from sprint</button>
          </div>
        )
      })}
        </div>
    </div>
    <div>
      <button onClick={()=> setShowCreateSprintForm(true)}>Create Sprint:</button>
      {showCreateSprintForm ? <SprintForm onSubmit={createSprint.mutate}  onCancel={()=>{setShowCreateSprintForm(false)}} /> : null}
    </div>
    </div>;
}
