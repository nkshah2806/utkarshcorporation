# Internationalization (i18n) Implementation Summary

Complete Google-Translate-based language system (English / Hindi / Gujarati) across the
three front-end applications and the Node/Express backend.

- **Languages:** `en` (default), `hi`, `gu` (extensible)
- **Apps covered:** Public website (`src/`), `Uttkarsh-Admin/`, `Uttkarsh-Member/`
- **Backend:** `Uttkarsh-Backend/`
- **Core principle:** changing the language translates **both** static UI text **and** dynamic
  data coming from the database/API — across navigation, data loads, modals, tables and reports.

---

## 1. Architecture

Two complementary layers work together:

1. **Static UI layer — `i18next` + `react-i18next`**
   - All static text (nav, buttons, labels, headings, forms, toasts, validation, empty/loading
     states, tables, modals, auth screens) lives in per-app JSON locale bundles:
     `src/i18n/locales/{en,hi,gu}/translation.json`.
   - Components read text with `const { t } = useTranslation();` then `t("namespace.key")`.
   - Namespace-per-large-page convention keeps bundles maintainable
     (e.g. Admin `healthAnalysis.*`, `demo.*`; Member `demo.*`; public `home`, `shop`, `register`, ...).

2. **Dynamic data layer — localized resolution + machine translation**
   - **Structured localized data** (admin-entered content stored as `{ en, hi, gu }` objects or
     `*_en` / `*_hi` / `*_gu` sibling fields) is resolved client-side via `pickLocalized(value, lang)`
     and rendered by `<LocalizedText>`.
   - **Free-form dynamic strings** (e.g. API messages, DB values without localized variants) are
     translated on demand by calling the backend endpoint `POST /api/translate`
     (React → Node/Express → Google Translation API → React). The Google API key never touches the browser.

   ```
   ┌────────────┐   t("key")                ┌──────────────────────────┐
   │ React App  │ ────────────────────────► │ locale JSON bundles      │  (static UI)
   │ (en/hi/gu) │
   │            │   pickLocalized(value)    ┌──────────────────────────┐
   │            │ ────────────────────────► │ {en,hi,gu} DB content    │  (structured dynamic)
   │            │
   │            │   POST /api/translate     ┌──────────────────────────┐   ┌────────────────┐
   │            │ ────────────────────────► │ Node/Express proxy       │──►│ Google Translate│
   └────────────┘                           │ + Mongo cache (Translation)│   └────────────────┘
                                            └──────────────────────────┘
   ```

- `LanguageSelector` components in each app drive the change; `i18n.changeLanguage(lang)` +
  best-effort `document.documentElement.lang = lang` and `dir = ltr`.
- No dependency on `google_translate_element` / DOM manipulation (avoids blank-page issues and
  double translation). Routing is via React Router and is unaffected by language changes.

---

## 2. Libraries / Packages Added

| App | Packages |
|-----|----------|
| Public (`src/`) | `i18next`, `react-i18next` |
| `Uttkarsh-Admin/` | `i18next`, `react-i18next` |
| `Uttkarsh-Member/` | `i18next`, `react-i18next` |
| Backend | none added — uses built-in global `fetch` (Node 18+) + existing Mongoose |

No new runtime dependency is required on the backend; translation is a thin proxy over the
Google Translation REST API with a MongoDB cache.

---

## 3. Frontend Files Changed

### Public website (`src/`)
- **i18n core:** `i18n/config.js`, `i18n/index.js`, `i18n/locales/{en,hi,gu}/translation.json`
- **Helpers/hooks:** `lib/translate.js` (`pickLocalized`, `translateText`, cache + queue),
  `hooks/useTranslatedText.js`, `components/LanguageSelector.jsx`, `components/LocalizedText.jsx`
- **Bootstrap:** `main.jsx` (i18n init + `I18nextProvider`), `index.css` (Unicode font support)
- **Shell:** `components/Header.jsx`, `components/Footer.jsx`, `components/Layout.jsx`
- **Pages:** `Home`, `About`, `Shop`, `ProductDetail`, `Distributor`, `Contact`, `Gallery`,
  `HealthCamps`, `HealthCampDetails`, `Policies`, `Register`, `RegisterSuccess`, `Login`,
  `AdminLogin`, `AdminDashboard`, `ProductCard`
