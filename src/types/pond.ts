import { Boundaries } from "./common";

export type PondWaterLevelUpdate = {
  key: number;
  id: number;
  level_ft: number;
  user_id?: number;
  pond_id: number;
  image: string | null;
  updated_at: Date;
};

export type Pond = {
  key: number,
  id: number,
  name: string,
  tags: string[],
  type: string,
  site_id: number,
  site_name: string,
  boundaries: Boundaries,
  images: string[],
  length_ft: number,
  width_ft: number,
  depth_ft: number,
  created_at: Date,
  updated_at: Date,
};

export type PondsDataState = {
  loading: boolean,
    totalPonds: number,
    ponds: Record<number, Pond>,
    paginationMapping: Record<number, number>,
}

export type PondWaterLevelUpdatesDataState = {
  totalPondWaterLevelUpdates: number,
  pondWaterLevelUpdates: Record<number, PondWaterLevelUpdate>
}