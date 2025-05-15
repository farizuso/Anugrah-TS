// src/test/setup.ts
import "@testing-library/jest-dom";

// setup.ts
(globalThis as any).route = (name: string, params?: Record<string, any>) => {
    let url = `/mocked/${name}`;
    if (params) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }
    return url;
};
