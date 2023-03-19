import { Box, Snackbar, Alert, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import {
  useStartScrapingStatusMutation,
  useGetMostRecentlyUpdatedTrackingQuery,
} from "../../state/api";

function StartScraping() {
  const [scrapingMessage, setScrapingMessage] = useState(false);

  const { data: mostRecentData } = useGetMostRecentlyUpdatedTrackingQuery();

  const [startScrapingProcess, { data, error, isLoading, isFetching }] =
    useStartScrapingStatusMutation();

  useEffect(() => {
    if (data?.message) {
      setScrapingMessage(true);
    }
  }, [data, error]);

  const handleQuery = async () => {
    await startScrapingProcess();
  };
  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={scrapingMessage}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setScrapingMessage(false);
        }}
      >
        <Alert
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setScrapingMessage(false);
          }}
          severity={data?.isError ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {data?.message}
        </Alert>
      </Snackbar>
      <LoadingButton
        size="small"
        color="secondary"
        onClick={handleQuery}
        loading={isLoading || isFetching}
        variant="outlined"
      >
        Start Tracking Scraping
      </LoadingButton>
      {mostRecentData?.updatedAt && (
        <Typography variant="p">
          Last Updated:{" "}
          {new Date(mostRecentData?.updatedAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            second: "numeric",
            minute: "numeric",
            hour: "numeric",
          })}
        </Typography>
      )}
    </Box>
  );
}

export default StartScraping;
