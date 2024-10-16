"use client";
import styles from "./menuInferior.module.css";
import { useState } from "react";
import Login from "./login";
import FormularioPost from "@/formularioPost";

export default function MenuInferior() {
  const [renderLog, setRenderLog] = useState(false);
  const [renderPost, setRenderPost] = useState(false);
  return (
    <>
      {renderLog ? <Login setRenderLog={setRenderLog} /> : <></>}
      {renderPost ? <FormularioPost /> : <></>}
      <div className={styles.container}>
        <button className={styles.mais}>
          <img src="/burgermenu.svg"></img>
        </button>
        <button className={styles.trends}>
          <img src="/planet.svg"></img>
        </button>
        <button
          className={styles.digitar}
          onClick={() => setRenderPost(!renderPost)}
        >
          <img src="/notepaddark.svg"></img>
        </button>
        <button className={styles.batepapo}>
          <img src="/speechdark.svg"></img>
        </button>
        <button
          className={styles.conta}
          onClick={() => setRenderLog(!renderLog)}
        >
          <img src="/userdark.svg"></img>
        </button>
      </div>
    </>
  );
}
