import Postagem from "./postagens";
import styles from "./timeline.module.css";

export default function Timeline() {
  return (
    <>
      <div className={styles.container}>
        <Postagem />
        <Postagem />
      </div>
    </>
  );
}
