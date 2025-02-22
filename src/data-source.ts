import "reflect-metadata"
import { DataSource } from "typeorm"
import { Gate } from "./entity/Gate"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "postgres",
    synchronize: false,
    logging: false,
    entities: [Gate],
    migrations: [],
    subscribers: [],
})
