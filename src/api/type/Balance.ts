export type SpaceBalance = {
    // {"address": "1C2XjqoXHRegJNnmJqGDMt3rbAcrYLX4L9", "confirmed": 17190, "unconfirmed": 0}
    address: string;
    confirmed: number;
    unconfirmed: number;
  };



  export class ShowBalance{
    spaceBalance:string="";
    spaceAssert:string="";
    btcBalance:string="";
    btcAssert:string="";
    sumAssert:string="";
  }