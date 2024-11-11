import { useEffect, useState } from "react";
import styles from "./infoUsuario.module.css";
import { useDarkMode } from "@/app/context/DarkModeContext";
import UppBio from "./uppdateBio";

export default function InfoUsuario({ setRenderUser }) {
  const { dark, setDark } = useDarkMode();
  const [pfp, setPfp] = useState("");
  const [nome, setNome] = useState("");
  const [arroba, setArroba] = useState("");
  const [bio, setBio] = useState("");
  useEffect(() => {
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
    const fetchUserinfo = async () => {
      try {
        const response = await fetch(`/api/data/userinfo`);
        if (!response.ok) {
          throw new Error("Failed to fetch userinfo");
        }
        const data = await response.json();
        setNome(data.nome);
        setArroba(data.arroba);
        setBio(data.bio);
      } catch (error) {
        console.error("Error fetching userinfo:", error);
      }
    };
    fetchPhoto();
    fetchUserinfo();
  }, []);
  const [uppBio, setUppBio] = useState(false);
  const handleClick = () => {
    setUppBio(!uppBio);
  };
  return (
    <>
      {uppBio && <UppBio setBioParent={setBio} setVisible={setUppBio} />}
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <div className={styles.containerFoto}>
          <img src="\gato-32546835.jpg"></img>
          <div className={styles.name}>
            {nome} <img src="pencopy.svg" alt="editar Bio" />
          </div>
          <div className={styles.close} onClick={() => setRenderUser(false)}>
            <img
              className={styles.img}
              src={dark ? "/closebutton-dark.svg" : "/closebutton.svg"}
            ></img>
          </div>
          <button className={styles.mudafoto}>
            <img
              className={styles.img1}
              src="\camera-white.svg"
              alt="sombra de mudar foto"
            />
            <img src="\camera-svgrepo-com.svg" alt="mudar foto" />
          </button>
          <button className={styles.configuracoes}>
            <img
              className={styles.img2}
              src="\cogyellow.svg"
              alt="sombra de configurações"
            />
            <img src="\cog.svg" alt="Configurações" />
          </button>
        </div>
        <div className={styles.containerInfo}>
          <h3 className={styles.h3}>Conta de Usuário</h3>
          <div className={styles.information}>
            <div className={styles.info}>@{arroba}</div>
            <div className={styles.bio}>
              <p className={styles.tap}>User</p>
              <img src="pen.svg" alt="editar User" />
            </div>
          </div>
          <hr className={styles.hr} />
          <div className={styles.information}>
            <div className={styles.info}>{bio}</div>
            <div className={styles.bio} onClick={handleClick}>
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
          <div className={styles.settings}>
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
