import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import ThemeProviderWrapper from "./theme/theme-provider";
import SnackbarProviderWrapper from "./components/snackbar/_components/snackbar-provider";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

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
