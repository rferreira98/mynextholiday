"use client";

import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Holiday } from "../../models/models";
import Divider from "../components/Divider";
import HolidayText from "../components/HolidayText";
import MessageText from "../components/MessageText";
import SearchInput from "../components/SearchInput";

const MainSection = () => {
  const [nextMandatoryHoliday, setNextMandatoryHoliday] =
    useState<Holiday | null>(null);
  const [nextOptionalHoliday, setNextOptionalHoliday] =
    useState<Holiday | null>(null);

  //breakpoints
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Grid
      container
      display="flex"
      justifyContent="center"
      height={`calc(100vh - ${!isDesktop ? "4rem" : "12rem"})`}
    >
      <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
        <Grid container gap={2} textAlign="center">
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <SearchInput
              mandatoryHolidayHandler={setNextMandatoryHoliday}
              optionalHolidayHandler={setNextOptionalHoliday}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {nextMandatoryHoliday && (
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <HolidayText holiday={nextMandatoryHoliday} isOptional={false} />
            </Grid>
          )}
          {nextOptionalHoliday && (
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <HolidayText holiday={nextOptionalHoliday} isOptional />
            </Grid>
          )}

          {!nextMandatoryHoliday && !nextOptionalHoliday && (
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <MessageText />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainSection;
