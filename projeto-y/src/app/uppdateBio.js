"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./uppdateBio.module.css";

export default function UppBio({ setBioParent, setVisible }) {
  const [bio, setBio] = useState("");
  const [isClicked, setIsClicked] = useState([false, false]); // Estado para controlar o clique
  const textareaRef = useRef(null);

  const getBio = async () => {
    try {
      const response = await fetch("/api/data/userinfo");
      const data = await response.json();
      setBio(data.bio);
    } catch (error) {
      console.error("Fetch bio error", error);
    }
  };

  const fetchBio = async () => {
    try {
      const response = await fetch("/api/data/uppdateBio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });
      const data = await response.json();
      setBioParent(data.bio);

      setTimeout(() => {
        setVisible(false);
      }, 500);
    } catch (error) {
      console.error("Uppdate error to bio", error);
    }
  };

  const handleChange = (e) => {
    setBio(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  // Função para gerenciar o clique no botão
  const handleButtonClick = (buttonType) => {
    buttonType ? setIsClicked([true, false]) : setIsClicked([false, true]); // Altera o estado do clique
    setTimeout(() => {
      if (buttonType) {
        fetchBio(); // Executa a função fetchBio para salvar
      }
      setVisible(); // Fecha o componente
    }, 200);
  };

  useEffect(() => {
    getBio();
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.p}>Altere sua Bio!</p>
      <textarea
        ref={textareaRef}
        onChange={handleChange}
        className={styles.input}
        value={bio}
        maxLength="255"
        rows={1}
        placeholder="Digite sua bio..."
      />

      <div className={styles.buttons}>
        <button
          onClick={() => handleButtonClick(1)}
          className={`${styles.save} ${isClicked[0] ? styles.saveClicked : ""}`}
        >
          Salvar
        </button>
        <button
          onClick={() => handleButtonClick(0)}
          className={`${styles.cancel} ${
            isClicked[1] ? styles.cancelClicked : ""
          }`}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
