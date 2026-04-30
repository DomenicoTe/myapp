const Minio = require("./client")
const options = require("./options.json")
module.exports = async (artifact) => {
    await Minio.connect(options);
    let info = await Minio.upload(artifact, `artifacts/${artifact}`);
    console.log('Artifact uploaded to MinIO:', info.link);
};