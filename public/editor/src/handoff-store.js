// Shared by the homepage bundle and the standalone editor. Images stay local.
const databaseName = 'perlerbeadmake-converter-handoff';
const storeName = 'handoffs';
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, 1);
        request.onupgradeneeded = () => request.result.createObjectStore(storeName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
export async function saveConverterHandoff(payload) {
    const db = await openDatabase();
    const token = crypto.randomUUID();
    try {
        await new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const cursor = store.openCursor();
            cursor.onsuccess = () => {
                const item = cursor.result;
                if (!item) return;
                if (item.value.createdAt < Date.now() - 86400000) item.delete();
                item.continue();
            };
            store.put({ ...payload, version: 1, createdAt: Date.now() }, token);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
        return token;
    } finally { db.close(); }
}
export async function takeConverterHandoff(token) {
    const db = await openDatabase();
    try {
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const request = store.get(token);
            let payload = null;
            request.onsuccess = () => {
                payload = request.result ?? null;
                store.delete(token);
            };
            tx.oncomplete = () => resolve(payload);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    } finally { db.close(); }
}