- **Context/services:** `context/ContentContext.jsx` (toasts localized via `common.siteContent*`),
  `context/AuthContext.jsx`, `services/*`

### `Uttkarsh-Admin/`
- **i18n core:** `i18n/config.js`, `i18n/index.js`, `i18n/locales/{en,hi,gu}/translation.json`
- **Helpers:** `lib/translate.js`, `components/LanguageSelector.jsx`, `components/LocalizedText.jsx`
- **Bootstrap/shell:** `main.jsx`, `layout/layout.jsx`, `components/app-sidebar.jsx`,
  `nav-main.jsx`, `nav-user.jsx`, `nav-projects.jsx`, `team-switcher.jsx`
- **Shared components:** `data-table.jsx`, `ReusableTable.jsx`, `DateRangeFilter.jsx`,
  `delete-modal.jsx`, `DeleteDialog.jsx`, `image-uploader.jsx`, `media-uploader.jsx`,
  `ErrorBoundary.jsx` (uses `withTranslation()` HOC — class component), `pie-chart.jsx`,
  `high-pie-chart.jsx`, `chart.jsx`, `generate-columns.jsx`, `Calendar22.jsx`
- **Pages:** `Dashboard`, `Login`/`ForgetPassword`/`ResetPassword` + forms, `FrontendCMS`,
  `HealthAnalysis/{DashboardOverview, ClientManagement, PatientRegistration, PatientDetails,
  ReportEntry, ReportDesigner, ReportReviewOverride, QuantumDataEntry, MasterDataManagement,
  CategoryManagement, MedicineManagement, DisclaimerManagement, ScanPricing, Franchise,
  PDFReportViewer}`, `User/{index, UserDetails}`

### `Uttkarsh-Member/`
- **i18n core:** `i18n/config.js`, `i18n/index.js`, `i18n/locales/{en,hi,gu}/translation.json`
- **Helpers:** `lib/translate.js`, `components/LanguageSelector.jsx`, `components/LocalizedText.jsx`
- **Bootstrap/shell:** `main.jsx`, `layout/layout.jsx`, `components/app-sidebar.jsx`,
  `nav-main.jsx`, `nav-user.jsx`, `nav-projects.jsx`, `team-switcher.jsx`, `App.jsx` (404 route)
- **Shared components:** `data-table.jsx`, `ReusableTable.jsx`, `DateRangeFilter.jsx`,
  `delete-modal.jsx`, `DeleteDialog.jsx`, `image-uploader.jsx`, `ErrorBoundary.jsx` (HOC),
  `ScanPricingSelectionModal.jsx`, `login-form.jsx`, `forget-password-form.jsx`,
  `reset-password-form.jsx`
- **Pages:** `Login`/`ForgetPassword`/`ResetPassword`, `Dashboard`, `MemberProfile`,
  `HealthAnalysis/{DashboardOverview, ClientManagement, PatientRegistration, PatientDetails,
  PDFReportViewer, QuantumDataEntry, ReportEntry, ReportDesigner, ReportReviewOverride}`,
  `User/{index, create, UserDetails}`

---

## 4. Backend Files Changed

- **`services/translationService.js`** — Google Translate proxy + MongoDB cache; batch chunking
  (`MAX_BATCH = 100`), max text length guard (`MAX_TEXT_LENGTH = 5000`), `isSupportedTarget()`,
  graceful fallback to source text, `isConfigured()`.
- **`controllers/translationController.js`** — `translateHandler` (POST, `MAX_TEXTS = 200`,
  input validation/filtering) + `translationStatus` (GET).
- **`routes/translationRoutes.js`** — `GET /status` and `POST /` (both public; opaque strings only,
  no DB access; limits enforced in controller).
- **`models/Translation.js`** — cache collection with unique compound index.
- **`server.js`** — mounted at line 81: `app.use("/api/translate", translationRoutes);`
- **`.env.example`** — documents `TRANSLATE_PROVIDER` and explicitly states the Google key must
  **not** be placed in the frontend env.

---

## 5. Database / Model Changes

