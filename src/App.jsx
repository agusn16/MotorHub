// App.jsx
// este archivo es el punto de entrada de la aplicación y se encarga de renderizar el componente principal de la aplicación,
// que en este caso es AppRouter.
// AppRouter se encarga de manejar las rutas de la aplicación y renderizar los componentes correspondientes según la ruta actual.

import AppRouter from "./routes/AppRouter"

function App() {
  return <AppRouter />
}
export default App