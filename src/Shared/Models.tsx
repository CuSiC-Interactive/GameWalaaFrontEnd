export interface gamesModel {
  Name: string;
  GameId: number;
  Price: GamePrice;
  Thumbnail: string;
}

interface PriceByTime {
  Time: number;
  Price: number;
}

interface PriceByLevel {
  Level: number;
  Price: number;
}

interface GamePrice {
  ByTime: PriceByTime[] | null;
  ByLevel: PriceByLevel[] | null;
}
