
export interface ISpace {
    buyer: string;
    price: string;
    tokenId: string;
};

export interface IUser {
    space: ISpace | undefined;
    rent: string;
}

export interface IChainContext {
    spaces: ISpace[];
    rents: string[];
    user: IUser;
}