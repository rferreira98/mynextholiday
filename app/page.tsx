import styles from "./page.module.css";
import MainSection from "./pages/MainSection";

export default function Home() {
  return (
    <main className={styles.main}>
      <MainSection />
    </main>
  );
}
