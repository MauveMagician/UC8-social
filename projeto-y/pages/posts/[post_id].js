import { DarkModeContextProvider } from "@/app/context/DarkModeContext";
import Postagens from "@/app/postagens";
import MenuSuperior from "@/app/menuSuperior";
import MenuInferior from "@/app/menuInferior";

export async function getServerSideProps(context) {
  const { post_id } = context.params;
  return {
    props: { post_id },
  };
}

export default function PaginaPostagem({ post_id }) {
  return (
    <>
      <DarkModeContextProvider>
        <MenuSuperior />
        <div style={{ paddingTop: "5rem" }}>
          <Postagens post_id={post_id} />
        </div>
        <MenuInferior />
      </DarkModeContextProvider>
    </>
  );
}
