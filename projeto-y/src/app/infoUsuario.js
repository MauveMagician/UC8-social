"use client";
import { useEffect, useState } from "react";
import styles from "./infoUsuario.module.css";
import { useDarkMode } from "@/app/context/DarkModeContext";
import UppBio from "./uppdateBio";
import UppArroba from "./uppdateArroba";
import UppUser from "./uppdateUser";

export default function InfoUsuario({ setRenderUser }) {
  const { dark } = useDarkMode();
  const [pfp, setPfp] = useState("");
  const [nome, setNome] = useState("");
  const [arroba, setArroba] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uppBio, setUppBio] = useState(false);
  const [uppArroba, setUppArroba] = useState(false);
  const [uppUser, setUppUser] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userInfoResponse = await fetch(`/api/data/userinfo`);
        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch userinfo");
        }
        const userData = await userInfoResponse.json();
        setNome(userData.nome);
        setArroba(userData.arroba);
        setBio(userData.bio);

        const savedPfp = localStorage.getItem("userProfilePicture");
        if (savedPfp) {
          setPfp(savedPfp);
        } else {
          const photoResponse = await fetch(
            `/api/data/pfp?user_id=${userData.id}`
          );
          if (!photoResponse.ok) {
            throw new Error("Failed to fetch photo");
          }
          const blob = await photoResponse.blob();
          const imageUrl = URL.createObjectURL(blob);
          setPfp(imageUrl);
          localStorage.setItem("userProfilePicture", imageUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setIsClosing(false);
  }, []);

  const toggleState = (setter) => () => setter((prev) => !prev);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setRenderUser(false);
      setIsClosing(false);
    }, 500);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        localStorage.removeItem("user");
        window.location.href = "/";
      } else {
        throw new Error("Falha ao fazer logout");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("/api/upload-pfp", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar a foto");
      }

      const data = await response.json();
      setPfp(data.photoPath);
      localStorage.setItem("userProfilePicture", data.photoPath);
    } catch (error) {
      console.error("Erro ao enviar a foto:", error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  return (
    <>
      {uppBio && <UppBio setBioParent={setBio} setVisible={setUppBio} />}
      {uppArroba && (
        <UppArroba setArrobaParent={setArroba} setVisible={setUppArroba} />
      )}
      {uppUser && <UppUser setUserParent={setNome} setVisible={setUppUser} />}
      <div
        className={`${styles.container} ${dark ? styles.dark : ""} ${
          styles.visible
        } ${isClosing ? styles.closing : ""}`}
      >
        <div className={styles.containerFoto}>
          <img src={pfp || "/default-profile.jpg"} alt="Profile" />
          <div className={styles.name} onClick={toggleState(setUppUser)}>
            {nome} <img src="pencopy.svg" alt="editar nome" />
          </div>
          <div className={styles.close} onClick={handleClose}>
            <img className={styles.img4} src="/downyellow.svg" />
            <img
              className={styles.img}
              src={dark ? "/downwhite.svg" : "/down.svg"}
            />
          </div>
          <label htmlFor="photoUpload" className={styles.mudafoto}>
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <img
              className={styles.img1}
              src="\camera-white.svg"
              alt="sombra de mudar foto"
            />
            <img src="\camera-svgrepo-com.svg" alt="mudar foto" />
          </label>
        </div>
        <div className={styles.containerInfo}>
          <h3 className={styles.h3}>Conta de Usuário</h3>
          <div className={styles.information}>
            <div className={styles.info}>@{arroba}</div>
            <div className={styles.bio} onClick={toggleState(setUppArroba)}>
              <p className={styles.tap}>User</p>
              <img src="pen.svg" alt="editar User" />
            </div>
          </div>
          <hr className={styles.hr} />
          <div className={styles.information}>
            <div className={styles.info}>{bio}</div>
            <div className={styles.bio} onClick={toggleState(setUppBio)}>
              <p className={styles.tap}>Bio</p>
              <img src="pen.svg" alt="editar Bio" />
            </div>
          </div>
        </div>
        <div className={styles.containerSettings}>
          <h3 className={styles.h3}>Configurações</h3>
          <div className={styles.settings}>
            <div className={styles.imgSettings}>
              <img
                className={styles.img3}
                src="\chat.svg"
                alt="Configuração de chat"
              />
            </div>
            <div className={styles.info}>Configurações de bate-papo</div>
          </div>
          <hr className={styles.hr} />
          <div className={styles.settings}>
            <div className={styles.imgSettings}>
              <img
                className={styles.img3}
                src="\lock.svg"
                alt="Configurações de privacidade e segurança"
              />
            </div>

            <div className={styles.info}>Privacidade e Segurança</div>
          </div>
          <hr className={styles.hr} />
          <div className={styles.settings}>
            <div className={styles.imgSettings}>
              <img
                className={styles.img3}
                src="\bell.svg"
                alt="Configurações de notificações e sons"
              />
            </div>
            <div className={styles.info}>Notificações e sons</div>
          </div>
          <hr className={styles.hr} />
          <div className={styles.settings} onClick={handleLogout}>
            <div className={styles.imgSettings}>
              <img className={styles.img3} src="\Door.svg" alt="Sair" />
            </div>
            <div className={styles.info}>Sair</div>
          </div>
        </div>
      </div>
    </>
  );
}
