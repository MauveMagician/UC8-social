import Image from "next/image";
import styles from "./page.module.css";
import MenuSuperior from "./menuSuperior";
import MenuInferior from "./menuInferior";
import Postagem from "./postagens";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import Conta from "./conta";
import Timeline from "./timeline";

export default function Home() {
  return (
    <>
      <DarkModeContextProvider>
        <MenuSuperior />
        <Timeline user_id={1} />
        <MenuInferior />
      </DarkModeContextProvider>
    </>
  );
}
