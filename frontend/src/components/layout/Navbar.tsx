import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <span className={styles.title}>Personal Agile Kanban</span>
    </header>
  );
}
