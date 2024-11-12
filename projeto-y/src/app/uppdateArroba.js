"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./uppdateArroba.module.css";

export default function UppArroba({ setArrobaParent, setVisible }) {
  const [arroba, setArroba] = useState("");
  const [isClicked, setIsClicked] = useState([false, false]);
  const [isValid, setIsValid] = useState(false);
  const textareaRef = useRef(null);

  const getArroba = async () => {
    try {
      const response = await fetch("/api/data/userinfo");
      const data = await response.json();
      setArroba(data.arroba);
      setIsValid(data.arroba.trim() !== "");
    } catch (error) {
      console.error("Fetch bio error", error);
    }
  };

  const fetchArroba = async () => {
    if (!isValid) return;
    try {
      const response = await fetch("/api/data/uppdateArroba", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ arroba }),
      });
      const data = await response.json();
      setArrobaParent(data.arroba);

      setTimeout(() => {
        setVisible(false);
      }, 500);
    } catch (error) {
      console.error("Uppdate error to Arroba", error);
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    // Filtra os caracteres, permitindo apenas letras, números e underscore
    const filteredValue = inputValue.replace(/[^a-zA-Z0-9_]/g, "");
    setArroba(filteredValue);
    setIsValid(filteredValue.trim() !== "");
  };

  // Função para gerenciar o clique no botão
  const handleButtonClick = (buttonType) => {
    if (buttonType && !isValid) return;
    buttonType ? setIsClicked([true, false]) : setIsClicked([false, true]); // Altera o estado do clique
    setTimeout(() => {
      if (buttonType) {
        fetchArroba(); // Executa a função fetchBio para salvar
      }
      setVisible(false); // Fecha o componente
    }, 200);
  };

  useEffect(() => {
    getArroba();
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.p}>Altere seu Arroba!</p>
      <p className={styles.p1}>
        Não é permitido o uso de caracteres especiais. Utilize apenas letras,
        números e _.
      </p>
      <textarea
        ref={textareaRef}
        onChange={handleChange}
        className={styles.input}
        value={arroba}
        maxLength="25"
        rows={1}
        placeholder="Digite Seu novo Arroba..."
        required
      />
      {!isValid && <p className={styles.p1}>O arroba não pode estar vazio.</p>}

      <div className={styles.buttons}>
        <button
          onClick={() => handleButtonClick(1)}
          className={`${styles.save} ${isClicked[0] ? styles.saveClicked : ""}`}
          disabled={!isValid}
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
