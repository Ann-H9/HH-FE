export interface Vacancy {
  id: string;
  name: string;
  salary?: {
    from?: number;
    to?: number;
    currency?: string;
  };
  experience: {
    name: string;
  };
  schedule: {
    id: string;
    name: string;
  };
  employer: {
    name: string;
  };
  area: {
    name: string;
  };
  url: string;
}
