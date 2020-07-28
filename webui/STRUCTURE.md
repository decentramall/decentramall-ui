# ipfs and filecoin
As we will use to save our content for SPACE tokens, important to understand some basic mechanisms. To get started, here's a video if [How Filecoin Works: an in-depth system overview](https://www.youtube.com/watch?v=P28aNAdZDi4). It important to now, that, filecoin uses IPFS and therefore it is important to understand it as well. A good starting point is [IPFS basics + tools](https://www.youtube.com/watch?v=ldEDa6_CT7k). [Developing on Filecoin](https://www.youtube.com/watch?v=aGCpq0Xf-w8) is a must watch.

# powergate
After understanding the above concepts, the next step is to get a hands on on powergate. It will help us connect to filecoin. At the moment of writing, powergate helps connecting to ipfs, filecoin lotus testnet, alowing to very easily add and manage files on filecoin network. For a quick intro, watch [Getting started with Filecoin](https://www.youtube.com/watch?v=SePJrCLUM0g).

Once we understand this mechanisms, [Building an App with Filecoin from scratch - using Slate Components & Powergate](https://www.youtube.com/watch?v=FJjPMKRy8xQ) is a good starting point to get hands on code. After going though this tutorial, you are all set. We will not use the slate components, but they are great to help understand some of the mechanisms.

Further documentation for powergate js, can be found [here](https://textileio.github.io/js-powergate-client/globals.html).

See [here](https://textileio.github.io/js-powergate-client/interfaces/_node_modules__textile_grpc_powergate_client_dist_ffs_rpc_rpc_pb_d_.jobstatusmap.html) the job status when making a storage deal.

# important notes
**question**: Hi guys, I have a question. I might have misunderstood this. A user pays to store data on filecoin. And then pays to get it back? Like everytime I make a request I have to pay?<br/>
**answer**: Yeah there’s a Retrieval Market where Retrieval Miners fetch the data from Storage Miners. Currently it’s a basic MVP but it will evolve so that Retrieval Miners can compete on price, performance, location, caching popular content, etc. It allows Retrieval miners with high-bandwidth and great network locality to excel at this. An analogy is [S3's Requester Pays Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/RequesterPaysBuckets.html).

**question**: hi team,
quick question; I'm following @cake’s tutorial(Building an App with Filecoin from scratch - using Slate Components & Powergate) to integrate filecoin to our Dapp. He's using a local instance of powergate and it seems that for each new address created, the balance is non zero. I prefer not to use a local powergate instance if possible so I'm trying Textile's online instance:
```
http://pow.slate.textile.io:6002
```
I manage to connect, get a token and create addresses properly but they all have 0 balance so I can't upload files. Am I doing anything wrong? Is there a faucet for that network?<br/>
**answer**: This is being addressed in fil-help https://filecoinproject.slack.com/archives/CEGN061C5/p1595593045107100 

**question**: I upgraded my powergate-client package and I notice that addToHot method in FFS no longer exists (as per documentation: https://textileio.github.io/js-powergate-client/interfaces/ffs.html). So now the correct method to add a file to FFS would be first to call ffs.stage and then ffs.pushStorageConfig ?<br/>
**answer**: yes, correct

**question**: Hi I am wondering if I push a file using one ffs instance, can I get the same file using another instance?
So essentially I do:
```
pow ffs addToHot <file> -t <token-1>
pow ffs push -t <token-1>
pow ffs get <cid> <output-path> -t <token-2>
```
If not, is there a way to work around this?<br/>
**answer**: currently data stored with one ffs instance is only available to that instance, no others. you'll get an error about the data not being stored. the only work around currently is to store the data twice, once in each instance. we can consider adding some new functionality in the future. mind creating an issue in the powegate repo and we can discuss there?

**question**: In my case, I see Currently, the returned auth token is the only thing that gives you access to your FFS instance at a later time, so be sure to save it securely. so it's correct. I'm now wondering, if I lose this token, do I enterily loose access to what I've uploaded?<br/>
**answer**: it sounds like you're not saving off your ffs token and are creating a new one every time the page reloads. this would be a problem. if you want access to the same ffs instance, you really need to save off that token and reuse it

# smart-contracts
The smart contracts must save a URI, like the ERC721Metadata from openzeppelin, in order to save the cid from filecoin. This is explained more in-depth [here](https://docs.opensea.io/docs/metadata-standards).

# nextjs fetch data once
Data is fetched only once, in *_app.tsx*, and the made available everywhere in the app, using context. Se [hete](https://stackoverflow.com/a/61131312/3348623).