"use client";

import {
  Autocomplete,
  Divider,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import countryData from "country-data";
import { SyntheticEvent, useEffect, useState } from "react";
import {
  Holiday,
  HolidayResponse,
  SubdivisionResponse,
} from "../../models/models";
import COUNTRIES from "../countries.json";
import { DateTime as dt } from "luxon";

const Section = () => {
  const [options] = useState(Object.keys(COUNTRIES).flatMap((v) => v));
  const [code, setCode] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const [nextMandatoryHoliday, setNextMandatoryHoliday] =
    useState<Holiday | null>(null);
  const [nextOptionalHoliday, setNextOptionalHoliday] =
    useState<Holiday | null>(null);

  //breakpoints
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    const fetchInfo = async () => {
      const r = await fetch("https://api.country.is/");
      return r.json();
    };
    fetchInfo()
      .then((info) => {
        if (info.country) {
          if (options.includes(countryData.countries[info.country].name)) {
            setCode(info.country);
            setValue(countryData.countries[info.country].name);
          }
        }
      })
      .catch();
  }, [options]);
  // console.log("subs", subdivisions);
  const getFormattedDate = (date: Date): string =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const findHoliday = async () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), 11, 31);

    const startDate = getFormattedDate(today);
    const endDate = getFormattedDate(lastDay);
    const response = await fetch(
      `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${code}&languageIsoCode=${code}&validFrom=${startDate}&validTo=${endDate}`
    );
    const nextHolidays: HolidayResponse[] = await response.json();
    const nextMandatoryHoliday: Holiday | undefined = nextHolidays.find(
      (holiday) => holiday.quality === "Mandatory"
    );
    const nextOptionalHoliday: Holiday | undefined = nextHolidays.find(
      (holiday) => holiday.quality === "Optional"
    );

    const subdivisionsResponse = await fetch(
      `https://openholidaysapi.org/Subdivisions?countryIsoCode=${code}&languageIsoCode=${code}`
    );
    const subdivisions: SubdivisionResponse[] =
      await subdivisionsResponse.json();

    if (nextMandatoryHoliday) {
      if (nextMandatoryHoliday.subdivisions) {
        nextMandatoryHoliday.subdivision = subdivisions
          .filter(
            (sub) =>
              !!nextMandatoryHoliday.subdivisions.find(
                (s) => s.code === sub.code
              )
          )
          .map((el) => el.name[0]);
      }
      setNextMandatoryHoliday(nextMandatoryHoliday);
    }

    if (nextOptionalHoliday) {
      if (nextOptionalHoliday.subdivisions) {
        const codes = nextOptionalHoliday.subdivisions.map((s) => s.code);
        debugger;
        nextOptionalHoliday.subdivision = subdivisions
          .filter((sub) =>
            sub.children.find((child) => codes.includes(child.code))
          )
          .map((el) => el.name[0]);
      }
      setNextOptionalHoliday(nextOptionalHoliday);
    }
  };

  useEffect(() => {
    if (value === inputValue) {
      findHoliday();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inputValue]);

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
    <Grid container height={`calc(100vh - ${!isDesktop ? "4rem" : "12rem"})`}>
      <Grid item xs={12} display="flex" alignItems="center">
        <Grid container gap={2} textAlign="center">
          <Grid
            item
            xs={12}
            my={!isDesktop ? 2 : 15}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              freeSolo
              value={value}
              onChange={(
                _event: SyntheticEvent<Element, Event>,
                newValue: string | null
              ) => {
                setValue(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(
                _event: SyntheticEvent<Element, Event>,
                newInputValue
              ) => {
                setInputValue(newInputValue);
              }}
              options={options}
              sx={{ width: !isDesktop ? 400 : "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    "& fieldset": {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      fontSize: !isDesktop ? "3rem" : 50,
                      "& .MuiAutocomplete-endAdornment": {
                        top: `calc(50% - ${!isDesktop ? "2rem" : "25px"})`,
                        "& svg": {
                          fontSize: !isDesktop ? "3rem" : 50,
                        },
                      },
                    },
                  }}
                  variant="standard"
                  placeholder="Where are you?"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} my={3}>
            <Divider color="#000000" />
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

export default Section;
