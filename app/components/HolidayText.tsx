import { Holiday } from "@/models/models";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { DateTime as dt } from "luxon";

interface HolidayTextProps {
  holiday: Holiday;
  isOptional?: boolean;
}
const HolidayText = ({ holiday, isOptional = false }: HolidayTextProps) => {
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
    <>
      {isOptional && (
        <Typography
          variant="h5"
          mt={5}
          fontWeight="bold"
          {...(!isDesktop && { fontSize: "1.5rem" })}
        >
          Next optional holiday
        </Typography>
      )}
      <Typography
        variant={isOptional ? "h5" : "h4"}
        {...(isOptional && { fontSize: "1.25rem" })}
      >
        {`${holiday.name[0].text} on ${getHumanReadableDate(
          holiday.startDate
        )}`}
      </Typography>
      {holiday.subdivisions && (
        <Typography variant="body1" mt={1} fontWeight={500} color="#363032">
          {`(${getSubdivisionsText(holiday) ?? ""})`}
        </Typography>
      )}
    </>
  );
};

export default HolidayText;
