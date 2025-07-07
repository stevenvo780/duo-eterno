import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;
const LOGS_DIR = './logs';
const CURRENT_LOG = path.join(LOGS_DIR, 'current_session.json');

import { loadLogs, summarizeLogs } from './logSummarizer.js';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure logs directory exists
async function ensureLogsDir() {
  try {
    await fs.access(LOGS_DIR);
  } catch {
    await fs.mkdir(LOGS_DIR, { recursive: true });
  }
}

// POST /api/logs - Save logs from frontend
app.post('/api/logs', async (req, res) => {
  try {
    const { logs, metadata } = req.body;
    
    const logData = {
      timestamp: new Date().toISOString(),
      sessionId: metadata?.sessionId || `session_${Date.now()}`,
      metadata: metadata || {},
      logs: logs || [],
      totalLogs: logs?.length || 0
    };
    
    // Save current session
    await fs.writeFile(CURRENT_LOG, JSON.stringify(logData, null, 2));
    
    // Also save with timestamp for history
    const timestampedFile = path.join(LOGS_DIR, `logs_${Date.now()}.json`);
    await fs.writeFile(timestampedFile, JSON.stringify(logData, null, 2));
    
    console.log(`📊 Logs guardados: ${logData.totalLogs} entradas`);
    
    res.json({ 
      success: true, 
      message: 'Logs guardados correctamente',
      totalLogs: logData.totalLogs,
      sessionId: logData.sessionId
    });
  } catch (error) {
    console.error('Error guardando logs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/logs - Get current session logs
app.get('/api/logs', async (req, res) => {
  try {
    const data = await fs.readFile(CURRENT_LOG, 'utf8');
    const logData = JSON.parse(data);
    res.json(logData);
  } catch (error) {
    res.status(404).json({ success: false, error: 'No hay logs disponibles' });
  }
});

// GET /api/logs/history - Get all log files
app.get('/api/logs/history', async (req, res) => {
  try {
    const files = await fs.readdir(LOGS_DIR);
    const logFiles = files.filter(f => f.startsWith('logs_') && f.endsWith('.json'));
    
    const history = await Promise.all(
      logFiles.map(async (file) => {
        const filePath = path.join(LOGS_DIR, file);
        const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
        return {
          filename: file,
          timestamp: data.timestamp,
          sessionId: data.sessionId,
          totalLogs: data.totalLogs,
          metadata: data.metadata
        };
      })
    );
    
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(history);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/logs/summary?window=10  -> resumen estadístico
app.get('/api/logs/summary', async (req, res) => {
  try {
    const minutes = parseInt(req.query.window, 10) || 10;
    const allLogs = await loadLogs();
    const summary = summarizeLogs(allLogs, minutes);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/logs/analyze - Analyze current logs for issues
app.get('/api/logs/analyze', async (req, res) => {
  try {
    const data = await fs.readFile(CURRENT_LOG, 'utf8');
    const { logs } = JSON.parse(data);
    
    const analysis = {
      totalLogs: logs.length,
      categories: {},
      deaths: [],
      criticalEvents: [],
      resonanceEvents: [],
      activityChanges: [],
      healthIssues: [],
      timeSpan: { start: null, end: null }
    };
    
    logs.forEach(log => {
      // Count by category
      analysis.categories[log.category] = (analysis.categories[log.category] || 0) + 1;
      
      // Track time span
      if (!analysis.timeSpan.start || log.timestamp < analysis.timeSpan.start) {
        analysis.timeSpan.start = log.timestamp;
      }
      if (!analysis.timeSpan.end || log.timestamp > analysis.timeSpan.end) {
        analysis.timeSpan.end = log.timestamp;
      }
      
      // Categorize important events
      if (log.message.includes('murió') || log.message.includes('muerte')) {
        analysis.deaths.push({
          timestamp: log.timestamp,
          entityId: log.entityId,
          message: log.message,
          data: log.data
        });
      }
      
      if (log.message.includes('críticas') || log.level === 'WARNING') {
        analysis.criticalEvents.push({
          timestamp: log.timestamp,
          entityId: log.entityId,
          message: log.message,
          data: log.data
        });
      }
      
      if (log.message.includes('resonancia')) {
        analysis.resonanceEvents.push({
          timestamp: log.timestamp,
          message: log.message,
          data: log.data
        });
      }
      
      if (log.message.includes('cambia actividad')) {
        analysis.activityChanges.push({
          timestamp: log.timestamp,
          entityId: log.entityId,
          message: log.message,
          data: log.data
        });
      }
      
      if (log.message.includes('salud') && log.level === 'WARNING') {
        analysis.healthIssues.push({
          timestamp: log.timestamp,
          entityId: log.entityId,
          message: log.message,
          data: log.data
        });
      }
    });
    
    // Calculate session duration
    if (analysis.timeSpan.start && analysis.timeSpan.end) {
      analysis.sessionDuration = analysis.timeSpan.end - analysis.timeSpan.start;
    }
    
    console.log(`🔍 Análisis completado: ${analysis.deaths.length} muertes, ${analysis.criticalEvents.length} eventos críticos`);
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
async function startServer() {
  await ensureLogsDir();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor de logs ejecutándose en http://localhost:${PORT}`);
    console.log(`📁 Logs guardados en: ${path.resolve(LOGS_DIR)}`);
  });
}

startServer().catch(console.error);
