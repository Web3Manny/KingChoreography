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
"[project]/frontend/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkAdminCredentials",
    ()=>checkAdminCredentials,
    "createToken",
    ()=>createToken,
    "verifyAdmin",
    ()=>verifyAdmin,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'king-choreography-jwt-secret-2025');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'brian@kingchoreography.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'KingChoreography2025!';
async function createToken(email, role) {
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"]({
        email,
        role
    }).setProtectedHeader({
        alg: 'HS256'
    }).setExpirationTime('24h').sign(JWT_SECRET);
}
async function verifyToken(token) {
    try {
        const { payload } = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"](token, JWT_SECRET);
        return payload;
    } catch  {
        return null;
    }
}
async function verifyAdmin(request) {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    const payload = await verifyToken(auth.slice(7));
    if (!payload || payload.role !== 'admin') return null;
    return payload;
}
function checkAdminCredentials(email, password) {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}
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
"[project]/frontend/app/api/admin/recent-activity/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/supabase.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    const admin = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAdmin"])(request);
    if (!admin) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Unauthorized'
    }, {
        status: 401
    });
    const [apps, subs] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseGet"])('applications', 'order=submitted_at.desc&limit=5').catch(()=>[]),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseGet"])('submissions', 'order=submitted_at.desc&limit=5').catch(()=>[])
    ]);
    const activity = [];
    for (const a of apps){
        activity.push({
            type: 'application',
            id: a.id,
            title: `New application from ${a.gym_name}`,
            subtitle: a.contact_name,
            status: a.status,
            timestamp: a.submitted_at
        });
    }
    for (const s of subs){
        activity.push({
            type: 'submission',
            id: s.id,
            title: `Submission from ${s.gym_name}`,
            subtitle: `${s.service_type} - $${s.calculated_amount}`,
            status: s.review_status,
            timestamp: s.submitted_at
        });
    }
    activity.sort((a, b)=>(b.timestamp || '').localeCompare(a.timestamp || ''));
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(activity.slice(0, 10));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3424875b._.js.map