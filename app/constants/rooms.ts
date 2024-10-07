import { BaseEnum } from "@/app/constants/index"

enum Rooms {
  first = 1,
  second = 2,
  third = 3,
  fourth = 4,
  fifth = 5
}

type RoomsProperties = {
  id: number;
  capacity: number;
  label: string;
}

class RoomsEnum extends BaseEnum<any, any> {
  constructor() {
    super({
      [Rooms[1]]: {
        id: 1,
        label: "Pokoj 1",
        capacity: 4
      },
      [Rooms[2]]: {
        id: 2,
        label: "Pokoj 2",
        capacity: 2
      },
      [Rooms[3]]: {
        id: 3,
        label: "Pokoj 3",
        capacity: 4
      },
      [Rooms[4]]: {
        id: 4,
        label: "Pokoj 4",
        capacity: 4
      },
      [Rooms[5]]: {
        id: 5,
        label: "Pokoj 5",
        capacity: 6
      },
    })
  }
}

const roomsEnum = new RoomsEnum()
export { roomsEnum, type RoomsProperties, Rooms }
