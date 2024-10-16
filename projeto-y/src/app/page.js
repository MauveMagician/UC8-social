import Image from "next/image";
import styles from "./page.module.css";
import MenuSuperior from "./menuSuperior";
import MenuInferior from "./menuInferior";
import Postagem from "./postagens";
import Conta from "./conta";

export default function Home() {
  return (
    <>
      <MenuSuperior />
      <Postagem />
      <Postagem />
      <Postagem />
      <Postagem />
      <MenuInferior />
    </>
  );
}
