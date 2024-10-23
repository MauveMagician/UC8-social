"use client";
import styles from "./conta.module.css";
import { useState, useEffect } from "react";
import "./globals.css";
import PostsUsuario from "./postsUsuario";
import MidiasUsuario from "./midiasUsuario";
import MencoesUsuario from "./mencoesUsuario";

export default function Conta({ user_id }) {
  const [pfp, setPfp] = useState(null);
  useEffect(() => {
    console.log("useEffect triggered with user_id:", user_id);
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`/api/data/pfp?user_id=${user_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch photo");
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setPfp(imageUrl);
      } catch (error) {
        console.error("Error fetching photo:", error);
      }
    };
    if (user_id) {
      fetchPhoto();
    }
  }, []);
  //função do botão mudar a aparência quando clicado
  const [Color, setColor] = useState([true, false, false]);
  const handleClick = (index) => {
    const newColor = [false, false, false];
    newColor[index] = true;
    setColor(newColor);
    console.log("mudou a cor do botão");
  };
  return (
    <>
      <div className={styles.planet}>
        <div className={styles.container}>
          <div className={styles.I}>
            <div className={styles.info}>
              <div className={styles.foto}>
                {pfp ? (
                  <img src={pfp} className={styles.img} alt="Foto do perfil" />
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              <div className={styles.myfriends}>
                <div className={styles.numeros}>
                  <div className={styles.numero}>12</div>
                  <div className={styles.palavras}>seguidores</div>
                </div>
                <div className={styles.numeros}>
                  <div className={styles.numero}>12</div>
                  <div className={styles.palavras}>seguindo</div>
                </div>
                <div className={styles.numeros}>
                  <div className={styles.numero}>12</div>
                  <div className={styles.palavras}>seguidores</div>
                </div>
              </div>
            </div>
            <div className={styles.perfil}>
              <div className={styles.nome}>Eminen</div>
              <div className={styles.email}>email</div>
            </div>
            <div className={styles.bio}>
              Apaixonado por tecnologia e inovação. Transformando ideias em
              realidade. 💻🚀
            </div>
          </div>
        </div>

        <div className={styles.container2}>
          <div className={styles.follows}>
            <button className={styles.seguir}>
              <p className={styles.p}>Seguir</p>
            </button>
            <button className={styles.seguir}>
              <p className={styles.p}>Conversar</p>
            </button>
          </div>
          <div className={styles.conteudos}>
            <button
              className={Color[0] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(0)}
            >
              Quacks
            </button>
            <button
              className={Color[1] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(1)}
            >
              Mídias
            </button>
            <button
              className={Color[2] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(2)}
            >
              Menções
            </button>
          </div>
        </div>

        {Color[0] ? <PostsUsuario user_id={user_id} /> : <></>}
        {Color[1] ? <MidiasUsuario user_id={user_id} /> : <></>}
        {Color[2] ? <MencoesUsuario user_id={user_id} /> : <></>}
      </div>
    </>
  );
}
