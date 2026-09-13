import { readFile, writeFile } from 'node:fs/promises';
const base = new URL('./', import.meta.url);
const dist = new URL('../../../../wsr-ui/packages/bi/dist-search-bridge/', import.meta.url);
const entry = await readFile(new URL('search-bridge.html',dist),'utf8');
const js = await readFile(new URL(entry.match(/<script[^>]*src="([^"]+)"/)[1].replace(/^\//,''),dist),'utf8');
const css = await readFile(new URL(entry.match(/<link[^>]*href="([^"]+\.css)"/)[1].replace(/^\//,''),dist),'utf8');
await writeFile(new URL('search-components.css',base),css);
// Shared compiled component bundle, embedded for offline file:// execution.
for (const name of ['crystra-task-work-v8-sidebar.html','crystra-task-browser-v8.html','crystra-workflow-explorer-v8.html','crystra-analysis-audit-v8.html','crystra-workflow-studio-v8.html']) {
 let html = await readFile(new URL(name,base),'utf8');
 html = html.replace(/<script data-crystra-search-components[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link data-crystra-search-components[^>]*>/g,'');
 html = html.replace('</head>','<link data-crystra-search-components rel="stylesheet" href="search-components.css"></head>');
 html = html.replace('</body>',()=>'<script data-crystra-search-components type="module">'+js.replace(/<\/script/gi,'<\\/script')+'</script></body>');
 await writeFile(new URL(name,base),html);
}
console.log('All five v8 pages now load the shared search components.');
