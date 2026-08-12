export interface gamesModel {
  Name: string;
  GameId: number;
  Price: GamePrice;
  Thumbnail: string;
}

export interface PriceByTime {
  Time: number;
  Price: number;
}

export interface PriceByLevel {
  Level: number;
  Price: number;
}

export interface GamePrice {
  ByTime: PriceByTime[] | null;
  ByLevel: PriceByLevel[] | null;
}

// Shape submitted by the GameTile form. Every field comes from a form input,
// so gameId arrives as a string even though the underlying game id is numeric.
export interface GamePaymentData {
  gameName: string;
  gameId: string;
  selectedPrice: string;
}
