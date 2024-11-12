"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./uppdateUser.module.css";

export default function UppUser({ setUserParent, setVisible }) {
  const [user, setUser] = useState("");
  const [isClicked, setIsClicked] = useState([false, false]);
  // Adicionado novo estado para controlar a validade do nome
  const [isValid, setIsValid] = useState(false);
  const textareaRef = useRef(null);

  const getUser = async () => {
    try {
      const response = await fetch("/api/data/userinfo");
      const data = await response.json();
      setUser(data.user);
      // Adicionada verificação inicial de validade
      setIsValid(data.user.trim() !== "");
    } catch (error) {
      console.error("Fetch user error", error);
    }
  };

  const fetchUser = async () => {
    // Adicionada verificação de validade antes de enviar
    if (!isValid) return;
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
      console.error("Update error to user", error);
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setUser(inputValue);
    // Adicionada validação em tempo real
    setIsValid(inputValue.trim() !== "");

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  // Função para gerenciar o clique no botão
  const handleButtonClick = (buttonType) => {
    // Adicionada verificação de validade antes de permitir salvar
    if (buttonType && !isValid) return;
    buttonType ? setIsClicked([true, false]) : setIsClicked([false, true]);
    setTimeout(() => {
      if (buttonType) {
        fetchUser();
      }
      setVisible(false);
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
        placeholder="Digite seu Nome..."
        required
      />
      {/* Adicionada mensagem de erro para nome inválido */}
      {!isValid && <p className={styles.p1}>O nome não pode estar vazio.</p>}

      <div className={styles.buttons}>
        <button
          onClick={() => handleButtonClick(1)}
          className={`${styles.save} ${isClicked[0] ? styles.saveClicked : ""}`}
          // Adicionada desabilitação do botão quando inválido
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
