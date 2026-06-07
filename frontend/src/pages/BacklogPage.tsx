import { useParams } from "react-router-dom";
import styles from "./BacklogPage.module.css";
import SprintPanel from "../components/sprint/SprintPanel";
import { useSprints } from "../hooks/useSprints";
import { useBacklog, useCreateStory, useUpdateStory } from "../hooks/useStories";
import { useTemplates } from "../hooks/useTemplates";
import { useEpics } from "../hooks/useEpics";
import { Epic, Sprint } from "../types";
import TemplateList from "../components/template/TemplateList";
import { useState } from "react";

/**
 * BacklogPage — two-panel sprint planning view.
 *
 * Implementation guide:
 *
 * 1. Get boardId from useParams.
 *
 * 2. Call hooks at the top:
 *    - useBacklog(boardId) → backlog stories
 *    - useSprints(boardId) → planning sprints for the SprintPanel
 *    - useTemplates(boardId) → for the templates section
 *    - useEpics (direct query or hook) → for story creation epic selector
 *
 * 3. Left panel — SprintPanel:
 *    <SprintPanel sprints={sprints} boardId={boardId} backlogStories={backlogStories} />
 *
 * 4. Right panel — Backlog:
 *    - "Backlog" heading with count
 *    - Inline "Add story" form: title input + submit → useCreateStory
 *    - List of backlog stories. Each row: title, points badge, epic badge, and an
 *      "Add to Sprint" button that opens a sprint selector popover (or select dropdown)
 *      then calls useUpdateStory({ sprint_id }).
 *
 * 5. Templates section (below backlog or in a collapsible panel):
 *    <TemplateList templates={templates} epics={epics} boardId={boardId} />
 */
const storyEpic = (epicId: string | null, epics: Epic[]): Epic | undefined => {
  if (epicId === null) return undefined
  return epics.find(epic => epicId === epic.id)
}

export default function BacklogPage() {
  const { boardId } = useParams<{ boardId: string }>();
  if (!boardId) return null;
  const backlogStories = useBacklog(boardId).data ?? []
  const sprints = useSprints(boardId).data ?? []
  const templates = useTemplates(boardId).data ?? []
  const epics = useEpics(boardId).data ?? []
  const createStory = useCreateStory(boardId)
  const [storyTitle, setStoryTitle] = useState("")
  const updateStory = useUpdateStory(boardId)
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)

  const handleAddToSprint = (sprint: Sprint, storyId: string) => {
    setSelectedSprint(sprint)
    updateStory.mutate({storyId, ...{sprint_id: selectedSprint?.id}})
  }

  // TODO: USER IMPLEMENTS
  return (
    <div className={styles.page}>
      <SprintPanel sprints={sprints} boardId={boardId} backlogStories={backlogStories}/>
      <div>
        <h1>{`Backlog ${backlogStories.length}`}</h1>
        <form>
          Add story:
          <label>Title
            <input type="text" onBlur={(event) => setStoryTitle(event.currentTarget.value)} />
          </label>
            <button type="submit" onClick={(event) => {
            event.preventDefault()
            createStory.mutate({ title: storyTitle })
            setStoryTitle("")
            }}>Submit</button>
        </form>
        <ul>
          {backlogStories.map(({title, points, id, epic_id}) => (
            <li key={id}>
              {`${title} ${points ?? ""} ${storyEpic(epic_id, epics) ?? ""}`}
              <label>Add to sprint
                <select>
                  {sprints.map(sprint => {
                    return <option value={sprint.name} key={sprint.id} onClick={() => handleAddToSprint(sprint, id)}>
                      {sprint.name}
                    </option>
                  })}
                </select>
                </label>
            </li>
          ))}
        </ul>
      </div>
      <TemplateList templates={templates} epics={epics} boardId={boardId} />
    </div>
  );
}
