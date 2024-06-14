import { Boundaries } from "./common";

export type PondUpdate = {
    date: Date,
    levelFt: number,
    user: string,
    images: [string]
  };
  
export type Pond = {
    key: number,
    id: number,
    name: string,
    tags: string[],
    type: string,
    boundaries: Boundaries,
    images: string[],
    length_ft: number,
    width_ft: number,
    depth_ft: number,
    created_at: Date,
    updated_at: Date,
};

export type PondsDataState = {
  totalPonds: number,
  ponds: Record<string, Pond>
}

export type PondHistoryDataState = Pond;