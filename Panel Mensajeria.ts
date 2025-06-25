import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { saveAs } from "file-saver";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";

export default function MensajeriaPanel() {
  const [usuario, setUsuario] = useState(null);
  const [registro, setRegistro] = useState(false);
  const [credenciales, setCredenciales] = useState({ email: "", password: "", rol: "mensajero" });

  const [registros, setRegistros] = useState([]);
  const [form, setForm] = useState({
    id: "",
    tipo: "",
    prioridad: "",
    destino: "",
    mensajero: "",
    hora: "",
    fecha: "",
    observaciones: ""
  });

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "usuarios", user.uid));
        if (docSnap.exists()) {
          setUsuario({ uid: user.uid, email: user.email, rol: docSnap.data().rol });
        }
      } else {
        setUsuario(null);
      }
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegistro = async () => {
    if (!form.id || !form.tipo || !form.fecha || !form.hora) return;
    await addDoc(collection(db, "registros"), form);
    setRegistros([...registros, form]);
    setForm({ id: "", tipo: "", prioridad: "", destino: "", mensajero: "", hora: "", fecha: "", observaciones: "" });
  };

  const exportarCSV = () => {
    const encabezados = "ID,Tipo,Prioridad,Destino,Mensajero,Fecha,Hora,Observaciones\n";
    const filas = registros.map(r => `${r.id},${r.tipo},${r.prioridad},${r.destino},${r.mensajero},${r.fecha},${r.hora},${r.observaciones}`).join("\n");
    const blob = new Blob([encabezados + filas], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "registro_mensajeria.csv");
  };

  const loginUsuario = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credenciales.email, credenciales.password);
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const registrarUsuario = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, credenciales.email, credenciales.password);
      await setDoc(doc(db, "usuarios", userCredential.user.uid), { rol: credenciales.rol });
    } catch (error) {
      alert("Error al registrar: " + error.message);
    }
  };

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  if (!usuario) {
    return (
      <div className="p-8 bg-[#002338] min-h-screen text-[#77c25c] flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">🔐 Acceso al Panel de Mensajería</h2>
        <Input placeholder="Email" value={credenciales.email} onChange={e => setCredenciales({ ...credenciales, email: e.target.value })} className="mb-2" />
        <Input placeholder="Contraseña" type="password" value={credenciales.password} onChange={e => setCredenciales({ ...credenciales, password: e.target.value })} className="mb-2" />
        {registro && (
          <select className="mb-2 text-[#002338]" value={credenciales.rol} onChange={e => setCredenciales({ ...credenciales, rol: e.target.value })}>
            <option value="mensajero">Mensajero</option>
            <option value="oficina_partes">Oficina de Partes</option>
            <option value="admin">Administrador</option>
          </select>
        )}
        <div className="flex gap-2">
          <Button onClick={() => registro ? registrarUsuario() : loginUsuario()} className="bg-[#77c25c] text-[#002338]">
            {registro ? "Registrar" : "Iniciar Sesión"}
          </Button>
          <Button variant="ghost" onClick={() => setRegistro(!registro)}>
            {registro ? "Ya tengo cuenta" : "Registrarme"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#002338] min-h-screen text-[#77c25c]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📦 Panel - {usuario.rol}</h1>
        <Button className="bg-red-600 text-white" onClick={cerrarSesion}>Cerrar Sesión</Button>
      </div>

      <Tabs defaultValue="registro" className="w-full">
        <TabsList className="bg-[#001a29]">
          {usuario.rol !== "mensajero" && <TabsTrigger value="registro">📥 Registrar</TabsTrigger>}
          <TabsTrigger value="listado">📋 Listado</TabsTrigger>
        </TabsList>

        {usuario.rol !== "mensajero" && (
          <TabsContent value="registro">
            <Card className="bg-[#001a29] text-[#77c25c] mt-4">
              <CardContent className="space-y-4">
                <Input name="id" placeholder="ID" value={form.id} onChange={handleChange} />
                <Input name="tipo" placeholder="Tipo de documento (Legal, General, etc.)" value={form.tipo} onChange={handleChange} />
                <Input name="prioridad" placeholder="Prioridad (Alta, Media, Baja)" value={form.prioridad} onChange={handleChange} />
                <Input name="destino" placeholder="Destino o Acción" value={form.destino} onChange={handleChange} />
                <Input name="mensajero" placeholder="Mensajero asignado" value={form.mensajero} onChange={handleChange} />
                <Input name="fecha" type="date" value={form.fecha} onChange={handleChange} />
                <Input name="hora" type="time" value={form.hora} onChange={handleChange} />
                <Textarea name="observaciones" placeholder="Observaciones" value={form.observaciones} onChange={handleChange} />
                <Button className="bg-[#77c25c] text-[#002338]" onClick={handleRegistro}>Registrar</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="listado">
          <div className="mt-4 space-y-2">
            {usuario.rol === "admin" && <Button className="bg-[#77c25c] text-[#002338] mb-4" onClick={exportarCSV}>📤 Exportar CSV</Button>}
            {registros.length === 0 && <p>No hay registros aún.</p>}
            {registros.map((r, i) => (
              <Card key={i} className="bg-[#001a29]">
                <CardContent className="text-[#77c25c] p-3">
                  <p><strong>ID:</strong> {r.id}</p>
                  <p><strong>Tipo:</strong> {r.tipo}</p>
                  <p><strong>Prioridad:</strong> {r.prioridad}</p>
                  <p><strong>Destino:</strong> {r.destino}</p>
                  <p><strong>Mensajero:</strong> {r.mensajero}</p>
                  <p><strong>Fecha:</strong> {r.fecha}</p>
                  <p><strong>Hora:</strong> {r.hora}</p>
                  <p><strong>Observaciones:</strong> {r.observaciones}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
