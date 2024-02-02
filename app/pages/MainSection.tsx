"use client";

import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DateTime as dt } from "luxon";
import { useState } from "react";
import { Holiday } from "../../models/models";
import Divider from "../components/Divider";
import SearchInput from "../components/SearchInput";

const MainSection = () => {
  const [nextMandatoryHoliday, setNextMandatoryHoliday] =
    useState<Holiday | null>(null);
  const [nextOptionalHoliday, setNextOptionalHoliday] =
    useState<Holiday | null>(null);

  //breakpoints
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const getSubdivisionsText = (holiday: Holiday): string | undefined => {
    const string = holiday.subdivision?.reduce(
      (accumulator, currentValue) => accumulator + `${currentValue.text}, `,
      ""
    );
    return string?.substring(0, string.length - 2);
  };

  const getHumanReadableDate = (date: string): string =>
    dt.fromISO(date).toLocaleString(dt.DATE_MED_WITH_WEEKDAY);

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
              <Typography variant="h4">
                {`${
                  nextMandatoryHoliday.name[0].text
                } on ${getHumanReadableDate(nextMandatoryHoliday.startDate)}`}
              </Typography>
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
              <Typography
                variant="h5"
                mt={5}
                fontWeight="bold"
                {...(!isDesktop && { fontSize: "1.5rem" })}
              >
                Next optional holiday
              </Typography>
              <Typography variant="h5" fontSize="1.25rem">
                {`${nextOptionalHoliday.name[0].text} on ${getHumanReadableDate(
                  nextOptionalHoliday.startDate
                )}`}
              </Typography>
              <Typography
                variant="body1"
                mt={1}
                fontWeight={500}
                color="#363032"
              >
                {`(${getSubdivisionsText(nextOptionalHoliday) ?? ""})`}
              </Typography>
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
              <Typography variant="h4">
                There&apos;s no more holidays this year.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainSection;
