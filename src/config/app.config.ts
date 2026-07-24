export const appConfig = () => ({
    environment: process.env.NODE_ENV || 'production',
    database: {
        db_type: process.env.DB_TYPE || 'postgres',
        db_port: parseInt(process.env.DB_PORT || '5432', 10),
        db_username: process.env.DB_USERNAME || 'db_user',
        db_password: process.env.DB_PASSWORD || 'password',
        db_host: process.env.DB_HOST || 'localhost',
        db_name: process.env.DB_NAME || 'postgres',
        db_pool_size: process.env.POOL_SIZE ? parseInt(process.env.POOL_SIZE, 10) : 20,
        is_db_ssl: process.env.IS_SSL_DB === 'true',
        db_sync: process.env.DB_SYNC === 'true',
        auto_load_entities: process.env.AUTO_LOAD_ENTITIES === 'true',
    }
})