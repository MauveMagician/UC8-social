import styles from "./notificacoes.module.css";
import { useState } from "react";
import { useDarkMode } from "./context/DarkModeContext";
import NotificacoesItem from "./notificacoesItem";

export default function Notificacoes() {
  const { dark, setDark } = useDarkMode();
  return (
    <>
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
        <NotificacoesItem />
      </div>
    </>
  );
}
