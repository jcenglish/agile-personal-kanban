import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import BacklogPage from "./pages/BacklogPage";
import BoardPage from "./pages/BoardPage";
import BoardsPage from "./pages/BoardsPage";
import SprintAnalyticsPage from "./pages/SprintAnalyticsPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<BoardsPage />} />
            <Route path="/boards/:boardId" element={<BoardPage />} />
            <Route path="/boards/:boardId/backlog" element={<BacklogPage />} />
            <Route path="/boards/:boardId/analytics" element={<SprintAnalyticsPage />} />
          </Routes>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
