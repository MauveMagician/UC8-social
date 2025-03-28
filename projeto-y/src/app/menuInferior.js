"use client";
import styles from "./menuInferior.module.css";
import { useEffect, useState, useRef } from "react";
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
  const hashtagInputRef = useRef(null);
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);

  const fetchHashtagSuggestions = async (query = "") => {
    console.log("Fetching suggestions for query:", query);
    try {
      const response = await fetch(`/api/hashtags/suggestions?query=${query}`);
      console.log("Response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched suggestions data:", data);
        setHashtagSuggestions(data.suggestions || []);
      } else {
        console.error("Failed to fetch suggestions:", response.statusText);
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Error fetching hashtag suggestions:", error);
    }
  };

  useEffect(() => {
    if (showHashtagInput) {
      console.log("Fetching initial suggestions");
      fetchHashtagSuggestions();
      if (hashtagInputRef.current) {
        hashtagInputRef.current.focus();
      }
    } else {
      setHashtagSuggestions([]);
    }
  }, [showHashtagInput]);

  useEffect(() => {
    if (currentHashtag.length > 0) {
      fetchHashtagSuggestions(currentHashtag);
    } else {
      fetchHashtagSuggestions();
    }
  }, [currentHashtag]);

  const handleHashtagChange = (e) => {
    const newHashtag = e.target.value;
    setCurrentHashtag(newHashtag);
  };

  const handleSuggestionClick = (suggestion) => {
    setCurrentHashtag(suggestion);
    setShowHashtagInput(false);
  };

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
      {renderLog && <Login setRenderLog={setRenderLog} />}
      {renderPost && <FormularioPost />}
      {renderUser && <InfoUsuario setRenderUser={setRenderUser} />}
      {showChat && <ChatComponent onClose={() => setShowChat(false)} />}
      <div className={`${styles.container} ${dark ? styles.dark : ""}`}>
        <button className={styles.mais}>
          <img
            src={dark ? "/burgermenu-light.svg" : "/burgermenu.svg"}
            alt="Menu"
          />
        </button>
        <button
          className={styles.trends}
          onClick={() => setShowHashtagInput(!showHashtagInput)}
        >
          <img src={dark ? "/trend copy.svg" : "/trend.svg"} alt="Trends" />
        </button>
        {showHashtagInput && (
          <div className={styles.hashtaginputcontainer}>
            <div className={styles.inputWrapper}>
              <input
                ref={hashtagInputRef}
                type="text"
                value={currentHashtag}
                onChange={handleHashtagChange}
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
            {hashtagSuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {hashtagSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={styles.suggestionItem}
                  >
                    #{suggestion}
                  </li>
                ))}
              </ul>
            )}
            <div style={{ color: "red" }}>
              Debug: {hashtagSuggestions.length} suggestions
            </div>
          </div>
        )}
        <button
          className={styles.digitar}
          onClick={() => setRenderPost(!renderPost)}
        >
          <img
            src={dark ? "/penadepato.svg" : "/penadepato copy.svg"}
            alt="Post"
          />
        </button>
        <button className={styles.batepapo} onClick={handleToggleChat}>
          <img src={dark ? "/message.svg" : "/message copy.svg"} alt="Chat" />
        </button>
        <button
          className={styles.conta}
          onClick={() => {
            usuarioLogado
              ? setRenderUser(!renderUser)
              : setRenderLog(!renderLog);
          }}
        >
          <img src={dark ? "/userlight.svg" : "/userdark.svg"} alt="User" />
        </button>
      </div>
    </>
  );
}
