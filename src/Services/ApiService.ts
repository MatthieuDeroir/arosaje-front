const API_BASE_URL = "http://localhost:4000/api";

async function fetchFromAPI(endpoint: string, method: string = 'GET', body?: any, headers?: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method,
        headers: {
            ...headers,
            'Accept': 'application/json',
        },
        body
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data === null || data === undefined) {
        throw new Error('No data returned from API');
    }

    return data;
}

export default fetchFromAPI;