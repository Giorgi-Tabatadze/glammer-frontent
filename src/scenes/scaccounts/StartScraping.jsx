import React from "react";
import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useStartScrapingStatusMutation } from "../../state/api";

function StartScraping() {
  const [startScrapingProcess, { data, error, isLoading, isFetching }] =
    useStartScrapingStatusMutation();

  console.log(data);

  const handleQuery = async () => {
    await startScrapingProcess();
  };
  return (
    <Box>
      <LoadingButton
        size="small"
        color="secondary"
        onClick={handleQuery}
        loading={isLoading || isFetching}
        variant="outlined"
      >
        Start Tracking Scraping
      </LoadingButton>
    </Box>
  );
}

export default StartScraping;
