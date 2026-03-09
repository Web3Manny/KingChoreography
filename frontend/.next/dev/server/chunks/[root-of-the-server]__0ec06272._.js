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
"[project]/frontend/lib/pricing.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assignReviewWeek",
    ()=>assignReviewWeek,
    "calculatePrice",
    ()=>calculatePrice
]);
function calculatePrice(service, athleteCount, isClient, sessionLength, includeConsultation) {
    if (service.service_type === 'free_tier') {
        return {
            total: 0,
            breakdown: {
                type: 'free'
            }
        };
    }
    if (service.service_type === 'review_feedback') {
        const rate = isClient ? parseFloat(service.client_rate || 0) : parseFloat(service.nonclient_rate || 0);
        const breakdown = {
            base: rate,
            clientDiscount: isClient,
            service: 'Review & Feedback'
        };
        let total = rate;
        if (includeConsultation && service.addon_price) {
            const addon = parseFloat(service.addon_price);
            total += addon;
            breakdown.consultationAddon = addon;
        }
        return {
            total: Math.round(total * 100) / 100,
            breakdown
        };
    }
    if (service.service_type === 'virtual_upgrade') {
        let rateKey = '';
        if (isClient && sessionLength === '2hr') rateKey = 'per_athlete_rate_client_2hr';
        else if (isClient && sessionLength === '4hr') rateKey = 'per_athlete_rate_client_4hr';
        else if (!isClient && sessionLength === '2hr') rateKey = 'per_athlete_rate_nonclient_2hr';
        else if (!isClient && sessionLength === '4hr') rateKey = 'per_athlete_rate_nonclient_4hr';
        const perAthleteRate = parseFloat(service[rateKey] || 0);
        const total = athleteCount * perAthleteRate;
        return {
            total: Math.round(total * 100) / 100,
            breakdown: {
                perAthleteRate,
                athleteCount,
                sessionLength,
                isClient,
                formula: `${athleteCount} x $${perAthleteRate}`,
                service: 'Virtual Routine Upgrade'
            }
        };
    }
    return {
        total: 0,
        breakdown: {}
    };
}
function assignReviewWeek(submittedAt) {
    const day = submittedAt.getDay();
    const diff = submittedAt.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(submittedAt);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    const target = new Date(monday);
    if (submittedAt > monday) {
        target.setDate(target.getDate() + 7);
    }
    return target.toISOString().split('T')[0];
}
}),
"[project]/frontend/app/api/calculate-price/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/supabase.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$pricing$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/pricing.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    const body = await request.json();
    const services = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseGet"])('services', `id=eq.${body.service_id}`);
    if (!services.length) return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Service not found'
    }, {
        status: 404
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$pricing$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculatePrice"])(services[0], body.athlete_count || 1, body.is_existing_client || false, body.session_length || null, body.consultation_addon || false));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ec06272._.js.map