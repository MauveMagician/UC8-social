"use client";
import { useContext } from "react";
import styles from "./menuSuperior.module.css";
import { useDarkMode } from "./context/DarkModeContext";
import { useState, useEffect } from "react";
import Notificacoes from "./notificacoes";

export default function MenuSuperior() {
  const [bell, setBell] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { dark, setDark } = useDarkMode();
  const handleDarkModeToggle = () => {
    const newDarkMode = !dark;
    setDark(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        console.log(data);
        setBell(data.bell);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleMenuClick = () => {
    setMenuVisible(!menuVisible);
  };
  return (
    <>
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <button className={styles.cor} onClick={handleDarkModeToggle}>
          <img src={dark ? "/lua-dark.svg" : "/lua.svg"}></img>
        </button>
        <button className={styles.logo}>
          <img src={dark ? "/pato-dark.svg" : "/pato.svg"}></img>
        </button>
        <button className={styles.sininho} onClick={handleMenuClick}>
          <img src={dark ? "/sino-dark.svg" : "/sino.svg"}></img>
        </button>
      </div>
      {menuVisible ? <Notificacoes /> : <></>}
    </>
  );
}
