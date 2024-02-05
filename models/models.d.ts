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

type Name = {
  language: string;
  text: string;
};

type ShortSubdivision = {
  code: string;
  shortName: string;
};

export interface HolidayResponse {
  id: string;
  startDate: string;
  endDate: string;
  type: HolidayType;
  quality?: "Mandatory" | "Optional";
  name: Name[];
  nationwide: boolean;
  subdivisions: ShortSubdivision[];
}

export type Holiday = HolidayResponse & {
  subdivision?: Name[];
};

export interface SubdivisionResponse {
  code: string;
  isoCode: string;
  shortName: string;
  category: Name[];
  name: Name[];
  children: SubdivisionResponse[];
  officialLanguages: string[];
}
