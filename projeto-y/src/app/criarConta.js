import { useState } from "react";
import styles from "./criarConta.module.css";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function CriarConta({ setAccount }) {
  const { dark } = useDarkMode();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha, nome }),
      });
      const data = await response.json();
      if (response.ok) {
        setAccount(data.user);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <div className={styles.pato}>
          <img src={dark ? "/pato-dark.svg" : "/pato.svg"}></img>
        </div>
        <div className={styles.close}>
          <button className={styles.fechar} onClick={() => setAccount(false)}>
            <img
              src={dark ? "/closebutton-dark.svg" : "/closebutton.svg"}
            ></img>
          </button>
        </div>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={styles.input1}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input1}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.input1}
          />
          <button
            type="submit"
            className={`${dark ? styles.dark2 : styles.cadastrar}`}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </>
  );
}
