const fs = require('fs');
const minio = require('minio');
const mimes = require('mime-types');
const policy = require('./policy.json');

class MinIO {
    #client;
    #bucket;
    #publicUrl;

    constructor() {
        if (MinIO.instance) return MinIO.instance;
        MinIO.instance = this;
    }

    async connect({ options, bucket, url }) {
        if (!options) throw new Error('MinIO options required');
        if (!bucket) throw new Error('MinIO bucket required');
        
        this.#bucket = bucket;
        this.#publicUrl = url; // es: http://s3.example.com

        this.#client = new minio.Client(options);

        const exists = await this.#client.bucketExists(bucket).catch(() => false);
        if (!exists) {
            console.log(`Bucket ${bucket} not found, creating`);
            await this.#client.makeBucket(bucket, 'us-east-1');
        }

        // Policy pubblica
        await this.#client.setBucketPolicy(
            bucket,
            JSON.stringify(policy).replace('!bucket!', bucket)
        );

        console.log(`MinIO connected to bucket ${bucket}`);
    }

    async upload(local, remote) {
        if (!this.#client) throw new Error('MinIO not connected');
        if (!local || !remote) throw new Error('Local and remote paths required');

        await fs.promises.access(local);

        const mime = mimes.lookup(local) || 'application/octet-stream';

        await this.#client.fPutObject(
            this.#bucket,
            remote,
            local,
            { 'Content-Type': mime }
        );

        console.log(`Uploaded ${local} -> ${remote}`);

        return {
            link: this.#publicUrl
                ? `${this.#publicUrl}/${this.#bucket}/${remote}`
                : remote,
            mimeType: mime
        }
    }

    async download(remote, local) {
        if (!this.#client) throw new Error('MinIO not connected');
        if (!remote || !local) throw new Error('Remote and local paths required');

        await this.#client.fGetObject(this.#bucket, remote, local);

        console.log(`Downloaded ${remote} -> ${local}`);
        return local;
    }

    async delete(remote) {
        if (!this.#client) throw new Error('MinIO not connected');
        if (!remote) throw new Error('Remote path required');
        try {
            await this.#client.removeObject(this.#bucket, remote);

            console.log(`Deleted ${remote}`);
            return true;
        }
        catch (e) { 
            console.log(`Failed: Deleting ${remote}`)
            return false
        }
    }

    async list(prefix = '') {
        if (!this.#client) throw new Error('MinIO not connected');

        return new Promise((resolve, reject) => {
            const objects = [];
            const stream = this.#client.listObjects(
                this.#bucket,
                prefix,
                true
            );

            stream.on('data', obj => objects.push(obj));
            stream.on('error', reject);
            stream.on('end', () => resolve(objects));
        });
    }
}

module.exports = new MinIO();
