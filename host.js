const mod = window.opencodeHost.forScript()

const report = (status, message) => {
  const reportRuntime = mod.desktop?.mods?.reportRuntime
  if (typeof reportRuntime !== "function") return
  void reportRuntime(mod.id, "host", status, message)
}

const translations = new Map([
  ["File", "文件"],
  ["Edit", "编辑"],
  ["View", "视图"],
  ["Go", "转到"],
  ["Window", "窗口"],
  ["Help", "帮助"],
  ["New Session", "新建会话"],
  ["Open Project...", "打开项目..."],
  ["Settings", "设置"],
  ["New Window", "新建窗口"],
  ["Close Window", "关闭窗口"],
  ["Undo", "撤销"],
  ["Redo", "重做"],
  ["Cut", "剪切"],
  ["Copy", "复制"],
  ["Paste", "粘贴"],
  ["Delete", "删除"],
  ["Select All", "全选"],
  ["Toggle Sidebar", "切换侧边栏"],
  ["Toggle Terminal", "切换终端"],
  ["Toggle File Tree", "切换文件树"],
  ["Reload", "重新加载"],
  ["Toggle Developer Tools", "切换开发者工具"],
  ["Actual Size", "实际大小"],
  ["Zoom In", "放大"],
  ["Zoom Out", "缩小"],
  ["Toggle Full Screen", "切换全屏"],
  ["Back", "返回"],
  ["Forward", "前进"],
  ["Previous Session", "上一个会话"],
  ["Next Session", "下一个会话"],
  ["Previous Project", "上一个项目"],
  ["Next Project", "下一个项目"],
  ["Minimize", "最小化"],
  ["Maximize", "最大化"],
  ["OpenCode Documentation", "OpenCode 文档"],
  ["Support Forum", "支持论坛"],
  ["Export Logs...", "导出日志..."],
  ["Share Feedback", "提交反馈"],
  ["Report a Bug", "报告问题"],
  ["MODs", "模组"],
  ["Debug", "调试"],
  ["All MODs", "全部模组"],
  ["Copy listener", "复制监听地址"],
  ["Listener copied", "监听地址已复制"],
  ["Copy logs", "复制日志"],
  ["Logs copied", "日志已复制"],
  ["Copy failed", "复制失败"],
  ["Clear", "清除"],
  ["MOD Debug Console", "模组调试台"],
  ["No MOD debug events recorded in this app session.", "本次应用会话中没有记录到模组调试事件。"],
  ["Could not copy to the system clipboard.", "无法复制到系统剪贴板。"],
  ["Open folder", "打开文件夹"],
  ["Refresh", "刷新"],
  ["Safe mode", "安全模式"],
  ["Disable all MODs until MOD loading is enabled again.", "在重新启用 MOD 加载前，禁用所有模组。"],
  ["No MODs found in the MOD folder.", "MOD 文件夹中未找到模组。"],
  ["MOD load conflict", "模组加载冲突"],
  ["Declared conflict", "已声明冲突"],
  ["Potential conflict", "潜在冲突"],
  ["Cancel", "取消"],
  ["Repair with AI", "使用 AI 修复"],
  ["Keep existing priority", "保留现有优先级"],
])

const translateDiagnosticMessage = (message) => {
  const direct = new Map([
    ["Host script initialized its MOD runtime.", "宿主脚本已初始化 MOD 运行时。"],
    ["MOD host runtime is not active.", "MOD 宿主运行时未激活。"],
    ["Host script loaded.", "宿主脚本已加载。"],
    ["Host script failed to load or execute.", "宿主脚本加载或执行失败。"],
    ["Stylesheet loaded.", "样式表已加载。"],
    ["Stylesheet failed to load.", "样式表加载失败。"],
    ["Sidebar panel finished loading.", "侧边栏面板已加载完成。"],
    ["Sidebar panel failed to load.", "侧边栏面板加载失败。"],
    ["Manifest and declared local files are valid.", "清单及声明的本地文件校验通过。"],
    ["Bootstrap completed before the server module was imported.", "服务模块导入前的引导已完成。"],
    ["Sidecar started with this server plugin enabled.", "已启用此服务插件并启动 Sidecar。"],
    [
      "Host script loaded but did not initialize its MOD runtime. Call window.opencodeHost.forScript() at the top level.",
      "宿主脚本已加载，但未初始化 MOD 运行时。请在顶层调用 window.opencodeHost.forScript()。",
    ],
  ]).get(message)
  if (direct) return direct

  const debugRegistered = message.match(/^Host debug action "(.+)" is not registered\.$/)
  if (debugRegistered) return `未注册宿主调试操作“${debugRegistered[1]}”。`

  const debugCompleted = message.match(/^Host debug action "(.+)" completed\.$/)
  if (debugCompleted) return `宿主调试操作“${debugCompleted[1]}”已完成。`

  const debugFailed = message.match(/^Host debug action "(.+)" failed\.$/)
  if (debugFailed) return `宿主调试操作“${debugFailed[1]}”执行失败。`

  const executionFailed = message.match(/^Host script execution failed: (.+)$/)
  if (executionFailed) return `宿主脚本执行失败：${executionFailed[1]}`

  const observerFailed = message.match(/^UI observer failed: (.+)$/)
  if (observerFailed) return `界面观察器运行失败：${observerFailed[1]}`

  const translationInitial = message.match(/^Translation initial scan changed (\d+) element\(s\)\.$/)
  if (translationInitial) return `汉化初始扫描已修改 ${translationInitial[1]} 个元素。`

  const translationScan = message.match(/^Translation scan completed; (\d+) element\(s\) changed\.$/)
  if (translationScan) return `汉化扫描已完成；修改了 ${translationScan[1]} 个元素。`

  const observerStartFailed = message.match(/^Translation observer could not start: (.+)$/)
  if (observerStartFailed) return `汉化观察器无法启动：${observerStartFailed[1]}`

  return message
}

