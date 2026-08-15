const mod = window.opencodeHost.forScript()

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

const translate = (text) => {
  const direct = translations.get(text)
  if (direct) return direct

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

  return undefined
}

const translateElement = (element) => {
  const text = element.textContent?.trim() ?? ""
  const translation = translate(text)
  if (!translation) return

  const textNodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE)
  if (element.children.length && textNodes.length === 1 && textNodes[0].textContent?.trim() === text) {
    textNodes[0].textContent = translation
    return
  }

  element.textContent = translation
}

mod.ui.observe(
  ".desktop-app-menu [data-slot='dropdown-menu-item-label'], .desktop-app-menu-heading",
  translateElement,
)

mod.ui.observe(
  "[data-slot='tabs-v2-trigger'][data-value='mods'] [data-slot='tabs-v2-trigger-content']",
  translateElement,
)

mod.ui.observe(
  ".settings-v2-panel .settings-v2-tab-title, .settings-v2-panel [data-component='button-v2'], .settings-v2-panel [data-slot='settings-v2-row-title'], .settings-v2-panel [data-slot='settings-v2-row-description'], .settings-v2-panel .settings-v2-servers-status",
  (element) => {
    const panel = element.closest(".settings-v2-panel")
    const title = panel?.querySelector(".settings-v2-tab-title")?.textContent?.trim()
    if (title !== "MODs" && title !== "模组") return
    translateElement(element)
  },
)

mod.ui.observe(
  "[data-component='dialog-v2'] [data-slot='dialog-header-title'], [data-component='dialog-v2'] [data-slot='dialog-body'] p, [data-component='dialog-v2'] [data-component='button-v2'], [data-component='dialog-v2'] [data-slot='dialog-body'] span",
  translateElement,
)
