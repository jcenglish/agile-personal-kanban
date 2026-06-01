import { NavLink, useParams } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { boardId } = useParams<{ boardId: string }>();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>Kanban</div>
      <ul className={styles.nav}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""}>
            All Boards
          </NavLink>
        </li>
        {boardId && (
          <>
            <li className={styles.section}>Current Board</li>
            <li>
              <NavLink
                to={`/boards/${boardId}`}
                end
                className={({ isActive }) => isActive ? styles.active : ""}
              >
                Board
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/boards/${boardId}/backlog`}
                className={({ isActive }) => isActive ? styles.active : ""}
              >
                Backlog
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/boards/${boardId}/analytics`}
                className={({ isActive }) => isActive ? styles.active : ""}
              >
                Analytics
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