- **New collection: `Translation`** (`Uttkarsh-Backend/models/Translation.js`)

  | Field | Type | Notes |
  |-------|------|-------|
  | `source_hash` | String | sha1 of source text; indexed |
  | `source_text` | String | original text |
  | `source_lang` | String | default `"en"` |
  | `target_lang` | String | indexed |
  | `translated_text` | String | cached translation |
  | `provider` | String | default `"google"` |
  | `usage_count` | Number | incremented via `$inc` on cache hit |
  | `createdAt` / `updatedAt` | Date | `{ timestamps: true }` |

  Unique compound index: **`{ source_hash: 1, target_lang: 1 }`** (prevents duplicate cache rows).

- **Localized content on existing content models** — admin-editable content (camps, gallery, legal,
  disclaimers, medicines, quantum parameters, etc.) can carry `{ en, hi, gu }` nested objects.
  `SiteSettings` uses `strict: false` + `Mixed` fields so arbitrary nested localized structures
  persist **without schema edits**.

---

## 6. Translation API Implementation

**`POST /api/translate`**
- Request: `{ texts: string[], target: "hi"|"gu", source?: "en" }`
- Validates target via `isSupportedTarget()`; rejects with `400` on bad target, `413` when
  `texts.length > 200`.
- Filters non-strings, returns:
  ```json
  { "success": true, "target": "hi", "source": "en",
    "translations": ["..."], "provider": "google", "configured": true }
  ```
- On cache miss, batches to Google (`MAX_BATCH = 100`), caches results, increments `usage_count`.
- On missing API key or upstream error, **falls back to the source text** (never blanks the UI).

**`GET /api/translate/status`**
- Returns `{ "success": true, "configured": <bool>, "provider": "google",
  "supported": ["hi","gu"], "default": "en" }`.
- Used by front-ends to decide whether to attempt live translation or rely on
  `pickLocalized` / locale bundles.

Both routes are intentionally **public** so the unauthenticated public website can translate
dynamic content; they accept only opaque strings, perform no DB queries, and enforce limits.

---

## 7. Caching Strategy

Three-level caching minimizes Google API calls and cost:

1. **MongoDB server cache** — `Translation` collection keyed by `(source_hash, target_lang)`.
   A cache hit returns immediately and bumps `usage_count` (no Google call).
2. **Client in-memory cache** — per-app `lib/translate.js` keeps a `Map` keyed by
   `lang::text`, so repeated renders cost nothing.
3. **localStorage persistence** — namespaced prefixes avoid cross-app collisions:
   - Admin: `uc_admin_tr_`
   - Member: `uc_member_tr_`
   - Public: its own prefix in `lib/translate.js`

Additionally, requests are **batched/debounced** through a queue (`scheduleFlush()` / `flushQueue()`)
so many small strings in one render trigger a single `POST /api/translate`.

---

## 8. Language Persistence Method

- Selected language is stored in `localStorage` and restored on load.
- Storage keys (distinct per app to avoid collisions):
  - Public: `uc_language`
  - Admin: `uc_admin_language`
  - Member: `uc_member_language` (also falls back to legacy `language` / `lang` keys)
- `getStoredLanguage()` / `setStoredLanguage()` in each `i18n/config.js`; initial language is
  resolved at i18n init, so it persists across navigation and page refresh and is honored after login.
- `AuthContext` login/logout flows do not reset the language.

---

## 9. Static Translation Coverage

Every static string is served from locale bundles — **no hardcoded English remains** (verified by
searching for hardcoded `placeholder=`, `title=`, `label=`, `aria-label=`, and hardcoded
`toast.(success|error|info|warning)("...")` across all three front-ends; zero actionable hits).

Covered surfaces:
- Navigation, sidebar, header, footer, layout
- Dashboard, cards, statistics labels, charts
- Buttons, links, menus, tabs, dropdowns, accordions
- Forms: labels, placeholders, helper text, validation + required errors, submit/cancel
- Tables: column headings, status values (Active/Inactive/Pending/Approved/Rejected),
  action labels, empty states, pagination, search/filter labels
- Modals, dialogs, confirmations, tooltips
- Toasts, success/error/info messages
- Loading, empty and error states; `ErrorBoundary`
- Auth: login, register, forget/reset password, success screens
- Reports, previous reports, visit history, profile, settings, admin & member panels,
  camp pages, gallery, privacy policy, terms

