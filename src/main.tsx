import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import ThemeProviderWrapper from "./theme/theme-provider";
import SnackbarProviderWrapper from "./components/snackbar/_components/snackbar-provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProviderWrapper>
        <SnackbarProviderWrapper>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </SnackbarProviderWrapper>
      </ThemeProviderWrapper>
    </BrowserRouter>
  </StrictMode>
);
