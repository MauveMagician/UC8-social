import { useState } from "react";
import styles from "./formularioPost.module.css";

export default function FormularioPost() {
  const [postContent, setPostContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/data/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: postContent,
        }),
      });

      if (response.ok) {
        console.log("Post submitted successfully");
        setPostContent("");
      } else {
        console.error("Failed to submit post");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.containerfilho}>
        <textarea
          type="text"
          placeholder="Digite seu post..."
          className={styles.textarea1}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>
        <button type="submit" className={styles.postar}>
          Postar
        </button>
      </form>
    </div>
  );
}