const translate = (text) => {
  const direct = translations.get(text)
  if (direct) return direct

  const loaderStatus = text.match(/^MOD Loader v(.+) · (Enabled|Safe mode)$/)
  if (loaderStatus) return `MOD 加载器 v${loaderStatus[1]} · ${loaderStatus[2] === "Enabled" ? "已启用" : "安全模式"}`

  const priority = text.match(/^v(.+) · Priority (-?\d+)$/)
  if (priority) return `v${priority[1]} · 优先级 ${priority[2]}`

  const incompatible = text.match(/^v(.+) · Incompatible with this OpenCode version$/)
  if (incompatible) return `v${incompatible[1]} · 与当前 OpenCode 版本不兼容`

  const prioritize = text.match(/^Prioritize (.+)$/)
  if (prioritize) return `优先 ${prioritize[1]}`

  const conflict = text.match(/^(.+) · (Declared conflict|Potential conflict)$/)
  if (conflict) return `${conflict[1]} · ${translations.get(conflict[2])}`

  const conflictDescription = text.match(
    /^(.+) overlaps with enabled MOD contributions\. The higher-priority MOD loads later and wins where load order can resolve the overlap\.$/,
  )
  if (conflictDescription) {
    return `${conflictDescription[1]} 与已启用模组的贡献内容重叠。优先级更高的模组会在后加载，并在加载顺序能够解决重叠时生效。`
  }

  const debugConsole = text.match(/^MOD Debug Console · (.+)$/)
  if (debugConsole) return `模组调试台 · ${debugConsole[1]}`

  const noModDebugEvents = text.match(/^No debug events recorded for (.+) in this app session\.$/)
  if (noModDebugEvents) return `本次应用会话中没有记录到 ${noModDebugEvents[1]} 的调试事件。`

  const debugStatus = text.match(/^(Debug error|Debug) · (.+) \((.+)\)$/)
  if (debugStatus) return `${debugStatus[1] === "Debug error" ? "调试错误" : "调试"} · ${debugStatus[2]} (${debugStatus[3]})`

  const debugLog = text.match(/^(\[[^\]]+\])\s+(READY|ERROR)\s+(\S+)\s+(\S+):\s+(.+)$/)
  if (debugLog) {
    const phase = new Map([
      ["manifest", "清单"],
      ["host", "宿主"],
      ["server", "服务"],
      ["server-bootstrap", "服务引导"],
      ["sidebar", "侧边栏"],
      ["style", "样式"],
      ["trigger", "触发"],
    ]).get(debugLog[4])
    return `${debugLog[1]} ${debugLog[2] === "READY" ? "就绪" : "错误"} ${debugLog[3]} ${phase ?? debugLog[4]}: ${translateDiagnosticMessage(debugLog[5])}`
  }

  return undefined
}

const translateElement = (element) => {
  const text = element.textContent?.trim() ?? ""
  const translation = translate(text)
  if (!translation) return false

  const textNodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE)
  if (element.children.length && textNodes.length === 1 && textNodes[0].textContent?.trim() === text) {
    textNodes[0].textContent = translation
    return true
  }

  element.textContent = translation
  return true
}

const menuSelector = ".desktop-app-menu [data-slot='dropdown-menu-item-label'], .desktop-app-menu-heading"
const modsTabSelector = "[data-slot='tabs-v2-trigger'][data-value='mods'] [data-slot='tabs-v2-trigger-content']"
const modsSettingsSelector =
  ".settings-v2-tab-title, [data-component='button-v2'], [data-slot='settings-v2-row-title'], [data-slot='settings-v2-row-description'], .settings-v2-servers-status, .settings-v2-tab-header-row span.text-xs, .max-h-80 > div"

const isModsPanel = (panel) => {
  const title = panel.querySelector(".settings-v2-tab-title")?.textContent?.trim()
  return title === "MODs" || title === "模组"
}

const translateModsSettings = () => {
  let translated = 0
  document.querySelectorAll(".settings-v2-panel").forEach((panel) => {
    if (!isModsPanel(panel)) return
    panel.querySelectorAll(modsSettingsSelector).forEach((element) => {
      if (translateElement(element)) translated += 1
    })
  })
  return translated
}

const scanTranslations = () => {
  let translated = 0
  document.querySelectorAll(menuSelector).forEach((element) => {
    if (translateElement(element)) translated += 1
  })
  document.querySelectorAll(modsTabSelector).forEach((element) => {
    if (translateElement(element)) translated += 1
  })
  return translated + translateModsSettings()
}

requestAnimationFrame(() => {
  const translated = scanTranslations()
  report("ready", `Translation initial scan changed ${translated} element(s).`)
})

const observe = (selector, callback) => {
  try {
    mod.ui.observe(selector, callback)
  } catch (error) {
    report("error", `Translation observer could not start: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

observe(menuSelector, translateElement)
observe(modsTabSelector, translateElement)
observe(`.settings-v2-panel ${modsSettingsSelector}`, (element) => {
  const panel = element.closest(".settings-v2-panel")
  if (panel && isModsPanel(panel)) translateElement(element)
})
observe(
  "[data-component='dialog-v2'] [data-slot='dialog-header-title'], [data-component='dialog-v2'] [data-slot='dialog-body'] p, [data-component='dialog-v2'] [data-component='button-v2'], [data-component='dialog-v2'] [data-slot='dialog-body'] span",
  translateElement,
)

if (typeof mod.debug?.register === "function") {
  mod.debug.register("reapply-translations", () => {
    const translated = scanTranslations()
    report("ready", `Translation scan completed; ${translated} element(s) changed.`)
  })
}
