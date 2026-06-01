import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createBoard, deleteBoard, getBoards } from "../api/boards";
import type { Board } from "../types";
import styles from "./BoardsPage.module.css";

export default function BoardsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const { data: boards = [], isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });

  const createMutation = useMutation({
    mutationFn: (boardName: string) => createBoard({ name: boardName }),
    onSuccess: (board: Board) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setName("");
      setCreating(false);
      navigate(`/boards/${board.id}`);
    },
    onError: () => toast.error("Failed to create board"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boards"] }),
    onError: () => toast.error("Failed to delete board"),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) createMutation.mutate(name.trim());
  };

  const handleDelete = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    if (confirm("Delete this board and all its data?")) {
      deleteMutation.mutate(boardId);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading boards…</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Boards</h1>
        <button className={styles.newBtn} onClick={() => setCreating(true)}>
          + New Board
        </button>
      </div>

      {creating && (
        <form className={styles.createForm} onSubmit={handleCreate}>
          <input
            autoFocus
            className={styles.input}
            placeholder="Board name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className={styles.saveBtn} disabled={!name.trim()}>
            Create
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => setCreating(false)}>
            Cancel
          </button>
        </form>
      )}

      {boards.length === 0 && !creating ? (
        <p className={styles.empty}>No boards yet. Create one to get started.</p>
      ) : (
        <ul className={styles.list}>
          {boards.map((board) => (
            <li
              key={board.id}
              className={styles.card}
              onClick={() => navigate(`/boards/${board.id}`)}
            >
              <div className={styles.cardBody}>
                <span className={styles.boardName}>{board.name}</span>
                {board.description && (
                  <span className={styles.boardDesc}>{board.description}</span>
                )}
              </div>
              <button
                className={styles.deleteBtn}
                onClick={(e) => handleDelete(e, board.id)}
                title="Delete board"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
