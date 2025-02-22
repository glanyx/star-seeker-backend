import "reflect-metadata"
import { DataSource } from "typeorm"
import { Gate } from "./entity/Gate"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOSTNAME,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
    entities: [Gate],
    migrations: [],
    subscribers: [],
})
