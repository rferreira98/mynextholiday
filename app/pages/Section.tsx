"use client";

import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import COUNTRIES from "../countries.json";
import countryData from "country-data";
import { HolidayResponse } from "../../models/models";

const Section = () => {
  const [options, setOptions] = useState(
    Object.keys(COUNTRIES).flatMap((v) => v)
  );
  const [code, setCode] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const [nextMandatoryHoliday, setNextMandatoryHoliday] =
    useState<HolidayResponse | null>(null);
  const [nextOptionalHoliday, setNextOptionalHoliday] =
    useState<HolidayResponse | null>(null);

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
    const nextMandatoryHoliday: HolidayResponse | undefined = nextHolidays.find(
      (holiday) => holiday.quality === "Mandatory"
    );
    const nextOptionalHoliday: HolidayResponse | undefined = nextHolidays.find(
      (holiday) => holiday.quality === "Optional"
    );
    if (nextMandatoryHoliday) setNextMandatoryHoliday(nextMandatoryHoliday);
    if (nextOptionalHoliday) setNextMandatoryHoliday(nextOptionalHoliday);
  };

  return (
    <Grid container gap={5}>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h1" textAlign="center">
          Find my next holiday
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          freeSolo
          value={value}
          onChange={(event: any, newValue: string | null) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              sx={{
                "& fieldset": {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
              {...params}
              label="Location"
            />
          )}
        />
        <Button
          variant="contained"
          disabled={inputValue !== value}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: "100%",
          }}
          onClick={findHoliday}
        >
          Find holiday
        </Button>
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
            {`${nextMandatoryHoliday.name[0].text} on ${nextMandatoryHoliday.startDate}`}
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
        >
          <Typography variant="h3">Next optional holiday</Typography>
          <Typography variant="h4">
            {`${nextOptionalHoliday.name[0].text} on ${nextOptionalHoliday.startDate}`}
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
  );
};

export default Section;
