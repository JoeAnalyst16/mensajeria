import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MensajeriaPanel() {
  const [usuario, setUsuario] = useState(null);
  const [registro, setRegistro] = useState(false);
  const [credenciales, setCredenciales] = useState({ 
    email: "", 
    password: "", 
    rol: "mensajero" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Simulación de autenticación (reemplaza las llamadas a Firebase)
  useEffect(() => {
    // Verificar si hay usuario en memoria
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
    
    // Cargar registros guardados
    const storedRegistros = sessionStorage.getItem('registros');
    if (storedRegistros) {
      setRegistros(JSON.parse(storedRegistros));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCredencialesChange = (field, value) => {
    setCredenciales({ ...credenciales, [field]: value });
  };

  const handleRegistro = async () => {
    if (!form.id || !form.tipo || !form.fecha || !form.hora) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simular guardado
      const nuevoRegistro = { 
        ...form, 
        id: form.id || Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      
      const nuevosRegistros = [...registros, nuevoRegistro];
      setRegistros(nuevosRegistros);
      
      // Guardar en memoria
      sessionStorage.setItem('registros', JSON.stringify(nuevosRegistros));
      
      // Limpiar formulario
      setForm({ 
        id: "", 
        tipo: "", 
        prioridad: "", 
        destino: "", 
        mensajero: "", 
        hora: "", 
        fecha: "", 
        observaciones: "" 
      });
      
      setError("");
    } catch (error) {
      setError("Error al registrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    if (registros.length === 0) {
      setError("No hay registros para exportar");
      return;
    }

    try {
      const encabezados = "ID,Tipo,Prioridad,Destino,Mensajero,Fecha,Hora,Observaciones\n";
      const filas = registros.map(r => 
        `"${r.id}","${r.tipo}","${r.prioridad}","${r.destino}","${r.mensajero}","${r.fecha}","${r.hora}","${r.observaciones}"`
      ).join("\n");
      
      const contenidoCSV = encabezados + filas;
      const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `registro_mensajeria_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError("Error al exportar CSV: " + error.message);
    }
  };

  const loginUsuario = async () => {
    if (!credenciales.email || !credenciales.password) {
      setError("Por favor completa email y contraseña");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulación de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usuarioData = {
        uid: Date.now().toString(),
        email: credenciales.email,
        rol: credenciales.rol
      };
      
      setUsuario(usuarioData);
      sessionStorage.setItem('currentUser', JSON.stringify(usuarioData));
      
      setCredenciales({ email: "", password: "", rol: "mensajero" });
    } catch (error) {
      setError("Error al iniciar sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const registrarUsuario = async () => {
    if (!credenciales.email || !credenciales.password) {
      setError("Por favor completa email y contraseña");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulación de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usuarioData = {
        uid: Date.now().toString(),
        email: credenciales.email,
        rol: credenciales.rol
      };
      
      setUsuario(usuarioData);
      sessionStorage.setItem('currentUser', JSON.stringify(usuarioData));
      
      setCredenciales({ email: "", password: "", rol: "mensajero" });
      setRegistro(false);
    } catch (error) {
      setError("Error al registrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    sessionStorage.removeItem('currentUser');
    setCredenciales({ email: "", password: "", rol: "mensajero" });
    setError("");
  };

  // Pantalla de login
  if (!usuario) {
    return (
      <div className="p-8 bg-slate-900 min-h-screen text-green-400 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold mb-6 text-center">🔐 Acceso al Panel de Mensajería</h2>
          
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded border border-red-700">
              {error}
            </div>
          )}
          
          <Input 
            placeholder="Email" 
            type="email"
            value={credenciales.email} 
            onChange={e => handleCredencialesChange('email', e.target.value)}
            className="bg-slate-800 border-slate-700 text-green-400"
            disabled={loading}
          />
          
          <Input 
            placeholder="Contraseña" 
            type="password" 
            value={credenciales.password} 
            onChange={e => handleCredencialesChange('password', e.target.value)}
            className="bg-slate-800 border-slate-700 text-green-400"
            disabled={loading}
          />
          
          {registro && (
            <select 
              className="w-full p-2 bg-slate-800 border border-slate-700 text-green-400 rounded"
              value={credenciales.rol} 
              onChange={e => handleCredencialesChange('rol', e.target.value)}
              disabled={loading}
            >
              <option value="mensajero">Mensajero</option>
              <option value="oficina_partes">Oficina de Partes</option>
              <option value="admin">Administrador</option>
            </select>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={() => registro ? registrarUsuario() : loginUsuario()} 
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
              disabled={loading}
            >
              {loading ? "Procesando..." : (registro ? "Registrar" : "Iniciar Sesión")}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setRegistro(!registro);
                setError("");
              }}
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
              disabled={loading}
            >
              {registro ? "Ya tengo cuenta" : "Registrarme"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Panel principal
  return (
    <div className="p-4 bg-slate-900 min-h-screen text-green-400">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">📦 Panel de Mensajería</h1>
          <p className="text-green-300">Usuario: {usuario.email} | Rol: {usuario.rol}</p>
        </div>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white" 
          onClick={cerrarSesion}
        >
          Cerrar Sesión
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-200 p-3 rounded border border-red-700 mb-4">
          {error}
        </div>
      )}

      <Tabs defaultValue={usuario.rol === "mensajero" ? "listado" : "registro"} className="w-full">
        <TabsList className="bg-slate-800">
          {usuario.rol !== "mensajero" && (
            <TabsTrigger value="registro" className="data-[state=active]:bg-green-600">
              📥 Registrar
            </TabsTrigger>
          )}
          <TabsTrigger value="listado" className="data-[state=active]:bg-green-600">
            📋 Listado
          </TabsTrigger>
        </TabsList>

        {usuario.rol !== "mensajero" && (
          <TabsContent value="registro">
            <Card className="bg-slate-800 border-slate-700 mt-4">
              <CardContent className="space-y-4 p-6">
                <h3 className="text-xl font-semibold text-green-400 mb-4">Nuevo Registro</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    name="id" 
                    placeholder="ID del documento" 
                    value={form.id} 
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-green-400"
                    disabled={loading}
                  />
                  
                  <Input 
                    name="tipo" 
                    placeholder="Tipo de documento (Legal, General, etc.)" 
                    value={form.tipo} 
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-green-400"
                    disabled={loading}
                  />
                  
                  <select
                    name="prioridad"
                    value={form.prioridad}
                    onChange={handleChange}
                    className="p-2 bg-slate-700 border border-slate-600 text-green-400 rounded"
                    disabled={loading}
                  >
                    <option value="">Seleccionar prioridad</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                  
                  <Input 
                    name="destino" 
                    placeholder="Destino o Acción" 
                    value={form.destino} 
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-green-400"
                    disabled={loading}
                  />
                  
                  <Input 
                    name="mensajero" 
                    placeholder="Mensajero asignado" 
                    value={form.mensajero} 
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-green-400"
                    disabled={loading}
                  />
                  
                  <Input 
                    name="fecha" 
                    type="date" 
                    value={form.fecha} 
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-green-400"
                    disabled={loading}
                  />
                  
                  <Input 
                    name="hora" 
                    type="time" 
                    value={form.hora} 
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-green-400"
                    disabled={loading}
                  />
                </div>
                
                <Textarea 
                  name="observaciones" 
                  placeholder="Observaciones adicionales" 
                  value={form.observaciones} 
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-green-400"
                  disabled={loading}
                />
                
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={handleRegistro}
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Registrar Documento"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="listado">
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Registros de Mensajería</h3>
              {usuario.rol === "admin" && (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  onClick={exportarCSV}
                  disabled={registros.length === 0}
                >
                  📤 Exportar CSV ({registros.length})
                </Button>
              )}
            </div>
            
            {registros.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <p className="text-green-300">No hay registros disponibles.</p>
                  {usuario.rol !== "mensajero" && (
                    <p className="text-sm text-green-400 mt-2">
                      Usa la pestaña "Registrar" para agregar nuevos documentos.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {registros.map((registro, index) => (
                  <Card key={index} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="font-semibold text-green-300">ID:</span>
                          <p className="text-green-400">{registro.id}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-300">Tipo:</span>
                          <p className="text-green-400">{registro.tipo}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-300">Prioridad:</span>
                          <p className={`font-medium ${
                            registro.prioridad === 'Alta' ? 'text-red-400' :
                            registro.prioridad === 'Media' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {registro.prioridad}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-300">Destino:</span>
                          <p className="text-green-400">{registro.destino}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-300">Mensajero:</span>
                          <p className="text-green-400">{registro.mensajero}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-300">Fecha:</span>
                          <p className="text-green-400">{registro.fecha}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-300">Hora:</span>
                          <p className="text-green-400">{registro.hora}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-300">Observaciones:</span>
                          <p className="text-green-400">{registro.observaciones || "Sin observaciones"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
