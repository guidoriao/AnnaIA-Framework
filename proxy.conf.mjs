// Proxy de desarrollo: `npm start` envía /api y /health al backend de Anna IA.
// Por defecto usa el servidor local; desde otra red se indica la IP al arrancar:
//   ANNA_SERVIDOR=100.x.x.x:3100 npm start        (Git Bash)
//   $env:ANNA_SERVIDOR="100.x.x.x:3100"; npm start (PowerShell)
const servidor = process.env.ANNA_SERVIDOR ?? '127.0.0.1:3000';
const destino = servidor.startsWith('http') ? servidor : `http://${servidor}`;

console.log(`[proxy] /api y /health -> ${destino}`);

const ruta = { target: destino, secure: false, changeOrigin: true };

export default {
  '/api': ruta,
  '/health': ruta,
};
