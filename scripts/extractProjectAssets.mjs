import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const root = process.cwd()
const sourceDir = path.join(root, 'docs', 'source')
const slidesDir = path.join(root, 'public', 'assets', 'project', 'slides')
const photosDir = path.join(root, 'public', 'assets', 'project', 'photos')
const evidenceDir = path.join(root, 'public', 'assets', 'project', 'evidence')
const screenshotsDir = path.join(root, 'public', 'assets', 'project', 'screenshots')
const manifestDir = path.join(root, 'public', 'assets', 'manifest')
const manifestPath = path.join(manifestDir, 'project-assets.json')

const namedSlides = [
  'slide-cover.png',
  'slide-industry-background.png',
  'slide-project-background.png',
  'slide-field-research.png',
  'slide-policy-support.png',
  'slide-product-architecture.png',
  'slide-business-model.png'
]

for (const dir of [sourceDir, slidesDir, photosDir, evidenceDir, screenshotsDir, manifestDir]) {
  fs.mkdirSync(dir, { recursive: true })
}

const sourceFiles = fs
  .readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => /\.(pdf|png|jpe?g|webp)$/i.test(name))

if (!sourceFiles.length) {
  console.log('请将项目PPT、项目文档、核心代码PDF、调研照片放入 docs/source/ 目录后重新运行素材提取脚本。')
  fs.writeFileSync(manifestPath, JSON.stringify([], null, 2), 'utf8')
  process.exit(0)
}

const pdfFiles = sourceFiles.filter((name) => /\.pdf$/i.test(name))
const imageFiles = sourceFiles.filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
const manifest = []

if (pdfFiles.length) {
  const renderResult = renderPdfs(pdfFiles)
  for (const asset of renderResult) manifest.push(asset)
}

for (const name of imageFiles) {
  const src = path.join(sourceDir, name)
  const normalized = slugify(name.replace(/\.(png|jpe?g|webp)$/i, '')) + path.extname(name).toLowerCase()
  const lower = name.toLowerCase()
  const targetDir = /code|核心|系统|screen|截图/.test(lower)
    ? screenshotsDir
    : /research|调研|team|photo|照片/.test(lower)
      ? photosDir
      : evidenceDir
  const out = path.join(targetDir, normalized)
  fs.copyFileSync(src, out)
  manifest.push({
    id: normalized.replace(/\.[^.]+$/, ''),
    fileName: normalized,
    localPath: toPublicPath(out),
    sourceFile: name,
    sourcePage: null,
    assetType: targetDir === photosDir ? 'photo' : targetDir === screenshotsDir ? 'screenshot' : 'evidence',
    recommendedUsage: targetDir === photosDir ? '项目真实调研或照片素材' : '项目证据卡片或说明区',
    containsLogo: false,
    needCrop: false,
    note: '从 docs/source 图片文件复制'
  })
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
console.log(`已生成 ${manifest.length} 条项目素材记录：${path.relative(root, manifestPath)}`)

function renderPdfs(files) {
  const jobPath = path.join(os.tmpdir(), `zhigui-pdf-render-${Date.now()}.json`)
  const scriptPath = path.join(os.tmpdir(), `zhigui-pdf-render-${Date.now()}.py`)
  const jobs = []

  for (const fileName of files) {
    const lower = fileName.toLowerCase()
    const isCoreCode = /core|代码|code/.test(lower)
    const useNamedSlides = !isCoreCode && /roadshow|路演|ppt/.test(lower)
    const targetDir = isCoreCode ? evidenceDir : slidesDir
    jobs.push({
      fileName,
      pdfPath: path.join(sourceDir, fileName),
      outputDir: targetDir,
      isCoreCode,
      useNamedSlides
    })
  }

  const python = `
import json, pathlib, sys
try:
    import pypdfium2 as pdfium
    from PIL import Image
except Exception as exc:
    print(json.dumps({"error": "missing_dependency", "detail": str(exc)}, ensure_ascii=False))
    sys.exit(0)

jobs = json.loads(pathlib.Path(${JSON.stringify(jobPath)}).read_text(encoding="utf-8"))
results = []
named = ${JSON.stringify(namedSlides)}
for job in jobs:
    pdf = pdfium.PdfDocument(job["pdfPath"])
    source_name = pathlib.Path(job["fileName"]).name
    max_pages = min(len(pdf), 12)
    for page_index in range(max_pages):
        page = pdf[page_index]
        image = page.render(scale=2.4).to_pil()
        if job.get("isCoreCode"):
            out_name = f"core-code-page-{page_index + 1:02d}.png"
            asset_type = "code-evidence"
            usage = "原有规则化系统基础、核心代码证据卡片"
        else:
            if job.get("useNamedSlides") and page_index < len(named):
                out_name = named[page_index]
            else:
                out_name = f"{pathlib.Path(source_name).stem}-page-{page_index + 1:02d}.png"
            asset_type = "slide-page"
            usage = [
                "登录页或路演封面",
                "行业痛点页",
                "项目说明页",
                "项目真实调研基础模块",
                "政策与行业依据模块",
                "产品架构模块",
                "商业模式模块"
            ][page_index] if page_index < 7 else "路演证据卡片"
        out_path = pathlib.Path(job["outputDir"]) / out_name
        image.save(out_path, "PNG", optimize=True)
        results.append({
            "id": pathlib.Path(out_name).stem,
            "fileName": out_name,
            "localPath": "/" + str(out_path).replace("\\\\", "/").split("/public/", 1)[1],
            "sourceFile": source_name,
            "sourcePage": page_index + 1,
            "assetType": asset_type,
            "recommendedUsage": usage,
            "containsLogo": page_index == 0 and not job.get("isCoreCode"),
            "needCrop": True,
            "note": "PDF页面高清导出；如局部文字较小，建议作为证据卡片或CSS裁剪使用。"
        })
print(json.dumps({"results": results}, ensure_ascii=False))
`

  fs.writeFileSync(jobPath, JSON.stringify(jobs, null, 2), 'utf8')
  fs.writeFileSync(scriptPath, python, 'utf8')

  const pythonCandidates = [
    process.env.PYTHON,
    process.env.CODEX_PYTHON,
    'C:\\Users\\LENOVO\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe',
    'python'
  ].filter(Boolean)

  for (const pythonExe of pythonCandidates) {
    const result = spawnSync(pythonExe, [scriptPath], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8'
      }
    })
    if (result.error) continue
    const output = (result.stdout || '').trim().split(/\r?\n/).at(-1)
    try {
      const parsed = JSON.parse(output)
      if (parsed.results) return parsed.results
      if (parsed.error) {
        console.warn(`PDF渲染依赖不可用：${parsed.detail}`)
        return []
      }
    } catch {
      if (result.stderr) console.warn(result.stderr)
    }
  }

  console.warn('未能渲染 PDF，请确认 Python 与 pypdfium2 可用。')
  return []
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function toPublicPath(filePath) {
  return `/${path.relative(path.join(root, 'public'), filePath).replace(/\\/g, '/')}`
}
