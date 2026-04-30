const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

module.exports = function (dirPath = 'dist/', outputFile) {
	// Se chiamato da CLI, outputFile può essere undefined
	const pkg = require('../package.json');
	const outName = outputFile || `${pkg.name}-v${pkg.version}.zip`;
	console.log(`Creating archive ${outName} from ${dirPath} ...`);

	if (!fs.existsSync(dirPath)) {
		console.log(`Error: directory ${dirPath} does not exist.`);
		process.exit(1);
	}

	const output = fs.createWriteStream(outName);
	const archive = archiver('zip', { zlib: { level: 9 } });

	output.on('close', function() {
		console.log(`Archive ${outName} created (${archive.pointer()} bytes)`);
		process.exit(0);
	});
	archive.on('error', function(err) {
		console.log('Error: Failed to create archive');
		console.log(err.message);
		process.exit(1);
	});
	archive.pipe(output);
	archive.directory(dirPath, false);
	archive.finalize();
};
