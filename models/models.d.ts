export enum HolidayType {
  Public,
  Bank,
  National,
  Regional,
  Local,
  School,
  BackToSchool,
  EndOfLessons,
}

type HolidayName = {
  language: string;
  text: string;
};

export interface HolidayResponse {
  id: string;
  startDate: string;
  endDate: string;
  type: HolidayType;
  quality: "Mandatory" | "Optional";
  name: HolidayName[];
  nationwide: boolean;
}
