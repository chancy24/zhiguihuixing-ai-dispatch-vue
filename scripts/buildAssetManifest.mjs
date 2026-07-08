import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const assetsRoot = path.join(root, 'public', 'assets')
const manifestDir = path.join(assetsRoot, 'manifest')
fs.mkdirSync(manifestDir, { recursive: true })

const generated = scanDir(path.join(assetsRoot, 'generated')).map((asset) => ({
  ...asset,
  sourceType: asset.localPath.includes('/image2/') ? 'image2' : 'self-drawn-svg',
  sourceNote: asset.localPath.includes('/image2/') ? 'OpenAI image generation, local workspace copy' : 'Project self-drawn SVG, copyright safe'
}))

const real = scanDir(path.join(assetsRoot, 'real')).map((asset) => ({
  ...asset,
  sourceType: 'real-or-public',
  sourceNote: 'Local project asset; verify public-assets.json for licensing when sourced online'
}))

const project = readJson(path.join(manifestDir, 'project-assets.json'), [])
const publicAssets = readJson(path.join(manifestDir, 'public-assets.json'), [])

const index = {
  generatedAt: new Date().toISOString(),
  counts: {
    project: project.length,
    public: publicAssets.length,
    generated: generated.length,
    real: real.length
  },
  project,
  publicAssets,
  generated,
  real
}

fs.writeFileSync(path.join(manifestDir, 'asset-index.json'), JSON.stringify(index, null, 2), 'utf8')
console.log(`已生成统一素材索引：${path.relative(root, path.join(manifestDir, 'asset-index.json'))}`)
console.log(JSON.stringify(index.counts, null, 2))

function scanDir(dir) {
  if (!fs.existsSync(dir)) return []
  const output = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) output.push(...scanDir(full))
    if (entry.isFile() && /\.(png|jpe?g|webp|svg|json)$/i.test(entry.name)) {
      output.push({
        id: entry.name.replace(/\.[^.]+$/, ''),
        fileName: entry.name,
        localPath: `/${path.relative(path.join(root, 'public'), full).replace(/\\/g, '/')}`,
        assetType: path.extname(entry.name).slice(1).toLowerCase()
      })
    }
  }
  return output
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

