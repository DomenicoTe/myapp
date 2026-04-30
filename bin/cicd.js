const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const pkg = require('../package.json');
const CWD = process.cwd();

module.exports = function() {
    console.log('Starting CI/CD pipeline...');
    // Step 1: NPM CI
    console.log('Installing dependencies with npm ci...');
    if (shell.exec('npm ci').code !== 0) {
        console.log('Error: npm ci failed');
        shell.exit(1);
    }
    // Step 2: Launch sonar-scanner
    console.log('Running sonar-scanner...');
    
    if (shell.exec('sonar-scanner').code !== 0) {
        console.log('Error: sonar-scanner failed');
        shell.exit(1);
    }
    // Step 3: Build the project
    console.log('Building the project with pkg...');
    if (shell.exec('npm run build').code !== 0) {
        console.log('Error: Build failed');
        shell.exit(1);
    }
    // Step 4: Create release archive
    const releaseName = `${pkg.name}-v${pkg.version}.zip`;
    console.log(`Creating release archive: ${releaseName}...`);
    if (shell.exec(`npm run archive -p ${CWD}/dist -o ${CWD}/${releaseName}`).code !== 0) {
        console.log('Error: Failed to create release archive');
        shell.exit(1);
    }
    // Step 5: Upload to MinIO
    console.log('Uploading release archive to MinIO...');
    if (shell.exec(`npm run store -a ${releaseName}`).code !== 0) {
        console.log('Error: Failed to upload release archive to MinIO');
        shell.exit(1);
    }
    // Cleanup: Remove the dist directory    
    console.log('Cleaning up local archive file...');
    if (fs.existsSync(`${CWD}/${releaseName}`)) {
        shell.rm(`${CWD}/${releaseName}`);
        console.log('Local archive file removed');
    }
    if (fs.existsSync(`${CWD}/dist`)) {
        shell.rm('-rf', `${CWD}/dist`);
        console.log('Dist directory removed');
    }
    // Final message
    console.log('CI/CD pipeline completed successfully!');
}