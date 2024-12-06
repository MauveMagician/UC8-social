"use client";
import styles from "./menuInferior.module.css";
import { useEffect, useState } from "react";
import Login from "./login";
import FormularioPost from "@/app/formularioPost";
import { useDarkMode } from "./context/DarkModeContext";
import InfoUsuario from "@/app/infoUsuario";
import { useRouter } from "next/navigation";
import ChatComponent from "./chatComponent";

export default function MenuInferior() {
  const { dark, setDark } = useDarkMode();
  const [renderLog, setRenderLog] = useState(false);
  const [renderUser, setRenderUser] = useState(false);
  const [renderPost, setRenderPost] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [postsData, setPostsData] = useState(null);
  const [currentHashtag, setCurrentHashtag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHashtagInput, setShowHashtagInput] = useState(false);
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUsuarioLogado(true);
          } else {
            setUsuarioLogado(false);
          }
        } else {
          setUsuarioLogado(false);
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        setUsuarioLogado(false);
      }
    };

    checkUserSession();
  }, []);

  const handleHashtagSearch = async () => {
    setIsLoading(true);
    setError(null);

    if (currentHashtag) {
      router.push(`/hashtags/${currentHashtag}`);
    } else {
      router.push("/");
    }
    setShowHashtagInput(false);

    try {
      const url = currentHashtag
        ? `/api/data/posts_screen?page=${currentPage}&hashtag=${currentHashtag}`
        : `/api/data/posts_screen?page=${currentPage}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPostsData(data.posts);
        console.log("Posts data:", data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch posts data");
      }
    } catch (error) {
      console.error("Error fetching posts data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChat = () => {
    setShowChat((prevState) => !prevState);
  };

  return (
    <>
      {renderLog ? <Login setRenderLog={setRenderLog} /> : <></>}
      {renderPost ? <FormularioPost /> : <></>}
      {renderUser ? <InfoUsuario setRenderUser={setRenderUser} /> : <></>}
      {showChat && <ChatComponent onClose={() => setShowChat(false)} />}
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <button className={styles.mais}>
          <img src={dark ? "/burgermenu-light.svg" : "/burgermenu.svg"}></img>
        </button>
        <button
          className={styles.trends}
          onClick={() => setShowHashtagInput(!showHashtagInput)}
        >
          <img src={dark ? "/trend copy.svg" : "/trend.svg"}></img>
        </button>
        {showHashtagInput && (
          <div className={styles.hashtaginputcontainer}>
            <input
              type="text"
              value={currentHashtag}
              onChange={(e) => setCurrentHashtag(e.target.value)}
              placeholder="Insira uma hashtag"
              className={styles.hashtaginput}
            />
            <button
              onClick={handleHashtagSearch}
              className={styles.searchbutton}
            >
              Buscar
            </button>
          </div>
        )}
        <button
          className={styles.digitar}
          onClick={() => setRenderPost(!renderPost)}
        >
          <img src={dark ? "/penadepato.svg" : "/penadepato copy.svg"}></img>
        </button>
        <button className={styles.batepapo} onClick={handleToggleChat}>
          <img src={dark ? "/message.svg" : "/message copy.svg"}></img>
        </button>
        <button
          className={styles.conta}
          onClick={() => {
            usuarioLogado
              ? setRenderUser(!renderUser)
              : setRenderLog(!renderLog);
          }}
        >
          <img src={dark ? "/userlight.svg" : "/userdark.svg"}></img>
        </button>
      </div>
    </>
  );
}
