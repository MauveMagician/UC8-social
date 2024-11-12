"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./uppdateUser.module.css";

export default function UppUser({ setUserParent, setVisible }) {
  const [user, setUser] = useState("");
  const [isClicked, setIsClicked] = useState([false, false]); // Estado para controlar o clique
  const textareaRef = useRef(null);

  const getUser = async () => {
    try {
      const response = await fetch("/api/data/userinfo");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Fetch bio error", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/data/uppdateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });
      const data = await response.json();
      setUserParent(data.user);

      setTimeout(() => {
        setVisible(false);
      }, 500);
    } catch (error) {
      console.error("Uppdate error to bio", error);
    }
  };

  const handleChange = (e) => {
    setUser(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  // Função para gerenciar o clique no botão
  const handleButtonClick = (buttonType) => {
    buttonType ? setIsClicked([true, false]) : setIsClicked([false, true]); // Altera o estado do clique
    setTimeout(() => {
      if (buttonType) {
        fetchUser(); // Executa a função fetchBio para salvar
      }
      setVisible(); // Fecha o componente
    }, 200);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.p}>Altere seu Nome!</p>
      <textarea
        ref={textareaRef}
        onChange={handleChange}
        className={styles.input}
        value={user}
        maxLength="25"
        rows={1}
        placeholder="Digite sua Nome..."
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
