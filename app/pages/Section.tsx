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

const Section = () => {
  const [options, setOptions] = useState(
    Object.keys(COUNTRIES).flatMap((v) => v)
  );
  const [code, setCode] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);

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

  const findHoliday = () => {};

  return (
    <Grid container gap={5}>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h1">Find my next holiday</Typography>
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
    </Grid>
  );
};

export default Section;
