import { createPow } from '@textile/powergate-client';

export default class FFSStorage {
    private PowerGate = createPow({ host: process.env.NEXT_PUBLIC_POWERGATE_URL });

    constructor() {
        this.PowerGate.setToken(process.env.NEXT_PUBLIC_FFS_TOKEN);
    }

    async submitStorage(
        picture: any,
        title: string,
        description: string,
        category: string,
        url: string,
        callback: () => void
    ) {
        const _pictureStorageDeal = async () => {
            //const file = data.file.files[0];
            const file = picture;
            if (file === undefined) {
                return;
            }
            let buffer: Uint8Array;
            // NOTE(jim): A little hacky...
            const getByteArray = async () =>
                new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = function (e) {
                        if (e.target.readyState == FileReader.DONE) {
                            buffer = new Uint8Array(e.target.result as any);
                        }
                        resolve();
                    };
                    reader.readAsArrayBuffer(file);
                });
            await getByteArray();
            const { cid } = await this.PowerGate.ffs.stage(buffer);
            const { jobId } = await this.PowerGate.ffs.pushStorageConfig(cid);
            console.log(jobId);
            const cancel = this.PowerGate.ffs.watchJobs((job) => {
                console.log(job);
                // the status 5 means: deal finished
                this.PowerGate.ffs.get(job.cid).then(console.log);
                if (job.status === 5) {
                    cancel();
                }
            }, jobId);
            return cid;
        };

        // upload image first
        const pictureCid = await _pictureStorageDeal();
        // wait for image cid, generated json and upload it
        const jsonRent = {
            title,
            description,
            category,
            logo: pictureCid,
            url,
        };

        console.log(jsonRent);

        const { cid } = await this.PowerGate.ffs.stage(new Uint8Array(Buffer.from(JSON.stringify(jsonRent))));
        const { jobId } = await this.PowerGate.ffs.pushStorageConfig(cid);
        console.log(jobId);
        const cancel = this.PowerGate.ffs.watchJobs((job) => {
            console.log(job);
            // the status 5 means: deal finished
            this.PowerGate.ffs.get(job.cid).then(console.log);
            if (job.status === 5) {
                callback();
                cancel();
            }
        }, jobId);
        return cid;
    }

    async getStorage(cid: string) {
        return JSON.parse(new TextDecoder('utf-8').decode(await this.PowerGate.ffs.get(cid)));
    }
}
