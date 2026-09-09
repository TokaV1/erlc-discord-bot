import axios from 'axios';

const ERLC_API_URL = process.env.ERLC_API_URL || 'https://api.erlc.io';
const ERLC_API_KEY = process.env.ERLC_SERVER_KEY;

interface ERLCResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function getServerInfo(): Promise<ERLCResponse> {
  try {
    if (!ERLC_API_KEY) {
      return { success: false, error: 'ER:LC API key not configured' };
    }
    
    const response = await axios.get(`${ERLC_API_URL}/servers`, {
      headers: { 'Authorization': `Bearer ${ERLC_API_KEY}` },
      timeout: 5000
    });
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPlayers(): Promise<ERLCResponse> {
  try {
    if (!ERLC_API_KEY) {
      return { success: false, error: 'ER:LC API key not configured' };
    }
    
    const response = await axios.get(`${ERLC_API_URL}/players`, {
      headers: { 'Authorization': `Bearer ${ERLC_API_KEY}` },
      timeout: 5000
    });
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getStaff(): Promise<ERLCResponse> {
  try {
    if (!ERLC_API_KEY) {
      return { success: false, error: 'ER:LC API key not configured' };
    }
    
    const response = await axios.get(`${ERLC_API_URL}/staff`, {
      headers: { 'Authorization': `Bearer ${ERLC_API_KEY}` },
      timeout: 5000
    });
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getQueue(): Promise<ERLCResponse> {
  try {
    if (!ERLC_API_KEY) {
      return { success: false, error: 'ER:LC API key not configured' };
    }
    
    const response = await axios.get(`${ERLC_API_URL}/queue`, {
      headers: { 'Authorization': `Bearer ${ERLC_API_KEY}` },
      timeout: 5000
    });
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function executeCommand(command: string): Promise<ERLCResponse> {
  try {
    if (!ERLC_API_KEY) {
      return { success: false, error: 'ER:LC API key not configured' };
    }
    
    const response = await axios.post(`${ERLC_API_URL}/execute`, 
      { command },
      {
        headers: { 'Authorization': `Bearer ${ERLC_API_KEY}` },
        timeout: 5000
      }
    );
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPlayerStats(username: string): Promise<ERLCResponse> {
  try {
    if (!ERLC_API_KEY) {
      return { success: false, error: 'ER:LC API key not configured' };
    }
    
    const response = await axios.get(`${ERLC_API_URL}/players/${username}`, {
      headers: { 'Authorization': `Bearer ${ERLC_API_KEY}` },
      timeout: 5000
    });
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBans(): Promise<ERLCResponse> {
  try {
    if (!ERLC_API_KEY) {
      return { success: false, error: 'ER:LC API key not configured' };
    }
    
    const response = await axios.get(`${ERLC_API_URL}/bans`, {
      headers: { 'Authorization': `Bearer ${ERLC_API_KEY}` },
      timeout: 5000
    });
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLogs(type: string): Promise<ERLCResponse> {
  try {
    if (!ERLC_API_KEY) {
      return { success: false, error: 'ER:LC API key not configured' };
    }
    
    const response = await axios.get(`${ERLC_API_URL}/logs/${type}`, {
      headers: { 'Authorization': `Bearer ${ERLC_API_KEY}` },
      timeout: 5000
    });
    
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
