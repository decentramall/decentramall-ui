import { createPow } from '@textile/powergate-client'
import React, { useEffect, useState } from 'react'
import { CreateFilecoinStorageDeal } from 'slate-react-system';
import { Button, Input, makeStyles, TextField, CircularProgress } from '@material-ui/core';


export default function Rent() {
    const classes = useStyles();
    let PowerGate = null

    const [picture, setPicture] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [url, setUrl] = useState('');
    
    const [pictureDealInProgress, setPictureDealInProgress] = useState(false);
    const [jsonDealInProgress, setJSONDealInProgress] = useState(false);


    useEffect(() => {
        PowerGate = createPow({ host: process.env.NEXT_PUBLIC_POWERGATE_URL })
        PowerGate.setToken(process.env.NEXT_PUBLIC_FFS_TOKEN)
        // TODO: chack if user has rented space
    });

    const handleSubmitNewRent = async () => {
        // TODO: verify fields
        // TODO: upload image first
        // TODO: wait for image cid, generated json and upload it
        // TODO: wait for json cid, and add it to the tokenURI
        const pictureCid = await _pictureStorageDeal();
        const jsonRent = {
            title,
            description,
            category,
            logo: pictureCid,
            url,
        }


        console.log(jsonRent);

        const { cid } = await PowerGate.ffs.stage(new Uint8Array(Buffer.from(JSON.stringify(jsonRent))));
        const { jobId } = await PowerGate.ffs.pushStorageConfig(cid);
        console.log(jobId);
        setJSONDealInProgress(true);
        const cancel = PowerGate.ffs.watchJobs((job) => {
            console.log(job);
            // the status 5 means: deal finished
            PowerGate.ffs.get(job.cid).then(console.log);
            if (job.status === 5) {
                setJSONDealInProgress(false);
                cancel();
            }
        }, jobId);
    }

    const _getId = async () => {
        // console.log(await PowerGate.ffs.get(this.state.cid));
        console.log(await PowerGate.ffs.showAll());
    }

    const _pictureStorageDeal = async () => {
        //const file = data.file.files[0];
        const file = picture;
        if (file === undefined) {
            return;
        }
        var buffer = [];
        // NOTE(jim): A little hacky...
        const getByteArray = async () =>
            new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = function (e) {
                    if (e.target.readyState == FileReader.DONE) {
                        buffer = new Uint8Array(e.target.result as any) as any;
                    }
                    resolve();
                };
                reader.readAsArrayBuffer(file);
            });
        await getByteArray();
        const { cid } = await PowerGate.ffs.stage(buffer);
        const { jobId } = await PowerGate.ffs.pushStorageConfig(cid);
        console.log(jobId);
        setPictureDealInProgress(true);
        const cancel = PowerGate.ffs.watchJobs((job) => {
            console.log(job);
            // the status 5 means: deal finished
            PowerGate.ffs.get(job.cid).then(console.log);
            if (job.status === 5) {
                setPictureDealInProgress(false);
                cancel();
            }
        }, jobId);
        return cid;
    }

    const selectImage = (event: React.ChangeEvent<any>) => {
        setPicture(event.target.files[0]);
    }

    const handleChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        switch (event.target.name) {
            case 'title':
                setTitle(event.target.value);
                break;
            case 'description':
                setDescription(event.target.value);
                break;
            case 'category':
                setCategory(event.target.value);
                break;
            case 'url':
                setUrl(event.target.value);
                break;
        }
    }

    // TODO: if valid rent space get
    return (
        <>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField label="Title" name="title" value={title} onChange={handleChangeInput} />
                <TextField label="Description" name="description" value={description} onChange={handleChangeInput} />
                <TextField label="Category" name="category" value={category} onChange={handleChangeInput} />
                <TextField label="URL" name="url" value={url} onChange={handleChangeInput} />
                <Input type="file" onChange={selectImage} />
            </form>
            <br />
            {/* <CreateFilecoinStorageDeal onSubmit={this._handleSubmit} /> */}
            <Button onClick={handleSubmitNewRent}>Submit</Button>
            {/* <Button onClick={_getId}>Get</Button> */}
            {(pictureDealInProgress || jsonDealInProgress) && <CircularProgress />}
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
        width: '250px',
    },
}))
