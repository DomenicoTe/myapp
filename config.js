const Joi = require('joi');
const schema = Joi.object({
    PORT: Joi.number().default(3000),
    PLUGINS: Joi.string().default(""),
}).unknown(true).required();

const env = schema.validate(process.env);

if (env.error) {
    throw new Error(`Config validation error: ${env.error.message}`);
}

module.exports = {
    port: env.value.PORT,
    plugins: env.value.PLUGINS.split(' ').filter(Boolean),
}