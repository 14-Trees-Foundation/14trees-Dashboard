export interface BirthdayResponse {
    hasBirthday: boolean;
    count: number;
    upcomingBirthdays: {
      id: number;
      name: string;
      birth_date: string;
      upcoming_date: string;
    }[];
    checkedDates: string[];
    checkedUserCount: number;
  }