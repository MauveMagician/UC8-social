"use client";
import "./globals.css";
import { useState, useEffect } from "react";

export default function FotoPerfil({ user_id }) {
  const [pfp, setPfp] = useState(null);
  useEffect(() => {
    console.log("useEffect triggered with user_id:", user_id);
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
    if (user_id) {
      fetchPhoto();
    }
  }, [user_id]);
  return <>{pfp ? <img src={pfp} alt="Foto do perfil" /> : <p></p>}</>;
}