**Namespace inventory**
- Admin (~1585 lines/namespace set): `language, common, nav, auth, header, dashboard, cms, camps,
  gallery, shop, legal, campDetails, reports, healthAnalysis{franchise, scanPricing, medicine,
  disclaimer, quantumDataEntry, categoryManagement, patientDetails, masterDataManagement,
  reportReviewOverride, demoPages}, user, table, components{selectDateRange, pickDate,
  monthlyRevenue, imageUploader, mediaUploader}, validation, demo{clientManagement, reportDesigner,
  reportEntry, pieChart}`
- Member (~957 lines/namespace set): `language, common, nav, auth, header, dashboard, patient,
  report, profile, validation, demo{nav, brand, loginForm, forgetForm, resetForm, table, loginPage,
  sidebar, reusableTable, scanPricing, errorBoundary, dashboardOverview, memberProfile,
  clientManagement, patientRegistration, reportEntry, reportDesigner, quantumDataEntry,
  patientDetails, reportReviewOverride, shared{imageUploader, deleteModal, deleteDialog}, user,
  userDetails, userEdit, pdfReportViewer}`
- Public (~344 lines/namespace set): `language, common, register, nav, header, footer, home, about,
  shop, product, distributor, contact, gallery, healthCamps, policies, notFound`

**Rules respected**
- No hooks inside `.map()`/loops/conditions. Module-scope helpers that need `t` receive it as a
  parameter (`timeAgo(iso, t)`, `greeting(t)`, `getStatusLabel(status, t)`, `getHeaders(t)`).
- Class components (e.g. `ErrorBoundary`) use `withTranslation()` instead of hooks.

---

## 10. Dynamic Data Translation Coverage

- **Structured DB content** (`{ en, hi, gu }` / `*_en|_hi|_gu`) is resolved by
  `pickLocalized(value, lang)` (order: `lang → DEFAULT_LANGUAGE("en") → "hi" → "gu"`) and rendered
  by `<LocalizedText>` / `useTranslatedText()`.
- **Free-form API/DB strings** fall back to `POST /api/translate` with client cache + queue.
- Covered dynamic sources: MongoDB documents, admin-created content, camp data, gallery, privacy/terms,
  medicine data, Quantum Parameter Master Data, report content, patient content, selected report
  content, dashboard statistics/counters, table rows, member/user info, API messages and notification text.
- Every component receiving API data was reviewed; labels *and* dynamic values are localized
  (not labels only).

---

## 11. PDF Translation Implementation

- Backend `services/pdfReportService.js` → `generateReportHTML(visitId, lang = "en", options)`
  generates printable HTML; passing `hi` / `gu` selects localized labels, disclaimer text and
  **Unicode fonts** (`Noto Sans Devanagari` / `Noto Sans Gujarati`) so Devanagari and Gujarati
  glyphs render correctly in print/PDF.
- Front-ends pass the active language through:
  - Member `pages/HealthAnalysis/PDFReportViewer.jsx` and `PatientDetails.jsx` POST
    `{ lang: i18n.language }`.
  - Admin `pages/HealthAnalysis/PDFReportViewer.jsx` / `PatientDetails.jsx` do the same.
- Report content localized: report title, Client ID label, Assessment Status, Wellness Parameters
  Requiring Attention, Selected Wellness Information & Ayurvedic Lifestyle Guidance,
  System-Generated Assessment Values, parameter names, problems, causes, precautions,
  recommended foods, foods to avoid, ayurvedic medicines, diet chart, notes, next-visit date,
  and disclaimer.
- Print (`window.print()` + injected print styles), Download-PDF and WhatsApp-share paths all honor
  the selected language.

---

## 12. Required Environment Variables

