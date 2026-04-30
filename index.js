require('dotenv').config({ quiet: true });
const config = require('./config.js');
const projectPKG = require('./package.json');
const debug = require('@myapp/debug')('main');
const error = debug.extend("error")
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

debug(`Starting ${projectPKG.name} version ${projectPKG.version}...`);
debug(`Plugins to load: ${config.plugins.length > 0 ? config.plugins.join(', ') : 'none'}`);
app.use((req, res, next) => {
    debug(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// Carica tutti i moduli
Object.keys(projectPKG.dependencies).forEach(dep => {
    if(dep.startsWith(`@${projectPKG.name}/module_`)) {
        debug(`Loading module: ${dep}`);
        let route = `/${dep.replace(`@${projectPKG.name}/module_`, '')}`;
        app.use(route, require(dep));
    }
});

// Carica solo i plugin indicizzati
if(config.plugins.length === 0) {
    let plugin = `@${projectPKG.name}/plugin_hello`;
    debug(`Loading default plugin: ${plugin}`);
    app.use("/hello", require(plugin));
} else {
    config.plugins.forEach(dep => {
        if(dep.startsWith(`@${projectPKG.name}/plugin_`) && projectPKG.dependencies[dep]) {
            debug(`Loading plugin: ${dep}`);
            let route = `/${dep.replace(`@${projectPKG.name}/plugin_`, '')}`;
            app.use(route, require(dep));
        } else if (!projectPKG.dependencies[dep]) {
            error(`Plugin ${dep} not found in package.json dependencies!`);
        }
    });
}
app.listen(config.port, "0.0.0.0",  () => {
    debug(`Server is running on port ${config.port}`);
});
process.on('SIGINT', () => {
    debug('Shutting down server...');
    process.exit();
});
process.on('SIGTERM', () => {
    debug('Shutting down server...');
    process.exit();
});
