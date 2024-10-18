"use client";
import { useContext } from "react";
import styles from "./menuSuperior.module.css";
import { useDarkMode } from "./context/DarkModeContext";

export default function MenuSuperior() {
  const { dark, setDark } = useDarkMode();
  const handleDarkModeToggle = () => {
    setDark(!dark);
  };
  return (
    <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
      <button className={styles.cor} onClick={handleDarkModeToggle}>
        <img src={dark ? "/lua-dark.svg" : "/lua.svg"}></img>
      </button>
      <button className={styles.logo}>
        <img src={dark ? "/pato-dark.svg" : "/pato.svg"}></img>
      </button>
      <button className={styles.sininho}>
        <img src={dark ? "/sino-dark.svg" : "/sino.svg"}></img>
      </button>
    </div>
  );
}
