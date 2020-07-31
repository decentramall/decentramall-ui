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
};

export interface ISpace {
    buyer: string;
    price: string;
    tokenId: string;
    rent?: IRent;
};

export interface IUser {
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