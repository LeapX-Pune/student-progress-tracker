// Mocking browser APIs for Node.js
global.window = {};
global.localStorage = {
    getItem: (key) => key === 'authToken' ? 'mock-jwt-token-123' : null,
};
global.sessionStorage = {
    getItem: () => null
};

// We will mock fetch to simulate different scenarios
let fetchCallCount = 0;
global.fetch = async (url, options) => {
    fetchCallCount++;
    console.log(`  -> [Mock Fetch] Executing network request #${fetchCallCount} to ${url}`);
    
    // Simulate Deduplication Test (takes 500ms)
    if (url.includes('/students/1')) {
        return new Promise(resolve => setTimeout(() => resolve({
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ id: 1, name: 'Alex Johnson' })
        }), 500));
    }

    // Simulate Retry Test (fail twice, succeed third time)
    if (url.includes('/retry-test')) {
        if (fetchCallCount <= 2) {
            console.log(`  -> [Mock Fetch] Simulating network failure for attempt ${fetchCallCount}...`);
            throw new Error('Failed to fetch'); // Network error
        }
        return {
            ok: true,
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ success: true, message: 'Recovered after retry!' })
        };
    }
    
    // Simulate Timeout Test
    if (url.includes('/timeout-test')) {
        return new Promise(resolve => setTimeout(() => {
            // This will take 15 seconds, exceeding the 10s default
            resolve({ok: true});
        }, 15000));
    }

    return {
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true })
    };
};

async function displayWorking() {
    const { api } = await import('./src/services/api.js');
    api.baseUrl = 'https://api.leapx.local';
    console.log("=== 1. Testing Token Injection & Normal Request ===");
    const res1 = await api.get('/students/1');
    console.log("Result:", res1);
    
    console.log("\n=== 2. Testing Request Deduplication ===");
    console.log("Firing two requests to /students/1 at the EXACT same time...");
    // Reset call count for clarity
    fetchCallCount = 0; 
    const reqA = api.get('/students/1');
    const reqB = api.get('/students/1');
    const [resA, resB] = await Promise.all([reqA, reqB]);
    console.log(`Number of actual fetch calls made: ${fetchCallCount} (Expected: 1)`);
    console.log("Result A:", resA);
    console.log("Result B:", resB);

    console.log("\n=== 3. Testing Retry with Exponential Backoff ===");
    fetchCallCount = 0;
    try {
        const retryRes = await api.get('/retry-test');
        console.log("Result after retries:", retryRes);
        console.log(`Number of actual fetch calls made: ${fetchCallCount} (Expected: 3)`);
    } catch (e) {
        console.error("Retry failed:", e);
    }
    
    console.log("\n=== 4. Testing Timeout Handling ===");
    // Temporarily reduce timeout to 1s for the test
    api.timeoutMs = 1000;
    fetchCallCount = 0;
    try {
        console.log("Firing request that takes 15 seconds (timeout set to 1s)...");
        await api.get('/timeout-test');
    } catch (error) {
        console.log("Successfully caught error:", error.message);
    }
}

displayWorking();
