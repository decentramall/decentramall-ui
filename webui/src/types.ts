
interface ISpace {
    buyer: string;
    price: string;
    tokenId: string;
};

export interface IUser {
    space: ISpace | undefined;
    rent: string;
}

export interface IChainContext {
    spaces: string[];
    rents: string[];
    user: IUser;
}