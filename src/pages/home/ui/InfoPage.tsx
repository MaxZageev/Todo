import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { Chip, Stack, Switch, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import CloudIcon from "@mui/icons-material/Cloud";
import ComputerIcon from "@mui/icons-material/Computer";
import GroupIcon from "@mui/icons-material/Group";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import useAppConfig from "@/shared/config/app-config/lib/useAppConfig";
import DateChip from "@/shared/ui/DateChip";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import { useColorMode } from "@/shared/config/theme/ui/ThemeProvider";
import * as S from "./InfoPage.styled";

const InfoPage = ({ embedded = false }: { embedded?: boolean }) => {
  const { i18n, t } = useTranslation(undefined, { keyPrefix: "app-info" });
  const appConfig = useAppConfig();
  const { mode, toggle } = useColorMode();

  const [apiStatus, setApiStatus] = useState<"online" | "offline">("offline");
  const [latency, setLatency] = useState<number | null>(null);
  const [checkedUrl, setCheckedUrl] = useState<string>("");
  const [platform, setPlatform] = useState(navigator.platform);
  const date = BUILD_DATE;

  const renderDateError = useCallback(
    ({ error }) => (
      <ErrorFallback error={error} title={t("date-error-title")} description={date} />
    ),
    [t, date]
  );

  useEffect(() => {
    const checkApi = async () => {
      const url = appConfig?.TODO_API_URL;
      if (!url) return;
      setCheckedUrl(url);

      const start = performance.now();
      try {
        const res = await fetch(`${url}/todos`, { method: "HEAD" });
        if (res.ok) {
          setApiStatus("online");
          setLatency(Math.round(performance.now() - start));
        } else {
          setApiStatus("offline");
        }
      } catch {
        setApiStatus("offline");
      }
    };

    checkApi();
  }, [appConfig]);

  const lang = i18n?.resolvedLanguage || navigator.language || "unknown";

  useLayoutEffect(() => {
    if (navigator.userAgentData) {
      navigator.userAgentData
        .getHighEntropyValues(["bitness"])
        .then((info) => {
          setPlatform(`${navigator.userAgentData.platform} ${info.bitness && `x${info.bitness}`}`);
        })
        .catch(() => {
          setPlatform(navigator.platform);
        });
    }
  }, []);

  let apiChipLabel: string;
  if (apiStatus === "online") {
    apiChipLabel =
      latency != null ? t("api.latency", { latency }) : t("api.latency-unknown");
  } else {
    apiChipLabel = t("api.offline");
  }

  const apiSourceLabel = checkedUrl ? t("api.via", { url: checkedUrl }) : t("api.no-url");

  const modeChipLabel = t("chips.mode", { mode: process.env.NODE_ENV ?? "unknown" });
  const langChipLabel = t("chips.language", { lang });
  const deviceChipLabel = t("chips.device", { platform });
  const mobileChipLabel = navigator.userAgentData
    ? t("chips.mobile", { value: i18n.t(navigator.userAgentData.mobile ? "common.yes" : "common.no") })
    : null;

  const content = (
    <S.ContentPaper elevation={6}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        mb={2}
      >
        <InfoIcon color="primary" />
        <S.Title variant="h4">
          {t("title")}
        </S.Title>
      </Stack>

      <S.SectionDivider />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        mb={1}
      >
        <BuildIcon color="action" />
        <Typography variant="h6">{t("sections.build")}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip size="small" color="primary" label={t("build.version", { version: VERSION })} />
        <Chip size="small" color="secondary" label={t("build.commit", { hash: GIT_COMMIT })} />
        <ErrorBoundary resetKeys={[date]} fallbackRender={renderDateError}>
          <DateChip ISODate={date} />
        </ErrorBoundary>
      </Stack>

      <S.SectionRow
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
      >
        <SettingsIcon color="action" />
        <Typography variant="h6">{t("sections.runtime-config")}</Typography>
      </S.SectionRow>
      <S.ConfigPreview>
        {JSON.stringify(appConfig, null, 2)}
      </S.ConfigPreview>

      <S.SectionRow
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
      >
        <CloudIcon color={apiStatus === "online" ? "success" : "error"} />
        <Typography variant="h6">{t("sections.api-status")}</Typography>
        <S.StatusChip
          size="small"
          color={apiStatus === "online" ? "success" : "error"}
          label={apiChipLabel}
        />
      </S.SectionRow>
      <S.ApiSourceText variant="body2">
        {apiSourceLabel}
      </S.ApiSourceText>

      <S.SectionRow
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
      >
        <ComputerIcon color="action" />
        <Typography variant="h6">{t("sections.environment")}</Typography>
      </S.SectionRow>
      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
        <Chip size="small" color="info" label={modeChipLabel} />
        <Chip size="small" color="secondary" label={langChipLabel} />
        <Chip size="small" label={deviceChipLabel} />
        {mobileChipLabel && <Chip size="small" label={mobileChipLabel} />}
      </Stack>

      <S.SectionRow
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
      >
        <GroupIcon color="action" />
        <Typography variant="h6">{t("sections.contacts")}</Typography>
      </S.SectionRow>
      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
        <Chip
          avatar={
            <S.ContactAvatar>
              <S.ContactIcon />
            </S.ContactAvatar>
          }
          label={t("contacts.max")}
          component="a"
          href="https://t.me/Sad_Fish1702"
          target="_blank"
          rel="noopener noreferrer"
          clickable
        />
        <Chip
          avatar={
            <S.ContactAvatar>
              <S.ContactIcon />
            </S.ContactAvatar>
          }
          label={t("contacts.sacha")}
          component="a"
          href="https://perd.uno/sanek"
          target="_blank"
          rel="noopener noreferrer"
          clickable
        />
      </Stack>

      <S.SectionDivider />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 2 }}
        alignItems={{ xs: "stretch", sm: "center" }}
        width="100%"
      >
        <S.ActionButton variant="contained" color="primary" href="/todo">
          👉 {t("buttons.open-todo")}
        </S.ActionButton>
        <S.ActionButton
          variant="outlined"
          color="secondary"
          onClick={() => window.location.reload()}
        >
          🔄 {t("buttons.reload")}
        </S.ActionButton>
        <S.ThemeControl
          control={
            <Switch
              checked={mode === "dark"}
              onChange={toggle}
              icon={<LightModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          }
          label={t("theme.label")}
        />
      </Stack>
    </S.ContentPaper>
  );

  if (embedded) {
    return content;
  }

  return (
    <S.PageContainer>
      {content}
    </S.PageContainer>
  );
};

export default InfoPage;
