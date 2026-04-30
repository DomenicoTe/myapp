require('dotenv').config({ quiet: true });
const { program } = require('commander');
program.command('cicd')
    .description('Run the CI/CD pipeline')
    .action(() => {
        require('./cicd.js')()
    });
program.command('archive')
    .description('Create a release archive')
    .option('-p, --path <path>', 'Path to the directory to archive', 'dist/')
    .action((options) => {
        
        require('./archive.js')(options.path)
    });
program.command('store')
    .description('Run the plugin store')
    //Add options -a and --artifact
    .option('-a, --artifact <path>', 'Path to the artifact to upload')
    .action((options) => {
        console.log(`Archiving directory: ${JSON.stringify(options)}`);
        if(!options.artifact) {
            console.log('Error: Artifact path is required');
            process.exit(1);
        }
        require('./minio')(options.artifact)
    });

program.parse(process.argv);
if (!process.argv.slice(2).length) program.help();
