
import express from 'express';
import { RoadController } from '../controllers/roadController.js';

const router = express.Router();
const roadController = new RoadController();

router.get('/road', async (req, res) => {
    const { latitude, longitude } = req.query;
    const result = await roadController.getRoadForUserLocation(Number(latitude), Number(longitude));
    res.json(result.records.map((record: any) => record.get('road')));
});

router.get('/roadByProximity', async (req, res) => {
    const { latitude, longitude } = req.query;
    const result = await roadController.getRoadForUserLocationByProximity(Number(latitude), Number(longitude));
    res.json(result.records.map((record: any) => record.get('road')));
});

router.get('/start-end', async (req, res) => {
    const { startLat, startLon, endLat, endLon } = req.query;
    const result = await roadController.getStartAndEndRoads(
        Number(startLat),
        Number(startLon),
        Number(endLat),
        Number(endLon)
    );
    res.json(result.records);
});

router.get('/dijkstra', async (req, res) => {
    const { startId, endId } = req.query;
    const result = await roadController.runDijkstra(Number(startId), Number(endId));
    res.json(result.records);
});

router.get('/dijkstraWithLogs', async (req, res) => {
    const { startId, endId } = req.query;
    const result = await roadController.runDijkstraWithLogs(Number(startId), Number(endId));
    res.json(result.records);
});

export default router;
