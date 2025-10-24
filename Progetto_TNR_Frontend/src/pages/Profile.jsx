import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  ListGroup,
  InputGroup,
  Badge,
} from "react-bootstrap";
import {
  PencilSquare,
  CheckCircle,
  Trash,
  Upload,
  Speedometer2,
  PersonFill,
} from "react-bootstrap-icons";
import axiosInstance from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const { loggedUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser) {
      setUser({
        nome: loggedUser.nome,
        cognome: loggedUser.cognome,
        email: loggedUser.email,
        dataDiNascita: loggedUser.dataDiNascita,
        avatar: loggedUser?.avatar,
        ruolo: loggedUser?.ruolo,
        password: "",
        categoria: loggedUser?.categoria,
        docPersonali: loggedUser?.docPersonali || [],
      });
    }
  }, [loggedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "password") {
      setUser({ ...user, [name]: value });
    } else if (value !== "") {
      setUser({ ...user, [name]: value });
    }
  };

  // ✅ Quando l’utente seleziona un nuovo file immagine
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatarFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, avatar: imageUrl })); // anteprima
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("nome", user.nome);
      formData.append("cognome", user.cognome);
      formData.append("email", user.email);
      formData.append("dataDiNascita", user.dataDiNascita);

      // Se l’utente ha caricato un nuovo avatar, aggiungilo come File
      if (newAvatarFile) {
        formData.append("avatar", newAvatarFile);
      } else {
        formData.append("avatar", user.avatar);
      }

      if (user.password !== "") {
        formData.append("password", user.password);
      }

      await axiosInstance.patch(`/users/avatar/${loggedUser?._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Upload documenti
      const docData = new FormData();
      user.docPersonali.forEach((doc) => {
        if (doc instanceof File) {
          docData.append("docPersonali", doc);
        }
      });

      await axiosInstance.patch(
        `/users/docPersonali/${loggedUser?._id}`,
        docData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error("Errore nel salvataggio:", err);
    }
  };

  const handleAddDoc = (e) => {
    const newFiles = Array.from(e.target.files);
    setUser((prev) => ({
      ...prev,
      docPersonali: [...(prev.docPersonali || []), ...newFiles],
    }));
  };

  const handleRemoveDoc = async (index) => {
    try {
      const updatedDocs = user.docPersonali.filter((_, i) => i !== index);
      setUser((prev) => ({ ...prev, docPersonali: updatedDocs }));

      const formData = new FormData();
      formData.append("docPersonali", JSON.stringify(updatedDocs));

      await axiosInstance.patch(
        `/users/docPersonali/${loggedUser?._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      window.location.reload();
    } catch (err) {
      console.error("Errore durante l'eliminazione del documento:", err);
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Errore durante la cancellazione dell'utente");
    }
  };

  return (
    <div className="profile-bg" style={{ height: editMode ? "100vh" : "80vh" }}>
      <Container className="py-4" style={{height:"100%"}}>
        <Card className="shadow-lg profile-card">
          <Card.Header className="d-flex justify-content-between align-items-center profile-header">
            <div className="d-flex align-items-center gap-2">
              <Speedometer2 size={26} />
              <h4 className="mb-0 fw-bold text-uppercase">Profilo Utente</h4>
            </div>
            <div>
              <Button
                variant="danger"
                onClick={() => handleRemoveUser(loggedUser._id)}
                className="fw-bold me-3"
              >
                <Trash className="me-2" />
                Elimina account
              </Button>
              {editMode ? (
                <Button variant="success" onClick={handleSave} className="fw-bold">
                  <CheckCircle className="me-2" />
                  Salva
                </Button>
              ) : (
                <Button
                  variant="danger"
                  onClick={() => setEditMode(true)}
                  className="fw-bold"
                >
                  <PencilSquare className="me-2" />
                  Modifica
                </Button>
              )}
            </div>
          </Card.Header>

          <Card.Body>
            <Row className="align-items-center mb-4">
              <Col md={3} className="text-center">
                <div className="avatar-wrapper mx-auto position-relative">
                  <Image
                    src={user?.avatar}
                    roundedCircle
                    width={160}
                    height={160}
                    alt="Avatar utente"
                    className="shadow avatar-img"
                  />
                  {editMode && (
                    <>
                      <Form.Label
                        htmlFor="avatarUpload"
                        className="btn btn-outline-secondary btn-sm mt-3"
                        style={{ cursor: "pointer" }}
                      >
                        <Upload className="me-2" />
                        Carica immagine
                      </Form.Label>
                      <Form.Control
                        id="avatarUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        style={{ display: "none" }}
                      />
                    </>
                  )}
                </div>

                <h5 className="mt-3 fw-bold">
                  {user?.nome} {user?.cognome}
                </h5>

                <Badge bg="danger" className="me-2">
                  {user?.ruolo}
                </Badge>
                <Badge bg="secondary">{user?.categoria}</Badge>
              </Col>

              <Col md={9}>
                <Form>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                          type="text"
                          name="nome"
                          value={user?.nome || ""}
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Cognome</Form.Label>
                        <Form.Control
                          type="text"
                          name="cognome"
                          value={user?.cognome || ""}
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={user?.email || ""}
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Data di Nascita</Form.Label>
                        <Form.Control
                          type="date"
                          name="dataDiNascita"
                          value={user?.dataDiNascita || ""}
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="text"
                          name="password"
                          value={!editMode ? "***********" : user.password}
                          onChange={handleChange}
                          disabled={!editMode}
                          placeholder="Inserisci nuova password"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>

            <hr className="border-danger opacity-75" />
            <h5 className="mb-3">
              <PersonFill className="me-2" />
              Documenti Personali
            </h5>
            <hr className="border-danger opacity-75" />

            <ListGroup>
              {user?.docPersonali?.map((doc, idx) => (
                <ListGroup.Item
                  key={idx}
                  className="d-flex justify-content-between align-items-center"
                >
                  {doc instanceof File ? (
                    <span>File da caricare: {doc.name}</span>
                  ) : (
                    <a
                      href={`${doc.path}`}
                      download={doc.originalName || "documento"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {doc.originalName || doc.path.split("/").pop()}
                    </a>
                  )}

                  {editMode && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveDoc(idx)}
                    >
                      Elimina
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>

            {editMode && (
              <Form.Group controlId="formFileMultiple" className="mt-3">
                <Form.Label>Carica nuovi documenti</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  name="docPersonali"
                  onChange={handleAddDoc}
                />
              </Form.Group>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;