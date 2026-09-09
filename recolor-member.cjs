/**
 * One-off script: replace blue-family Tailwind accents with the Member panel's
 * emerald/green theme across Uttkarsh-Member/src/**\/*.jsx
 *
 * Mapping (blue-family -> green-family):
 *   indigo-N  -> emerald-N
 *   violet-N  -> teal-N
 *   sky-N     -> teal-N
 *   cyan-N    -> emerald-N
 *   fuchsia-N -> emerald-N
 *   #0ea5e9 (sky-500)  -> #14b8a6 (teal-500)
 *   #4f46e5 (indigo-600) -> #059669 (emerald-600)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "Uttkarsh-Member", "src");

const rules = [
    { re: /indigo-(\d+)/g, to: (m, n) => `emerald-${n}` },
    { re: /violet-(\d+)/g, to: (m, n) => `teal-${n}` },
    { re: /sky-(\d+)/g, to: (m, n) => `teal-${n}` },
    { re: /cyan-(\d+)/g, to: (m, n) => `emerald-${n}` },
    { re: /fuchsia-(\d+)/g, to: (m, n) => `emerald-${n}` },
    { re: /#0ea5e9/g, to: () => "#14b8a6" },
    { re: /#4f46e5/g, to: () => "#059669" },
];

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, out);
        } else if (entry.name.endsWith(".jsx")) {
            out.push(full);
        }
    }
    return out;
}

let totalReplacements = 0;
for (const file of walk(ROOT)) {
    let content = fs.readFileSync(file, "utf8");
    let fileCount = 0;
    for (const rule of rules) {
        content = content.replace(rule.re, (...args) => {
            fileCount++;
            return rule.to(...args);
        });
    }
    if (fileCount > 0) {
        fs.writeFileSync(file, content, "utf8");
        const rel = path.relative(process.cwd(), file);
        console.log(`${fileCount.toString().padStart(3)} replacements -> ${rel}`);
        totalReplacements += fileCount;
    }
}
console.log(`\nTotal replacements: ${totalReplacements}`);
