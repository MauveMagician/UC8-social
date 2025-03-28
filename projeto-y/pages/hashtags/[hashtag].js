import {
  DarkModeContextProvider,
  useDarkMode,
} from "@/app/context/DarkModeContext";
import MenuSuperior from "@/app/menuSuperior";
import MenuInferior from "@/app/menuInferior";
import Postagens from "@/app/postagens";
import { useState, useEffect } from "react";

export async function getServerSideProps(context) {
  const { hashtag } = context.params;
  const page = context.query.page || 1;
  return {
    props: { hashtag, initialPage: parseInt(page) },
  };
}

function HashtagPageContent({ hashtag, initialPage }) {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const { dark } = useDarkMode();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/data/posts_screen?page=${currentPage}&hashtag=${hashtag}`
        );
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
          setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.error("Error fetching posts for hashtag:", error);
      }
    };

    fetchPosts();
  }, [hashtag, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div
      style={{
        backgroundColor: dark ? "black" : "white",
        color: dark ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      <MenuSuperior />
      <div style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <h1>#{hashtag}</h1>
        {posts.map((post) => (
          <Postagens key={post.post_id} post_id={post.post_id} />
        ))}
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
      <MenuInferior />
    </div>
  );
}

export default function HashtagPage(props) {
  return (
    <DarkModeContextProvider>
      <HashtagPageContent {...props} />
    </DarkModeContextProvider>
  );
}
