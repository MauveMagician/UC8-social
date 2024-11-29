"use client";
import styles from "./menuInferior.module.css";
import { useEffect, useState } from "react";
import Login from "./login";
import FormularioPost from "@/app/formularioPost";
import { useDarkMode } from "./context/DarkModeContext";
import InfoUsuario from "@/app/infoUsuario";

export default function MenuInferior() {
  const { dark, setDark } = useDarkMode();
  const [renderLog, setRenderLog] = useState(false);
  const [renderUser, setRenderUser] = useState(false);
  const [renderPost, setRenderPost] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUsuarioLogado(true);
          } else {
            setUsuarioLogado(false);
          }
        } else {
          setUsuarioLogado(false);
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        setUsuarioLogado(false);
      }
    };

    checkUserSession();
  }, []);
  return (
    <>
      {renderLog ? <Login setRenderLog={setRenderLog} /> : <></>}
      {renderPost ? <FormularioPost /> : <></>}
      {renderUser ? <InfoUsuario setRenderUser={setRenderUser} /> : <></>}
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <button className={styles.mais}>
          <img src={dark ? "/burgermenu-dark.svg" : "/burgermenu.svg"}></img>
        </button>
        <button className={styles.trends}>
          <img src={dark ? "/planet-dark.svg" : "/planet.svg"}></img>
        </button>
        <button
          className={styles.digitar}
          onClick={() => setRenderPost(!renderPost)}
        >
          <img src={dark ? "/notepadlight.svg" : "/notepaddark.svg"}></img>
        </button>
        <button className={styles.batepapo}>
          <img src={dark ? "/speechlight.svg" : "/speechdark.svg"}></img>
        </button>
        <button
          className={styles.conta}
          onClick={() => {
            usuarioLogado
              ? setRenderUser(!renderUser)
              : setRenderLog(!renderLog);
          }}
        >
          <img src={dark ? "/userlight.svg" : "/userdark.svg"}></img>
        </button>
      </div>
    </>
  );
}
