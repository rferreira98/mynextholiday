import { Holiday, HolidayResponse, SubdivisionResponse } from "@/models/models";
import {
  Autocomplete,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import countryData from "country-data";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import COUNTRIES from "../utils/countries.json";
import { SUPPORTED_COUNTRIES } from "../utils/constants";

interface SearchInputProps {
  mandatoryHolidayHandler?: Dispatch<SetStateAction<Holiday | null>>;
  optionalHolidayHandler?: Dispatch<SetStateAction<Holiday | null>>;
}

const SearchInput = ({
  mandatoryHolidayHandler,
  optionalHolidayHandler,
}: SearchInputProps) => {
  const [code, setCode] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const [options] = useState(
    Object.keys(COUNTRIES)
      .flatMap((v) => v)
      .filter((country) => SUPPORTED_COUNTRIES.includes(country))
  );
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [didFirstLoad, setFirstLoad] = useState<boolean>(false);

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
            setFirstLoad(true);
          }
        }
      })
      .catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const getFormattedDate = (date: Date): string =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const findHoliday = async (val?: string) => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), 11, 31);
    const contextualCode = val
      ? countryData.lookup.countries({ name: val })[0].alpha2
      : code;
    const startDate = getFormattedDate(today);
    const endDate = getFormattedDate(lastDay);
    const response = await fetch(
      `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${contextualCode}&languageIsoCode=${contextualCode}&validFrom=${startDate}&validTo=${endDate}`
    );
    const nextHolidays: HolidayResponse[] = await response.json();
    const nextMandatoryHoliday: Holiday | undefined = nextHolidays.find(
      (holiday) => (holiday.quality ? holiday.quality === "Mandatory" : true)
    );
    const nextOptionalHoliday: Holiday | undefined = nextHolidays.find(
      (holiday) =>
        (holiday.quality ? holiday.quality === "Optional" : true) &&
        holiday.id !== nextMandatoryHoliday?.id
    );

    const subdivisionsResponse = await fetch(
      `https://openholidaysapi.org/Subdivisions?countryIsoCode=${contextualCode}&languageIsoCode=${contextualCode}`
    );
    const subdivisions: SubdivisionResponse[] =
      await subdivisionsResponse.json();

    if (nextMandatoryHoliday && mandatoryHolidayHandler) {
      if (nextMandatoryHoliday.subdivisions) {
        const codes = nextMandatoryHoliday.subdivisions.map((s) => s.code);
        nextMandatoryHoliday.subdivision = subdivisions
          .filter((sub) =>
            sub.children
              ? sub.children.find((child) => codes.includes(child.code))
              : codes.includes(sub.code)
          )
          .map((el) => el.name[0]);
      }
      mandatoryHolidayHandler(nextMandatoryHoliday);
    }

    if (nextOptionalHoliday && optionalHolidayHandler) {
      if (nextOptionalHoliday.subdivisions) {
        const codes = nextOptionalHoliday.subdivisions.map((s) => s.code);
        nextOptionalHoliday.subdivision = subdivisions
          .filter((sub) =>
            sub.children
              ? sub.children.find((child) => codes.includes(child.code))
              : codes.includes(sub.code)
          )
          .map((el) => el.name[0]);
      }
      optionalHolidayHandler(nextOptionalHoliday);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    if (value === inputValue) {
      didFirstLoad ? findHoliday(inputValue) : findHoliday();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
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
          inputProps={{
            ...params.inputProps,
            style: {
              ...params.inputProps.style,
              textAlign: "center",
              paddingRight: "35px",
            },
          }}
          InputProps={{
            ...params.InputProps,
            sx: {
              fontSize: !isDesktop ? "3rem" : 50,
              "& .MuiAutocomplete-endAdornment": {
                top: `calc(50% - ${!isDesktop ? "2rem" : "35px"})`,
                "& svg": {
                  fontSize: !isDesktop ? "2rem" : 40,
                },
              },
            },
          }}
          variant="standard"
          placeholder="Where are you?"
        />
      )}
    />
  );
};

export default SearchInput;
