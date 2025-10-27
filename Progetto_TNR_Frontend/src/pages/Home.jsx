import { Container } from "react-bootstrap";
import HillclimbSection from "../components/HillclimbSection";
import KartSection from "../components/KartSection";
import LegendsSection from "../components/LegendsSection";
import TeamSection from "../components/TeamSection";
import ContactUs from "../components/ContactUs";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {


  const location = useLocation();
  const navigate = useNavigate();
  // ref per la sezione Team
  const teamRef = useRef(null);

  useEffect(() => {
    // se arriviamo con lo stato scrollTo = "team"
    if (location.state?.scrollTo === "team" && teamRef.current) {
      teamRef.current.scrollIntoView({ behavior: "smooth" });

      // opzionale: rimuove lo state dopo lo scroll (evita scroll non voluti se torni indietro)
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      // scroll all’inizio di default
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location, navigate]);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [])


  return (
    <>
      <KartSection />
      <LegendsSection />
      <HillclimbSection />
      <TeamSection ref={teamRef} />
      <ContactUs />
    </>
  );
}