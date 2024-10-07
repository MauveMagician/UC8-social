import styles from "./menuSuperior.module.css";

export default function MenuSuperior() {
  return (
    <div className={styles.container}>
      <button className={styles.cor}>
        <img src="/lua.svg"></img>
      </button>
      <button className={styles.logo}>
        <img src="/pato.svg"></img>
      </button>
      <button className={styles.sininho}>
        <img src="/sino.svg"></img>
      </button>
    </div>
  );
}