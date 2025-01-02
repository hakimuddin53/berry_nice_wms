import { guid } from "types/guid";

export interface UomDetailsDto {
  id: guid;
  name: string;
  multiplier: number;
}
