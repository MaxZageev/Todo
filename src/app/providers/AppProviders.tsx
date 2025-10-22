import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";

import AppConfigProvider from "@/shared/config/app-config/ui/AppConfigProvider";
import queryClient from "@/shared/api/queryClient";
import { AppThemeProvider } from "@/shared/config/theme/ui/ThemeProvider";
import { store } from "./store";

const AppProviders = ({ children }: PropsWithChildren): JSX.Element => (
  <Provider store={store}>
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppConfigProvider>{children}</AppConfigProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  </Provider>
);

export default AppProviders;
