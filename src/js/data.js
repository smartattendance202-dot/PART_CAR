// API-only DataManager using the backend (SQLite via server API)

const API_BASE = `${location.origin}/api`;

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!res.ok) {
        let msg = `API error ${res.status}`;
        try { const j = await res.json(); if (j && j.error) msg += `: ${j.error}`; } catch { }
        throw new Error(msg);
    }
    // Some endpoints (DELETE) may return no content
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

window.DataManager = {
    // Products
    async getProducts() {
        return await request('/products', { method: 'GET' });
    },
    async addProduct(p) {
        return await request('/products', { method: 'POST', body: JSON.stringify(p) });
    },
    async updateProduct(p) {
        return await request(`/products/${p.id}`, { method: 'PUT', body: JSON.stringify(p) });
    },
    async deleteProduct(id) {
        return await request(`/products/${id}`, { method: 'DELETE' });
    },

    // Branches
    async getBranches() {
        return await request('/branches', { method: 'GET' });
    },
    async addBranch(b) {
        return await request('/branches', { method: 'POST', body: JSON.stringify(b) });
    },
    async updateBranch(b) {
        return await request(`/branches/${b.id}`, { method: 'PUT', body: JSON.stringify(b) });
    },
    async deleteBranch(id) {
        return await request(`/branches/${id}`, { method: 'DELETE' });
    },

    // Settings
    async getSettings() {
        return await request('/settings', { method: 'GET' });
    },
    async saveSettings(s) {
        return await request('/settings', { method: 'PUT', body: JSON.stringify(s) });
    },

    // Utilities
    async uploadImageDataURL(dataUrl) {
        const res = await request('/upload-image', { method: 'POST', body: JSON.stringify({ dataUrl }) });
        return res.url; // server returns /uploads/images/xxx
    },
};
