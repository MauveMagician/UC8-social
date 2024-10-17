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
    <div className={styles.container}>
      <button className={styles.cor} onClick={handleDarkModeToggle}>
        <img src={dark ? "lua-dark.svg" : "/lua.svg"}></img>
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
