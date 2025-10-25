import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

export default function KartSection() {
  // Lista delle immagini presenti nella cartella assets
  const images = [
    "./assets/KartSection/N5N_0405.jpg",
    "./assets/KartSection/N5N_0266.jpg",
    "./assets/KartSection/N5N_0427.jpg",
    "./assets/KartSection/NI5_6177.jpg",
    "./assets/KartSection/NI5_8193.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [fade, setFade] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 🔹 Aggiorna la dimensione della finestra per il responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Precarica tutte le immagini
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 🔹 Cambio immagine con doppio layer (fade)
  useEffect(() => {
    const interval = setInterval(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * images.length);
      } while (newIndex === currentIndex);

      setNextIndex(newIndex);
      setFade(true);

      // Dopo la transizione, cambia immagine corrente
      const timeout = setTimeout(() => {
        setCurrentIndex(newIndex);
        setFade(false);
      }, 800); // durata della transizione

      return () => clearTimeout(timeout);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, images]);

  // 🔹 Gestione responsive
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1200;

  return (
    <Container
      fluid
      style={{
        padding: 0,
        margin: 0,
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        border: "3px solid white",
      }}
    >
      {/* 🔹 Layer immagine corrente */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "opacity 0.8s ease-in-out",
          opacity: fade ? 0 : 1,
          willChange: "opacity, background-image",
          backfaceVisibility: "hidden",
          zIndex: 1,
        }}
      ></div>

      {/* 🔹 Layer immagine successiva */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${images[nextIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "opacity 0.8s ease-in-out",
          opacity: fade ? 1 : 0,
          willChange: "opacity, background-image",
          backfaceVisibility: "hidden",
          zIndex: 2,
        }}
      ></div>

      {/* 🔹 Overlay con testo */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
          textAlign: isMobile ? "center" : "left",
          paddingLeft: isMobile ? "5%" : isTablet ? "8%" : "10%",
          paddingRight: isMobile ? "5%" : "0",
          transition: "all 0.3s ease",
          zIndex: 3,
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: isMobile ? "2.2rem" : isTablet ? "3rem" : "4rem",
            fontWeight: "700",
            letterSpacing: "2px",
            marginBottom: "1rem",
            fontFamily: "'Roboto Condensed', sans-serif",
            textTransform: "uppercase",
          }}
        >
          Kart Team
        </h1>

        <p
          style={{
            color: "white",
            width: isMobile ? "90%" : isTablet ? "70%" : "50%",
            fontSize: isMobile ? "1rem" : "1.1rem",
            lineHeight: "1.6",
            marginBottom: "2rem",
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          Campionato interessati: Interregionale, Italiano, Europeo e Mondiale
        </p>
      </div>
    </Container>
  );
}