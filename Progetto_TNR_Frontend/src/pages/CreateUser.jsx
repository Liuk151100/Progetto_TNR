import { useContext, useEffect, useState } from "react";
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
    Alert,
} from "react-bootstrap";
import {
    PencilSquare,
    CheckCircle,
    PlusCircle,
    Upload,
    Speedometer2,
    PersonFill,
    Border,
    FileX,
} from "react-bootstrap-icons";
import axios from "axios";
import axiosInstance from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  const [user, setUser] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
    avatar: "",
    ruolo: "",
    categoria: "",
  });

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axiosInstance.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus(response.status);
      setMessage(response.data.message || "Utente creato con successo!");

      setUser({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        dataDiNascita: "",
        avatar: "",
        ruolo: "",
        categoria: "",
      });
    } catch (err) {
      setStatus(err.response?.status || 500);
      setMessage(err.response?.data?.message || "Errore durante la creazione utente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center py-10">
      <Card className="w-full max-w-4xl shadow-2xl border border-zinc-700 bg-zinc-900/80 backdrop-blur">
        <Card.Header className="flex justify-between items-center border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <Speedometer2 size={28} className="text-red-500" />
            <Card.Title className="text-xl font-bold text-white">
              Crea Nuovo Utente
            </Card.Title>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            <CheckCircle className="mr-2" size={18} />
            {loading ? "Salvataggio..." : "Salva"}
          </Button>
        </Card.Header>

        <Card.Content className="p-6 space-y-4">
          {message && (
            <Alert
              className={`${
                status >= 400 ? "bg-red-600/20 border-red-600" : "bg-green-600/20 border-green-600"
              } text-white`}
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={
                  user.avatar ||
                  "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                }
                alt="Avatar preview"
                className="w-40 h-40 rounded-full border-4 border-zinc-700 shadow-lg object-cover"
              />
              <div className="w-full">
                <Label className="text-sm text-zinc-300">URL Avatar</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    name="avatar"
                    value={user.avatar}
                    onChange={handleChange}
                    placeholder="Inserisci URL immagine..."
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button variant="outline" className="border-zinc-700">
                    <Upload size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-zinc-300">Nome</Label>
                <Input
                  name="nome"
                  value={user.nome}
                  onChange={handleChange}
                  placeholder="Inserisci nome"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-sm text-zinc-300">Cognome</Label>
                <Input
                  name="cognome"
                  value={user.cognome}
                  onChange={handleChange}
                  placeholder="Inserisci cognome"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-sm text-zinc-300">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Inserisci email"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-sm text-zinc-300">Password</Label>
                <Input
                  name="password"
                  type="text"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Password primo accesso"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-sm text-zinc-300">Data di Nascita</Label>
                <Input
                  name="dataDiNascita"
                  type="date"
                  value={user.dataDiNascita}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div>
                <Label className="text-sm text-zinc-300">Ruolo</Label>
                <Select
                  value={user.ruolo}
                  onValueChange={(val) => setUser((p) => ({ ...p, ruolo: val }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Seleziona ruolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">👑 Admin</SelectItem>
                    <SelectItem value="Pilota">🏎️ Pilota</SelectItem>
                    <SelectItem value="Meccanico">🔧 Meccanico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-zinc-300">Categoria</Label>
                <Select
                  value={user.categoria}
                  onValueChange={(val) =>
                    setUser((p) => ({ ...p, categoria: val }))
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kart">🏁 Kart</SelectItem>
                    <SelectItem value="Legend Cars">🚗 Legend Cars</SelectItem>
                    <SelectItem value="Hillclimb Cars">⛰️ Hillclimb Cars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}