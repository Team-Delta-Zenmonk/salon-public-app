import "./app.css";
import AuthSync from "./providers/auth-sync";
import AllRoutes from "./routes/all-routes";

function App() {
  return (
    <>
      <AuthSync />
      <AllRoutes />
    </>
  );
}

export default App;
