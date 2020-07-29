
export interface ISpace {
    buyer: string;
    price: string;
    tokenId: string;
};

export interface IRent {
    title: string;
    description: string;
    category: string;
    logo: string;
    url: string;
};

export interface IUser {
    space: ISpace | undefined;
    rent: IRent | undefined;
}

export interface IChainContext {
    spaces: ISpace[];
    rents: IRent[];
    user: IUser;
}