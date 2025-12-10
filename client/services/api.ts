
import axios from 'axios';
import { CRMEntry, Task, Meeting, User, UserRole, AuthResponse } from '../types';

// ============================================================================
// ⚙️ API CONFIGURATION
// ============================================================================

// Toggle this to FALSE to connect to your real backend
const USE_MOCK_SERVICE = true; 

// Your Real Backend URL (e.g., Node/Express server)
// In production, this should ideally come from process.env.REACT_APP_API_URL
const API_URL = 'http://localhost:8080/api/v1'; 

// ============================================================================

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// 🧠 IN-MEMORY DATABASE (Volatile)
// ============================================================================
// Data resets on page reload. Connect to backend for persistence.

let memoryCrm: CRMEntry[] = [];
let memoryTasks: Task[] = [];
let memoryMeetings: Meeting[] = [];

// ============================================================================

// --- CRM API ---
export const crmApi = {
  getAll: async (): Promise<{crmList: CRMEntry[]}> => {
    if (!USE_MOCK_SERVICE) {
        const res = await api.get("/crm/all");
        return res.data;
    }
    
    await delay(400);
    return { crmList: [...memoryCrm] };
  },

  create: async (data: Omit<CRMEntry, 'id'>): Promise<CRMEntry> => {
    if (!USE_MOCK_SERVICE) {
        const res = await api.post("/crm/create", data);
        return res.data;
    }

    await delay(300);
    
    const newEntry: CRMEntry = { 
        ...data, 
        id: Date.now(),
        // Auto-generate ref ID for deals in progress
        referenceId: (data.status === 'onboarded' || data.status === 'on progress') 
            ? `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
            : undefined
    };
    
    memoryCrm = [newEntry, ...memoryCrm];
    return newEntry;
  },

  update: async (id: number, data: Partial<CRMEntry>): Promise<CRMEntry> => {
     if (!USE_MOCK_SERVICE) {
        const res = await api.put(`/crm/update/${id}`, data);
        return res.data;
     }

     await delay(300);
     
     let updatedItem = {} as CRMEntry;
     memoryCrm = memoryCrm.map(item => {
         if (item.id === id) {
             updatedItem = { ...item, ...data };
             return updatedItem;
         }
         return item;
     });
     
     return updatedItem;
  },

  delete: async (id: number): Promise<void> => {
    if (!USE_MOCK_SERVICE) {
        await api.delete(`/crm/delete/${id}`);
        return;
    }

    await delay(300);
    memoryCrm = memoryCrm.filter(i => i.id !== id);
  }
};

// --- TASKS API ---
export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    if (!USE_MOCK_SERVICE) {
        const res = await api.get("/tasks/all");
        return res.data;
    }

    await delay(300);
    return [...memoryTasks];
  },

  create: async (data: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    if (!USE_MOCK_SERVICE) {
        const res = await api.post("/tasks/create", data);
        return res.data;
    }

    await delay(200);

    const newEntry: Task = { 
      ...data, 
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    memoryTasks = [newEntry, ...memoryTasks];
    return newEntry;
  },

  update: async (id: number, data: Partial<Task>): Promise<Task> => {
     if (!USE_MOCK_SERVICE) {
        const res = await api.put(`/tasks/update/${id}`, data);
        return res.data;
     }

     await delay(200);
     let updatedItem = {} as Task;

     memoryTasks = memoryTasks.map(item => {
         if (item.id === id) {
             updatedItem = { ...item, ...data };
             return updatedItem;
         }
         return item;
     });

     return updatedItem;
  },

  delete: async (id: number): Promise<void> => {
    if (!USE_MOCK_SERVICE) {
        await api.delete(`/tasks/delete/${id}`);
        return;
    }

    await delay(200);
    memoryTasks = memoryTasks.filter(i => i.id !== id);
  }
};

// --- MEETINGS API ---
export const meetingsApi = {
  getAll: async (): Promise<Meeting[]> => {
    if (!USE_MOCK_SERVICE) {
        const res = await api.get("/meetings/all");
        return res.data;
    }

    await delay(300);
    return [...memoryMeetings];
  },

  create: async (data: Omit<Meeting, 'id' | 'createdAt'>): Promise<Meeting> => {
    if (!USE_MOCK_SERVICE) {
        const res = await api.post("/meetings/create", data);
        return res.data;
    }

    await delay(200);

    const newEntry: Meeting = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    memoryMeetings = [newEntry, ...memoryMeetings];
    return newEntry;
  },

  update: async (id: number, data: Partial<Meeting>): Promise<Meeting> => {
    if (!USE_MOCK_SERVICE) {
        const res = await api.put(`/meetings/update/${id}`, data);
        return res.data;
    }

    await delay(200);
    let updatedItem = {} as Meeting;

    memoryMeetings = memoryMeetings.map(item => {
        if (item.id === id) {
            updatedItem = { ...item, ...data };
            return updatedItem;
        }
        return item;
    });

    return updatedItem;
  },

  delete: async (id: number): Promise<void> => {
    if (!USE_MOCK_SERVICE) {
        await api.delete(`/meetings/delete/${id}`);
        return;
    }

    await delay(200);
    memoryMeetings = memoryMeetings.filter(i => i.id !== id);
  }
};

// --- AUTH API ---
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (!USE_MOCK_SERVICE) {
        const res = await api.post("/auth/login", { email, password });
        return res.data;
    }

    await delay(800);
    
    // Hardcoded demo credentials for Mock Mode
    if (email === 'super@incial.com' && password === 'super') {
      return {
        statusCode: 200,
        token: "mock-jwt-token-super",
        role: "ROLE_SUPER_ADMIN",
        user: { id: 1, name: "Super Admin", email, role: "ROLE_SUPER_ADMIN" as UserRole },
        message: "Login successful"
      };
    }

    if (email === 'admin@incial.com' && password === 'admin') {
      return {
        statusCode: 200,
        token: "mock-jwt-token-admin",
        role: "ROLE_ADMIN",
        user: { id: 2, name: "Vallapata", email, role: "ROLE_ADMIN" as UserRole },
        message: "Login successful"
      };
    }

    if (email === 'employee@incial.com' && password === 'employee') {
      return {
        statusCode: 200,
        token: "mock-jwt-token-employee",
        role: "ROLE_EMPLOYEE",
        user: { id: 3, name: "John Doe", email, role: "ROLE_EMPLOYEE" as UserRole },
        message: "Login successful"
      };
    }

    if (email === 'client@incial.com' && password === 'client') {
      return {
        statusCode: 200,
        token: "mock-jwt-token-client",
        role: "ROLE_CLIENT",
        // Note: For mock client access to work perfectly, you need to create a Company with ID 1 first in the CRM
        user: { 
            id: 4, 
            name: "Anil Michael", 
            email, 
            role: "ROLE_CLIENT" as UserRole,
            companyId: 1 
        },
        message: "Login successful"
      };
    }

    throw new Error("Invalid credentials");
  }
};