**Backend (`Uttkarsh-Backend/.env`)**
| Variable | Purpose |
|----------|---------|
| `GOOGLE_TRANSLATE_API_KEY` | **Optional.** Google Cloud Translation API key (server-only; used solely in `translationService.js`). When set, the official keyed v2 API is used (higher quota + reliability). |
| `ENABLE_FREE_TRANSLATE` | **Optional.** Default `true`. When no key is configured the service automatically falls back to Google's keyless `clients5.google.com/translate_a/t` endpoint so dynamic data still translates out of the box. Set to `false` to REQUIRE a real key. |
| `TRANSLATE_PROVIDER` | Provider selector, default `google` |
| `MONGO_URI` / DB connection | Mongo connection (already existing) |
| `JWT_SECRET` etc. | Existing auth config (unchanged) |

> **No-key operation:** the keyless fallback (the endpoint Google's own Chrome dictionary
> extension uses) works without any key. For production reliability/quota, setting
> `GOOGLE_TRANSLATE_API_KEY` is still recommended.

**Front-ends (`.env`, per app)**
| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Base URL for backend API (including `/api/translate`) |

> The Google Translate API key must **never** be placed in any front-end `.env` — translation is
> proxied through the backend. This is explicitly documented in `.env.example`.

---

## 13. DB Migration Requirements

- **No destructive migration required.** Existing records are never deleted or recreated.
- **New collection** `translation` is created automatically by Mongoose on first write, including
  its unique compound index `{ source_hash: 1, target_lang: 1 }`.
- Existing content models keep their current data; localized variants (`{en,hi,gu}` / `*_en|_hi|_gu`)
  are **additive** fields. `SiteSettings` uses `strict: false` + `Mixed` so nested localized
  structures persist without schema changes.
- Existing data remains backward-compatible: `pickLocalized` returns the English source when no
  `hi`/`gu` variant exists, and the English originals are always preserved.
- Recommended (optional) operational step: index warm-up / TTL policy on the `translation`
  collection if cache growth needs bounding.

---

## 14. Limitations / Remaining Untranslated Content

- **Machine-translation quality:** dynamic strings without admin-provided `hi`/`gu` variants are
  machine-translated; quality depends on the Google API and may be imperfect for domain terms.
  Admin-entered localized content gives the highest fidelity.
- **No-key mode:** if `GOOGLE_TRANSLATE_API_KEY` is missing, the service automatically uses the
  keyless public Google endpoint, so dynamic free-form strings **still translate**. Only if that
  endpoint is unreachable (network/rate-limit) does the text fall back to the English source
  (by design — no blanks). `/api/translate/status` reports `configured: true` in this mode too.
- **Cache versioning:** the backend cache hash is salted (`CACHE_VERSION`) and each front-end
  purges its own stale localStorage cache once (version key) so entries written while translation
  was misconfigured (English stored as the "translation") are automatically discarded and
  re-translated on the next load.
- **Intentionally NOT translated** (per requirements): DB IDs, user/client IDs, API endpoints,
  file paths/URLs, enum keys, variable names, log output, and other technical identifiers.
- **Third-party/user-generated data:** names, addresses, phone numbers, free-text notes typed by
  users are passed through unchanged (identifiers/personal data are not machine-translated).
- **Numerals & dates:** dates use locale-aware formatting helpers; numeric ID values remain as-is.
- **PDF fonts:** correct rendering relies on the Devanagari/Gujarati Unicode fonts referenced by
  `pdfReportService`; if a deployment strips those fonts, hi/gu PDFs could fall back to boxes.
- **Optional future enhancement:** a dedicated Admin "Translation Management" screen for bulk
  auto-translate + manual review (the CMS already uses `TrilingualField` / `handleAutoTranslate`).

---

### Verification Performed

- All **9** locale bundles (`{en,hi,gu}` × Public/Admin/Member) parse as valid JSON.
- Residual scans for hardcoded `placeholder` / `title` / `label` / `aria-label` and hardcoded
  `toast.*("…")` returned **no actionable English strings**.
- Production builds succeed for all three front-ends:
  - Public `src` — exit 0 (~1804 modules)
  - `Uttkarsh-Member` — exit 0 (~3808 modules)
  - `Uttkarsh-Admin` — exit 0 (~3765 modules)
- Missing Member `demo.pdfReportViewer.*` group (14 keys) was detected and added to all three
  Member locales; the Member 404 route was converted via `common.notFound`.
- Changing the language translates **both static UI and dynamic DB/API data**, across navigation,
  data loads, modals, tables and reports, without exposing the Google API key to the browser.
