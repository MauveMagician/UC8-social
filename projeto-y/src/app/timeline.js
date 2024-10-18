import Postagem from "./postagens";
import styles from "./timeline.module.css";
import Conta from "./conta";

export default function Timeline() {
  return (
    <>
      <div className={styles.container}>
        <Postagem />
        <Postagem /> <Postagem /> <Postagem />
      </div>
    </>
  );
}
