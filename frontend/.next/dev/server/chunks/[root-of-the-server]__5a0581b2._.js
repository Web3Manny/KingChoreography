module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/frontend/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseDelete",
    ()=>supabaseDelete,
    "supabaseGet",
    ()=>supabaseGet,
    "supabasePatch",
    ()=>supabasePatch,
    "supabasePost",
    ()=>supabasePost
]);
const SUPABASE_URL = process.env.SUPABASE_URL || ("TURBOPACK compile-time value", "https://frwldthcljuncpjxpefi.supabase.co") || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
function headers() {
    return {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
    };
}
async function supabaseGet(table, params = '') {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
        headers: headers(),
        cache: 'no-store'
    });
    if (!r.ok) throw new Error(`Supabase GET ${table} failed: ${r.status}`);
    return r.json();
}
async function supabasePost(table, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error(`Supabase POST ${table} failed: ${r.status}`);
    return r.json();
}
async function supabasePatch(table, matchParams, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchParams}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error(`Supabase PATCH ${table} failed: ${r.status}`);
    return r.json();
}
async function supabaseDelete(table, matchParams) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchParams}`, {
        method: 'DELETE',
        headers: headers()
    });
    if (!r.ok) throw new Error(`Supabase DELETE ${table} failed: ${r.status}`);
    return r.status;
}
}),
"[project]/frontend/app/api/submissions/free/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/supabase.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    const body = await request.json();
    if (!body.is_existing_client) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Free submissions are for current clients only'
        }, {
            status: 400
        });
    }
    const data = {
        ...body,
        service_type: 'free_tier',
        calculated_amount: 0,
        price_breakdown: JSON.stringify({
            type: 'free'
        }),
        payment_status: 'free',
        review_status: 'not_applicable',
        review_week: null,
        submitted_at: new Date().toISOString()
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabasePost"])('submissions', data);
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result[0] || data);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5a0581b2._.js.map