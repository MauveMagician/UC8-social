"use client";
import styles from "./conta.module.css";
import { useState, useEffect } from "react";
import "./globals.css";

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
  return (
    <>
      <div className={styles.container}>
        <div className={styles.cabecalho}>
          <div className={styles.I}>
            <div className={styles.postagens}>suas postagens 0</div>
            <div className={styles.info}>
              <div className={styles.foto}>
                {pfp ? (
                  <img src={pfp} className={styles.img} alt="Foto do perfil" />
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className={styles.perfil}>
                <div className={styles.nome}>Eminen</div>
                <div className={styles.email}>email</div>
              </div>
              <div className={styles.myfriends}>
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
            <div className={styles.bio}>
              Apaixonado por tecnologia e inovação. Transformando ideias em
              realidade. 💻🚀
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
