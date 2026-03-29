/**
 * Rural Health Sync Manager
 * Manages offline request queuing and automatic reconciliation
 */

export interface SyncRequest {
    id: string;
    endpoint: string;
    method: string;
    body: any;
    timestamp: number;
}

const STORAGE_KEY = 'offline_sync_queue';

export const syncManager = {
    /**
     * Add a request to the local sync queue
     */
    addRequest: (endpoint: string, method: string, body: any) => {
        const queue = syncManager.getQueue();
        const newRequest: SyncRequest = {
            id: Math.random().toString(36).substr(2, 9),
            endpoint,
            method,
            body,
            timestamp: Date.now()
        };
        queue.push(newRequest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        console.log(`[Sync] Request Queued: ${endpoint}`);
    },

    /**
     * Retrieve all pending requests
     */
    getQueue: (): SyncRequest[] => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    },

    /**
     * Clear the sync queue
     */
    clearQueue: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    /**
     * Synchronize all pending requests with the backend
     */
    sync: async (apiService: any) => {
        const queue = syncManager.getQueue();
        if (queue.length === 0) return;

        console.log(`[Sync] Starting synchronization for ${queue.length} requests...`);
        
        // Process in sequence
        for (const req of queue) {
            try {
                // Re-route to apiService based on endpoint
                if (req.endpoint.includes('/chat')) {
                    await apiService.sendChatMessage(req.body.message);
                } else if (req.endpoint.includes('/profile')) {
                    await apiService.updateProfile(req.body);
                } else if (req.endpoint.includes('/prescriptions')) {
                    await apiService.issuePrescription(req.body);
                }
                // (More endpoint mappings can be added here)
                
                console.log(`[Sync] Success: ${req.endpoint}`);
            } catch (error) {
                console.error(`[Sync] Failed to sync ${req.id}:`, error);
                // In case of continuous failure, we keep it in queue
                return; 
            }
        }

        // Entire queue processed
        syncManager.clearQueue();
        console.log(`[Sync] All requests reconciled.`);
    }
};
