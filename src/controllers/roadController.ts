// src/controllers/roadController.ts
import { Session } from 'neo4j-driver';
import neo4jService from '../db/neo4j.js';

export class RoadController {
    private session: Session;

    constructor() {
        this.session = neo4jService.getSession();
    }

    async getRoadForUserLocation(latitude: number, longitude: number): Promise<any> {
        const query = `
      WITH point({latitude: $latitude, longitude: $longitude}) AS userPosition
      MATCH (road:Road)
      WHERE point.distance(userPosition, road.startPoint) + point.distance(userPosition, road.endPoint) = point.distance(road.startPoint, road.endPoint)
      RETURN road LIMIT 1
    `;
        return this.session.run(query, { latitude, longitude });
    }

    async getRoadForUserLocationByProximity(latitude: number, longitude: number): Promise<any> {
        const query = `
      WITH point({latitude: $latitude, longitude: $longitude}) AS userPosition, 50 AS threshold
      MATCH (road:Road)
      WHERE point.distance(userPosition, road.startPoint) + point.distance(userPosition, road.endPoint) - point.distance(road.startPoint, road.endPoint) < threshold
      RETURN road
      LIMIT 1;
    `;
        return this.session.run(query, { latitude, longitude });
    }

    async getStartAndEndRoads(startLat: number, startLon: number, endLat: number, endLon: number): Promise<any> {
        const query = `
      WITH point({latitude: $startLat, longitude: $startLon}) AS userStartPosition,
           point({latitude: $endLat, longitude: $endLon}) AS userEndPosition
      MATCH (startRoad:Road), (endRoad:Road)
      WHERE point.distance(userStartPosition, startRoad.startPoint) + point.distance(userStartPosition, startRoad.endPoint) = point.distance(startRoad.startPoint, startRoad.endPoint)
        AND point.distance(userEndPosition, endRoad.startPoint) + point.distance(userEndPosition, endRoad.endPoint) = point.distance(endRoad.startPoint, endRoad.endPoint)
      RETURN startRoad, endRoad
    `;
        return this.session.run(query, { startLat, startLon, endLat, endLon });
    }

    async runDijkstra(startId: number, endId: number): Promise<any> {
        const query = `
      MATCH (start:Road {road_id: $startId}), (end:Road {road_id: $endId})
      CALL apoc.algo.dijkstra(start, end, 'CONNECTED_TO', 'distance') YIELD path, weight
      UNWIND nodes(path) AS node
      RETURN id(node) AS nodeId, node.startPoint AS position, weight AS totalCost
    `;
        return this.session.run(query, { startId, endId });
    }

    async runDijkstraWithLogs(startId: number, endId: number): Promise<any> {
        const query = `
      MATCH (start:Road {road_id: $startId}), (end:Road {road_id: $endId})
      MATCH path = shortestPath((start)-[:CONNECTED_TO*]-(end))
      WHERE all(r IN relationships(path) WHERE r.distance IS NOT NULL) // Ensure distance property exists
      WITH path, reduce(totalCost = 0, r IN relationships(path) | totalCost + r.distance) AS totalCost, start, end
      UNWIND nodes(path) AS node
      RETURN id(node) AS nodeId, node.startPoint AS position, id(start) AS sourceNode, id(end) AS targetNode, totalCost;
    `;
        return this.session.run(query, { startId, endId });
    }

    // Other functions can be implemented similarly.
}
