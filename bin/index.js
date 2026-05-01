require('dotenv').config({ quiet: true });
const shell = require('shelljs');
const { program } = require('commander');
program.command('post-release')
    .description('Run post-release tasks')
    .action(() => {
        shell.echo('Running post-release tasks...');
        shell.rm('-rf', 'dist');
        shell.rm('-rf', '*.tgz');
        shell.echo('Post-release tasks completed successfully!');
    });
program.parse(process.argv);
if (!process.argv.slice(2).length) program.help();
