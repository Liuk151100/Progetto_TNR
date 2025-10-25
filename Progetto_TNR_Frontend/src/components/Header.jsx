import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { useAuthContext } from "../contexts/authContext";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ⬅️ aggiunto useLocation

const UserMenu = ({ token, logout, loggedUser }) => {

  const location = useLocation(); // ⬅️ serve per sapere quando cambia la pagina

  // Stato per gestire il menu mobile
  const [expanded, setExpanded] = useState(false);

  // Ogni volta che cambia il path → richiudi il menu
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  if (!token) {
    return (
      <Button
        variant="dark"
        size="sm"
        as={Link}
        to="/Login"
        className="ms-3 fw-bold"
        style={{ borderRadius: "20px" }}
      >
        Login
      </Button>
    );
  }


  return (
    <NavDropdown
      align="end"
      title={<PersonCircle size={26} color="black" />}
      id="user-dropdown"
      className="ms-3"
    >
      <NavDropdown.Item style={{ fontWeight: "bold" }}>
        {loggedUser?.nome || ""} {loggedUser?.cognome || ""}
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item to="/me" as={Link}>
        Profile
      </NavDropdown.Item>

      <NavDropdown.Item to="/" as={Link} onClick={logout}>
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default function Header() {
  const { token, logout, loggedUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); // ⬅️ serve per sapere quando cambia la pagina

  // Stato per gestire il menu mobile
  const [expanded, setExpanded] = useState(false);

  // Ogni volta che cambia il path → richiudi il menu
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  const scrollToContactUs = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 500);
  };

  const scrollToTeam = () => {
    navigate("/", { state: { scrollTo: "team" } });
  };

  const goToHome = () => {
    navigate("/", { state: undefined });
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Navbar
        expand="lg"
        bg="light"
        className="px-3 py-2 shadow-sm"
        expanded={expanded}               // ⬅️ controlla lo stato
        onToggle={(isExpanded) => setExpanded(isExpanded)}  // ⬅️ aggiorna quando clicchi toggle
      >
        <Container fluid className="d-flex align-items-center justify-content-between">
          <Nav.Link onClick={goToHome}>
            <Navbar.Brand>
              <img
                src="/Loghi/LOGO-VETTORIALE-NEW-RACING.svg"
                alt="Logo"
                style={{ height: "50px", width: "auto" }}
              />
            </Navbar.Brand>
          </Nav.Link>

          {/* MOBILE: TOGGLE + USER MENU */}
          <div className="d-flex align-items-center d-lg-none ms-auto">
            <UserMenu token={token} logout={logout} loggedUser={loggedUser} />
            <Navbar.Toggle
              aria-controls="navbarResponsive"
              className="ms-2 border-0"
            />
          </div>

          {/* COLLAPSIBLE LINKS */}
          <Navbar.Collapse
            id="navbarResponsive"
            className="mt-2 mt-lg-0 d-lg-flex flex-grow-1 justify-content-start"
          >
            <Nav className="my-2 my-lg-0" navbarScroll>
              <Nav.Link
                onClick={scrollToTeam}
                style={{ fontSize: "1em", fontWeight: "bold", marginRight: "1.5rem" }}
              >
                TEAM
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/events"
                style={{ fontSize: "1em", fontWeight: "bold", marginRight: "1.5rem" }}
              >
                EVENTI
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/safeguarding"
                style={{ fontSize: "1em", fontWeight: "bold", marginRight: "1.5rem" }}
              >
                SAFEGUARDING
              </Nav.Link>

              <Nav.Link
                onClick={scrollToContactUs}
                style={{ fontSize: "1em", fontWeight: "bold", marginRight: "1.5rem" }}
              >
                CONTATTACI
              </Nav.Link>

              {token && loggedUser?.ruolo === "Admin" && (
                <Nav.Link
                  as={Link}
                  to="/newUser"
                  style={{ fontSize: "1em", fontWeight: "bold", marginRight: "1.5rem" }}
                >
                  CREA UTENTE
                </Nav.Link>
              )}
            </Nav>

            <div className="d-none d-lg-flex ms-auto">
              <UserMenu token={token} logout={logout} loggedUser={loggedUser} />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
