import { build, transform } from 'esbuild';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const sourceTagsDir = path.join(rootDir, 'tags');
const distTagsDir = path.join(distDir, 'tags');

const interactiveScripts = [
  'modal.js',
  'tabs.js',
  'select.js',
  'datetime.js'
];

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function writeFile(filePath, contents) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, contents, 'utf8');
}

async function readFile(filePath) {
  return fs.readFile(filePath, 'utf8');
}

async function bundleCss(entryFile, minify) {
  const result = await build({
    entryPoints: [entryFile],
    bundle: true,
    minify,
    write: false,
    logLevel: 'silent'
  });

  return result.outputFiles[0].text;
}

async function minifyJs(contents) {
  const result = await transform(contents, {
    loader: 'js',
    minify: true,
    target: 'es2018'
  });

  return result.code;
}

async function minifyCss(contents) {
  const result = await transform(contents, {
    loader: 'css',
    minify: true,
    target: 'es2018'
  });

  return result.code;
}

function buildAllBundle(cssText, scriptSources) {
  const styleBootstrap = [
    '(function () {',
    '  var cssText = ' + JSON.stringify(cssText) + ';',
    '  var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;',
    '  if (!document.querySelector("style[data-nbtl-all]")) {',
    '    var style = document.createElement("style");',
    '    style.setAttribute("data-nbtl-all", "");',
    '    style.textContent = cssText;',
    '    head.appendChild(style);',
    '  }',
    '})();'
  ].join('\n');

  return styleBootstrap + '\n\n' + scriptSources.join('\n\n');
}

async function buildRootFiles() {
  const cssEntry = path.join(rootDir, 'neubrutalism.css');
  const loaderEntry = path.join(rootDir, 'neubrutalism.js');
  const bundledCss = await bundleCss(cssEntry, false);
  const bundledCssMin = await bundleCss(cssEntry, true);
  const loaderSource = await readFile(loaderEntry);
  const loaderMin = await minifyJs(loaderSource);

  await writeFile(path.join(distDir, 'neubrutalism.css'), bundledCss);
  await writeFile(path.join(distDir, 'neubrutalism.min.css'), bundledCssMin);
  await writeFile(path.join(distDir, 'neubrutalism.js'), loaderSource);
  await writeFile(path.join(distDir, 'neubrutalism.min.js'), loaderMin);

  const scriptSources = await Promise.all(
    interactiveScripts.map(fileName => readFile(path.join(sourceTagsDir, fileName)))
  );

  const allBundle = buildAllBundle(bundledCss, scriptSources);
  const allBundleMin = await minifyJs(buildAllBundle(bundledCssMin, scriptSources));

  await writeFile(path.join(distDir, 'neubrutalism.all.js'), allBundle);
  await writeFile(path.join(distDir, 'neubrutalism.all.min.js'), allBundleMin);
}

async function buildModularFiles() {
  const tagFiles = await fs.readdir(sourceTagsDir);

  await Promise.all(tagFiles.map(async fileName => {
    const sourcePath = path.join(sourceTagsDir, fileName);
    const sourceContents = await readFile(sourcePath);
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);

    await writeFile(path.join(distTagsDir, fileName), sourceContents);

    if (extension === '.js') {
      await writeFile(
        path.join(distTagsDir, baseName + '.min.js'),
        await minifyJs(sourceContents)
      );
      return;
    }

    if (extension === '.css') {
      await writeFile(
        path.join(distTagsDir, baseName + '.min.css'),
        await minifyCss(sourceContents)
      );
    }
  }));
}

async function main() {
  await fs.rm(distDir, { recursive: true, force: true });
  await ensureDir(distTagsDir);
  await buildRootFiles();
  await buildModularFiles();
  console.log('dist generated successfully.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
