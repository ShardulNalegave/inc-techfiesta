import dotenv from 'dotenv';
import neo4j, { Driver, Session } from 'neo4j-driver';

dotenv.config();

class Neo4jService {
    private driver: Driver;

    constructor() {
        const uri = process.env.NEO4J_URI || 'neo4j+s://<your-database-uri>';
        const user = process.env.NEO4J_USER || 'neo4j';
        const password = process.env.NEO4J_PASSWORD || '<your-password>';
        this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    }

    getSession(): Session {
        return this.driver.session();
    }

    async close(): Promise<void> {
        await this.driver.close();
    }
}

const neo4jService = new Neo4jService();
export default neo4jService;