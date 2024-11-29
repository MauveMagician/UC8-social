import styles from "./notificacoes.module.css";
import { useState } from "react";
import { useDarkMode } from "./context/DarkModeContext";
import NotificacoesItem from "./notificacoesItem";

export default function Notificacoes() {
  return (
    <>
      <div className={styles.container}>
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
