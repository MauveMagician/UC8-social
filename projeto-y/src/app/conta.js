"use client";
import styles from "./conta.module.css";
import { useState, useEffect, useMemo } from "react";
import "./globals.css";
import PostsUsuario from "./postsUsuario";
import MidiasUsuario from "./midiasUsuario";
import MencoesUsuario from "./mencoesUsuario";
import { useDarkMode } from "./context/DarkModeContext";
import Link from "next/link";
import Image from "next/image";

export default function Conta({ user_id }) {
  const [pfp, setPfp] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [seguindo, setSeguindo] = useState(false);
  const { dark } = useDarkMode();
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [nome, setNome] = useState("");
  const [arroba, setArroba] = useState("");
  const [bio, setBio] = useState("");
  const [Color, setColor] = useState([true, false, false]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const [
          photoResponse,
          userDataResponse,
          followersResponse,
          followingResponse,
          loggedInUserResponse,
        ] = await Promise.all([
          fetch(`/api/data/pfp?user_id=${user_id}`),
          fetch(`/api/data/userinfo?user_id=${user_id}`),
          fetch(`/api/data/num_followers?user_id=${user_id}`),
          fetch(`/api/data/num_following?user_id=${user_id}`),
          fetch("/api/user/current"),
        ]);

        if (
          !photoResponse.ok ||
          !userDataResponse.ok ||
          !followersResponse.ok ||
          !followingResponse.ok ||
          !loggedInUserResponse.ok
        ) {
          throw new Error("Failed to fetch user data");
        }

        const blob = await photoResponse.blob();
        const imageUrl = URL.createObjectURL(blob);
        const userData = await userDataResponse.json();
        const followerCount = await followersResponse.json();
        const followingCount = await followingResponse.json();
        const loggedInUserData = await loggedInUserResponse.json();

        setPfp(imageUrl);
        setNome(userData.nome);
        setArroba(userData.arroba);
        setBio(userData.bio);
        setPostCount(userData.num_posts);
        setFollowersCount(followerCount.num_followers);
        setFollowingCount(followingCount.num_following);
        setLoggedInUserId(loggedInUserData.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user_id) {
      fetchUserInfo();
    }
  }, [user_id]);

  const handleSeguir = async (event) => {
    event.preventDefault();
    try {
      // Primeira requisição para seguir/deixar de seguir
      const response = await fetch(`/api/data/seguir?followed_id=${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante para enviar cookies de autenticação
      });

      if (!response.ok) {
        throw new Error("Failed to follow/unfollow");
      }

      // Segunda requisição para obter o status atualizado
      const followStatusResponse = await fetch(
        `/api/data/follow-status?user_id=${user_id}`,
        {
          credentials: "include",
        }
      );

      if (!followStatusResponse.ok) {
        throw new Error("Failed to get updated follow status");
      }

      const followStatus = await followStatusResponse.json();

      // Atualiza o estado com o novo status
      setSeguindo(followStatus.isFollowing);

      // Atualiza o número de seguidores
      setFollowersCount((prevCount) =>
        followStatus.isFollowing ? prevCount + 1 : prevCount - 1
      );

      console.log(
        followStatus.isFollowing
          ? "Followed successfully"
          : "Unfollowed successfully"
      );
    } catch (error) {
      console.error("Error:", error);
      // Aqui você pode adicionar uma notificação para o usuário sobre o erro
    }
  };

  const handleClick = (index) => {
    const newColor = [false, false, false];
    newColor[index] = true;
    setColor(newColor);
    console.log("mudou a cor do botão");
  };
  const memoizedPosts = useMemo(
    () => <PostsUsuario user_id={user_id} />,
    [user_id]
  );
  const memoizedMidias = useMemo(
    () => <MidiasUsuario user_id={user_id} />,
    [user_id]
  );
  const memoizedMencoes = useMemo(
    () => <MencoesUsuario user_id={user_id} />,
    [user_id]
  );

  return (
    <>
      <div className={`${styles.planet} ${dark ? styles.containerescuro : ""}`}>
        <div
          className={`${styles.cabecalho} ${
            dark ? styles.cabecalhoescuro : ""
          }`}
        >
          <div className={`${styles.back} ${dark ? styles.backescuro : ""}`}>
            <Link href="/">
              <img
                className={styles.cabecalhoimg}
                src={dark ? "/backlight.svg" : "/backdark.svg"}
                alt="Voltar para a página inicial"
              />
            </Link>
          </div>
          <div className={styles.nickname}>{arroba}</div>
          <div className={styles.config}>
            <Image
              className={styles.cabecalhoimg}
              src={
                dark ? "/burgermenu-light.svg" : "/burger-menu-svgrepo-com.svg"
              }
              width={24} // Ajuste este valor para a largura real da sua imagem
              height={24} // Ajuste este valor para a altura real da sua imagem
              alt="Menu"
            />
          </div>
        </div>
        <div
          className={`${styles.container} ${dark ? styles.containerdark : ""}`}
        >
          <div className={`${styles.I} ${dark ? styles.Idark : ""}`}>
            <div className={`${styles.info} ${dark ? styles.infodark : ""}`}>
              <div className={styles.foto}>
                {pfp ? (
                  <img src={pfp} className={styles.img} alt="Foto do perfil" />
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              <div
                className={`${styles.myfriends} ${
                  dark ? styles.myfriendsdark : ""
                }`}
              >
                <div
                  className={`${styles.numeros} ${
                    dark ? styles.numberdark : ""
                  }`}
                >
                  <div className={styles.numero}> {postCount}</div>
                  <div className={styles.palavras}>Postagens</div>
                </div>
                <div
                  className={`${styles.numeros} ${
                    dark ? styles.numberdark : ""
                  }`}
                >
                  <div className={styles.numero}>{followingCount}</div>
                  <div className={styles.palavras}>seguindo</div>
                </div>
                <div
                  className={`${styles.numeros} ${
                    dark ? styles.numberdark : ""
                  }`}
                >
                  <div className={styles.numero}>{followersCount}</div>
                  <div className={styles.palavras}>seguidores</div>
                </div>
              </div>
            </div>
            <div className={`${styles.perfil} ${dark ? styles.prophile : ""}`}>
              <div className={styles.nome}>{nome}</div>
              <div className={styles.email}>{arroba}</div>
            </div>
            <div className={styles.bio}>{bio}</div>
          </div>
        </div>

        <div className={styles.container2}>
          <div className={styles.container2}>
            <div className={styles.follows}>
              {loggedInUserId !== user_id && (
                <>
                  <button className={styles.seguir} onClick={handleSeguir}>
                    <p
                      className={styles.p}
                      style={{ color: dark ? "white" : "black" }}
                    >
                      {seguindo ? "Deixar de seguir" : "Seguir"}
                    </p>
                  </button>
                  <button className={styles.seguir}>
                    <p
                      className={styles.p}
                      style={{ color: dark ? "white" : "black" }}
                    >
                      Conversar
                    </p>
                  </button>
                </>
              )}
            </div>
            {/* ... resto do código ... */}
          </div>
          <div className={`${styles.conteudos} ${dark ? styles.contents : ""}`}>
            <button
              style={{ color: dark ? "white" : "black" }}
              className={Color[0] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(0)}
              type="button"
            >
              Quacks
            </button>
            <button
              style={{ color: dark ? "white" : "black" }}
              className={Color[1] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(1)}
              type="button"
            >
              Mídias
            </button>
            <button
              style={{ color: dark ? "white" : "black" }}
              className={Color[2] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(2)}
              type="button"
            >
              Menções
            </button>
          </div>
        </div>

        {Color[0] && memoizedPosts}
        {Color[1] && memoizedMidias}
        {Color[2] && memoizedMencoes}
      </div>
    </>
  );
}
