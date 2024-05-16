export type Room = {
  name: string;
  players: string[];
  started: boolean;
  recipe: Recipe;
};

export type Player = {
  playerID: string;
  seat: number;
};

export type HandCount = {
  hiddent: number;
  shown: Card[];
};

export type Recipe = {
  name: string;
  description: string;
  min_players: number;
  max_players: number;
  duration: number;
  cards: [Card, string][];
  available: boolean;
};

export type Card = {
  name: string;
  description: string;
};

export type RoomEvent =
  | { event: "joined"; player: string; player_list: Player[] }
  | { event: "left"; player: string; player_list: Player[] }
  | { event: "started" }
  | { event: "room_state"; player_list: Player[]; recipe: Recipe }
  | { event: "information"; information: string }
  | { event: "error"; error: string }
  | { event: "new_turn"; player: string }
  | { event: "winner"; player: string }
  | { event: "died"; player: string }
  | { event: "hand"; player_hand: Card[] }
  | { event: "piles"; draw_size: number }
  | { event: "players_hands"; hands: [string, HandCount][] }
  | { event: "draw_card"; card: Card }
  | { event: "play_card"; card: Card }
  | { event: "target_player"; players: string[] }
  | { event: "bury_card"; card?: Card; min: number; max: number }
  | { event: "choose_card"; cards: Card[] }
  | { event: "garbage_collection" }
  | { event: "alter_the_future"; next_cards: Card[] }
  | { event: "see_the_future"; cards: Card[] };

export type Bury = { min: number; max: number; card?: Card };
