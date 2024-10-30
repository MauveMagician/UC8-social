"use client";
import styles from "./conta.module.css";
import { useState, useEffect } from "react";
import "./globals.css";
import PostsUsuario from "./postsUsuario";
import MidiasUsuario from "./midiasUsuario";
import MencoesUsuario from "./mencoesUsuario";

export default function Conta({ user_id }) {
  const [pfp, setPfp] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [seguindo, setSeguindo] = useState(false);
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

    const fetchData = async () => {
      try {
        const postCountResponse = await fetch(
          `/api/data/num_posts?user_id=${user_id}`
        );
        if (!postCountResponse.ok) {
          throw new Error("Failed to fetch post count");
        }
        const postCount = await postCountResponse.json();
        console.log("Post count:", postCount);
        setPostCount(postCount.num_posts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchFollowers = async () => {
      try {
        const response = await fetch(
          `/api/data/num_followers?user_id=${user_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch follower count");
        }
        const followerCount = await response.json();
        console.log("Follower count:", followerCount);
        setFollowersCount(followerCount.num_followers);
      } catch (error) {
        console.error("Error fetching follower count:", error);
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await fetch(
          `/api/data/num_following?user_id=${user_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch following count");
        }
        const followingCount = await response.json();
        console.log("Following count:", followingCount);
        setFollowingCount(followingCount.num_following);
      } catch (error) {
        console.error("Error fetching following count:", error);
      }
    };
    if (user_id) {
      fetchPhoto();
      fetchFollowing();
      fetchFollowers();
      fetchData();
    }
  }, []);
  const handleSeguir = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/data/seguir?followed_id=${user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        console.log("Followed or unfollowed successfully");
        setSeguindo(!seguindo);
      } else {
        console.error("Failed to follow or unfollow");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //função do botão mudar a aparência quando clicado
  const [Color, setColor] = useState([true, false, false]);
  const handleClick = (index) => {
    const newColor = [false, false, false];
    newColor[index] = true;
    setColor(newColor);
    console.log("mudou a cor do botão");
  };
  return (
    <>
      <div className={styles.planet}>
        <div className={styles.cabecalho}>
          <div className={styles.back}>
            <img
              className={styles.cabecalhoimg}
              src="/back-svgrepo-com.svg"
            ></img>
          </div>
          <div className={styles.nickname}>Eminen_da_vó</div>
          <div className={styles.config}>
            <img
              className={styles.cabecalhoimg}
              src="/burger-menu-svgrepo-com.svg"
            ></img>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.I}>
            <div className={styles.info}>
              <div className={styles.foto}>
                {pfp ? (
                  <img src={pfp} className={styles.img} alt="Foto do perfil" />
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              <div className={styles.myfriends}>
                <div className={styles.numeros}>
                  <div className={styles.numero}> {postCount}</div>
                  <div className={styles.palavras}>Postagens</div>
                </div>
                <div className={styles.numeros}>
                  <div className={styles.numero}>{followingCount}</div>
                  <div className={styles.palavras}>seguindo</div>
                </div>
                <div className={styles.numeros}>
                  <div className={styles.numero}>{followersCount}</div>
                  <div className={styles.palavras}>seguidores</div>
                </div>
              </div>
            </div>
            <div className={styles.perfil}>
              <div className={styles.nome}>Eminen</div>
              <div className={styles.email}>email</div>
            </div>
            <div className={styles.bio}>
              Apaixonado por tecnologia e inovação. Transformando ideias em
              realidade. 💻🚀
            </div>
          </div>
        </div>

        <div className={styles.container2}>
          <div className={styles.follows}>
            <button className={styles.seguir} onClick={handleSeguir}>
              <p className={styles.p}>
                {seguindo ? "Deixar de seguir" : "Seguir"}
              </p>
            </button>
            <button className={styles.seguir}>
              <p className={styles.p}>Conversar</p>
            </button>
          </div>
          <div className={styles.conteudos}>
            <button
              className={Color[0] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(0)}
            >
              Quacks
            </button>
            <button
              className={Color[1] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(1)}
            >
              Mídias
            </button>
            <button
              className={Color[2] ? styles.nodestaque : styles.ydestaque}
              onClick={() => handleClick(2)}
            >
              Menções
            </button>
          </div>
        </div>

        {Color[0] ? <PostsUsuario user_id={user_id} /> : <></>}
        {Color[1] ? <MidiasUsuario user_id={user_id} /> : <></>}
        {Color[2] ? <MencoesUsuario user_id={user_id} /> : <></>}
      </div>
    </>
  );
}
