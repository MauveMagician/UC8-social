"use client";
import styles from "./menuInferior.module.css";
import { useState } from "react";
import Login from "./login";

export default function MenuInferior() {
  const [renderLog, setRenderLog] = useState(false);
  return (
    <>
      {renderLog ? <Login setRenderLog={setRenderLog} /> : <></>}
      <div className={styles.container}>
        <button className={styles.mais}>
          <img src="/burgermenu.svg"></img>
        </button>
        <button className={styles.trends}>
          <img src="/planet.svg"></img>
        </button>
        <button className={styles.digitar}>
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
