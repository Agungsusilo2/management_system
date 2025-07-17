import winston, {format} from "winston";

export const logger = winston.createLogger({
    level:"debug",
    format: winston.format.json(),
    transports:[
        new winston.transports.Console({})
    ]
})