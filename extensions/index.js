const fs = require('fs');
const addonsDIR = "./addONs";
const addonsSUB = fs.readdirSync(addonsDIR).filter(f => fs.statSync(`${addonsDIR}/${f}`).isDirectory());
const addonsPKG = addonsSUB.map(addon => {
    let pkgPath = `${addonsDIR}/${addon}/package.json`;
    if(fs.existsSync(pkgPath)) {
        let pkg = JSON.parse(fs.readFileSync(pkgPath));
        return { name: pkg.name, version: pkg.version}
    }
    return null;
}).filter(pkg => pkg !== null);

let projectPKG = JSON.parse(fs.readFileSync('./package.json', "utf-8"));
if(addonsPKG.length === 0) {
    console.log("No addONs found in addONs directory.");
    process.exit(0);
}
addonsPKG.forEach(addon => {
    if(projectPKG.dependencies[addon.name]) {
        console.log(`addON ${addon.name} already exists in package.json dependencies.`);
        if(projectPKG.dependencies[addon.name] !== addon.version) {
            console.log(`Version mismatch for ${addon.name}: package.json has ${projectPKG.dependencies[addon.name]}, but addON version is ${addon.version}. Consider updating package.json.`);
            projectPKG.dependencies[addon.name] = addon.version; // Aggiorna alla versione dell'addON
        }
    } else {
        console.log(`Adding addON ${addon.name} version ${addon.version} to package.json dependencies.`);
        projectPKG.dependencies[addon.name] = addon.version;
    }
});
fs.writeFileSync('./package.json', JSON.stringify(projectPKG, null, 2));
console.log("addONs have been added to package.json dependencies.");
console.log(JSON.parse(fs.readFileSync('./package.json', "utf-8"), null, 2));