import styles from "./infoUsuario.module.css";
import { useDarkMode } from "@/app/context/DarkModeContext";

export default function InfoUsuario({ setRenderUser }) {
  const { dark, setDark } = useDarkMode();
  return (
    <>
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <div className={styles.containerFoto}>
          <img src="\gato-32546835.jpg"></img>
          <div className={styles.name}>eminen</div>
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
            <div className={styles.info}>+01 (23) 45678-9012</div>
            <p className={styles.tap}>Tap to change phone number</p>
          </div>
          <hr className={styles.hr} />
          <div className={styles.information}>
            <div className={styles.info}>Email: 123@email.com</div>
            <p className={styles.tap}>Username</p>
          </div>
          <hr className={styles.hr} />
          <div className={styles.information}>
            <div className={styles.info}>
              Entusiasta de tecnologia, explorador de novas ideias e apaixonado
              por aprender.
            </div>
            <p className={styles.tap}>Bio</p>
          </div>
        </div>
      </div>
    </>
  );
}
