
export type PondUpdate = {
    date: Date,
    levelFt: number,
    user: string,
    images: [string]
  };
  
export type Pond = {
    key: string,
    _id: string,
    name: string,
    tags: [string],
    desc: string,
    type: string,
    boundaries: {
      type: string,
      coordinates: [[[number]]],
    },
    date_added: Date,
    images: [string],
    lengthFt: number,
    widthFt: number,
    depthFt: number,
    updates: [PondUpdate],
};

export type CreatePondResponse = {
  pond: Pond,
}

export type PondPaginationResponse = {
  total: number,
  result: Pond[]
}

export type PondsDataState = {
  totalPonds: number,
  ponds: Record<string, Pond>
}

export type PondHistoryDataState = Pond;