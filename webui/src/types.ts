import { ethers } from "ethers";
import {
    DecentramallTokenInstance,
    EstateAgentInstance,
    RentalAgentInstance,
} from '../../smart-contracts/types/truffle-contracts/index';

export interface IRent {
    title: string;
    description: string;
    category: string;
    logo: string;
    url: string;
    //
    // rightfulOwner: string;
    rentedTo: string;
    rentalEarned: string;
    expiryBlock: string;
};

export interface ISpace {
    buyer: string;
    price: string;
    tokenId: string;
    rent?: IRent;
};

// each space has only one rent, but a user, can have a space (rented or not) and can be renting a space to someone else
export interface IUser {
    signer?: ethers.Signer;
    space?: ISpace;
    rent?: IRent;
}

export interface IChainContext {
    spaces: ISpace[];
    user: IUser;
    decentramallTokenInstance: ethers.Contract & DecentramallTokenInstance | undefined;
    estateAgentInstance: ethers.Contract & EstateAgentInstance | undefined;
    rentalAgentInstance: ethers.Contract & RentalAgentInstance | undefined;
}