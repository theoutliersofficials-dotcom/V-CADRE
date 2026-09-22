export type HBlockFloor = {
  floorNumber: number;
  name: string;
};

export type ReferenceSpace = {
  name: string;
  department: string;
  verifiedFromPhoto: boolean;
};

export const hBlock = {
  name: "H Block",
  code: "H",
  totalFloors: 5,

  floors: [
    {
      floorNumber: 1,
      name: "Floor 1",
    },
    {
      floorNumber: 2,
      name: "Floor 2",
    },
    {
      floorNumber: 3,
      name: "Floor 3",
    },
    {
      floorNumber: 4,
      name: "Floor 4",
    },
    {
      floorNumber: 5,
      name: "Floor 5",
    },
  ] satisfies HBlockFloor[],

  referenceSpaces: [
    {
      name: "II Year CSE-B Class Room",
      department: "CSE",
      verifiedFromPhoto: true,
    },
    {
      name: "IV Year IT Class Room",
      department: "IT",
      verifiedFromPhoto: true,
    },
  ] satisfies ReferenceSpace[],
};