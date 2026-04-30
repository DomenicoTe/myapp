const fs = require('fs');
const packagesDIR = "./packages";
const packagesSUB = fs.readdirSync(packagesDIR).filter(f => fs.statSync(`${packagesDIR}/${f}`).isDirectory());
const packagesPKG = packagesSUB.map(pack => {
    let pkgPath = `${packagesDIR}/${pack}/package.json`;
    if(fs.existsSync(pkgPath)) {
        let pkg = JSON.parse(fs.readFileSync(pkgPath));
        return { name: pkg.name, version: pkg.version}
    }
    return null;
}).filter(pkg => pkg !== null);

let package = JSON.parse(fs.readFileSync('./package.json', "utf-8"));
if(packagesPKG.length === 0) {
    console.log("No packages found in packages directory.");
    process.exit(0);
}
packagesPKG.forEach(pack => {
    if(package.devDependencies[pack.name]) {
        console.log(`Package ${pack.name} already exists in package.json devDependencies.`);
        if(package.devDependencies[pack.name] !== pack.version) {
            console.log(`Version mismatch for ${pack.name}: package.json has ${package.devDependencies[pack.name]}, but package version is ${pack.version}. Consider updating package.json.`);
            package.devDependencies[pack.name] = pack.version; // Aggiorna alla versione del package
        }
    } else {
        console.log(`Adding package ${pack.name} version ${pack.version} to package.json devDependencies.`);
        package.devDependencies[pack.name] = pack.version;
    }
});
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
console.log("packages have been added to package.json devDependencies.");
console.log(JSON.parse(fs.readFileSync('./package.json', "utf-8"), null, 2));