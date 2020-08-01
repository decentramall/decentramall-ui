import DecentramallTokenJSON from './abi/DecentramallToken.json';
import EstateAgentJSON from './abi/EstateAgent.json';
import RentalAgentJSON from './abi/RentalAgent.json';
import {
    DecentramallTokenInstance,
    EstateAgentInstance,
    RentalAgentInstance,
} from './types/index';
import { ethers } from 'ethers';
import { createPow } from '@textile/powergate-client';
import { IRent } from '../types';


const provider = new ethers.providers.Web3Provider((window as any).ethereum);

const decentramallTokenInstance = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_DECENTRAMALL_TOKEN,
    DecentramallTokenJSON,
    provider,
) as ethers.Contract & DecentramallTokenInstance;

const estateAgentInstance = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ESTATE_AGENT,
    EstateAgentJSON,
    provider,
) as ethers.Contract & EstateAgentInstance;

const rentalAgentInstance = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_RENTAL_AGENT,
    RentalAgentJSON,
    provider,
) as ethers.Contract & RentalAgentInstance;

const loadSpaces = async (signer: ethers.Signer) => {
    let userRent;
    let userSpace;
    let spaces = [];
    const signerAddress = await signer.getAddress();
    const totalTokens = await decentramallTokenInstance.totalSupply();
    if (totalTokens.toNumber() > 0) {
        const PowerGate = createPow({ host: process.env.NEXT_PUBLIC_POWERGATE_URL })
        PowerGate.setToken(process.env.NEXT_PUBLIC_FFS_TOKEN)

        const mapSpace = async (logArgs: any) => {
            const tokenId = logArgs.tokenId.toString();
            const rentCid = await decentramallTokenInstance.tokenURI(tokenId);
            let rent: IRent;
            if (rentCid.length > 0) {
                const spaceInfo = await rentalAgentInstance.spaceInfo(tokenId);
                rent = JSON.parse(new TextDecoder("utf-8").decode((await PowerGate.ffs.get(rentCid))));
                rent = {
                    ...rent,
                    // rightfulOwner: spaceInfo[0]
                    rentedTo: spaceInfo[1].toString(),
                    rentalEarned: spaceInfo[2].toString(),
                    expiryBlock: spaceInfo[3].toString(),
                }
                // add user rent here
                if (spaceInfo[1].toString() === signerAddress) {
                    userRent = rent;
                }
            }
            return {
                buyer: logArgs.buyer.toString(),
                price: logArgs.price.toString(),
                tokenId,
                rent
            }
        }
        const ifaceEstateAgent = new ethers.utils.Interface(EstateAgentJSON);
        const logsEstateAgent = await provider.getLogs({
            address: process.env.NEXT_PUBLIC_CONTRACT_ESTATE_AGENT,
            fromBlock: 0,
            toBlock: 'latest',
            topics: [[
                ethers.utils.id('BuyToken(address,uint256,uint256)'),
            ]]
        });

        if (logsEstateAgent.length > 0) {
            for (let x = 0; x < logsEstateAgent.length; x += 1) {
                spaces.push((await mapSpace(ifaceEstateAgent.parseLog(logsEstateAgent[x]).args)));
            }
            userSpace = spaces.find((s) => s.buyer === signerAddress);
            console.log('mappedSpace', spaces);
        }
    }
    return {
        userSpace,
        userRent,
        spaces,
    }
}

export {
    decentramallTokenInstance,
    estateAgentInstance,
    rentalAgentInstance,
    loadSpaces,
}