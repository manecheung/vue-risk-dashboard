/**
 * helpers.js
 * 
 * 包含项目通用的辅助函数，如文件下载、CSV解析和样式计算等。
 */

/**
 * 触发浏览器下载文件。
 * @param {string} filename - 下载的文件名。
 * @param {string} content - 文件内容。
 * @param {string} mimeType - 文件的MIME类型。
 * @param {boolean} addBOM - 是否在文件头部添加BOM（用于修复Excel打开UTF-8 CSV的乱码问题）。
 */
export const downloadFile = (filename, content, mimeType = 'text/plain', addBOM = false) => {
  const finalContent = addBOM ? '\uFEFF' + content : content;
  const blob = new Blob([finalContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * 一个强大且可配置的CSV解析器。
 * @param {File} file - 用户上传的 File 对象。
 * @param {object} [options={}] - 解析选项。
 * @param {boolean} [options.hasHeader=true] - CSV是否包含表头行。
 *   - `true`: 返回对象数组 `[{ header1: value1 }, ...]`。
 *   - `false`: 返回二维数组 `[['value1', 'value2'], ...]`。
 * @param {string[]} [options.requiredHeaders=[]] - 当 hasHeader 为 true 时，必需的表头列名。
 * @param {string} [options.commentChar='#'] - 注释行的起始字符，这些行将被忽略。
 * @returns {Promise<object[]|string[][]>} 解析后的数据。
 */
export const parseCsv = (file, options = {}) => {
  // 默认配置
  const config = {
    hasHeader: true,
    requiredHeaders: [],
    commentChar: '#',
    ...options
  };

  // 这个正则表达式可以正确处理被双引号包裹的、内部含有逗号的字段。
  const parseLine = (line) => line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(field => field.trim().replace(/^"|"$/g, '')) || [];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;

        // 1. 预处理：按行分割，移除空行和注释行
        const allRows = text.split(/[\r\n]+/)
          .map(row => row.trim())
          .filter(row => row && (!config.commentChar || !row.startsWith(config.commentChar)));

        if (allRows.length === 0) {
          return resolve([]); // 文件为空或只包含注释
        }

        // 2. 根据 hasHeader 选项决定处理方式
        if (config.hasHeader) {
          // --- 场景1：处理带表头的表格型CSV (用于供应链列表) ---
          if (allRows.length < 2) throw new Error("CSV文件为空或只包含表头。");

          const headerRow = allRows.shift();
          const headers = parseLine(headerRow);

          // 验证必需的表头
          if (config.requiredHeaders.length > 0) {
            const missingHeaders = config.requiredHeaders.filter(h => !headers.includes(h));
            if (missingHeaders.length > 0) {
              throw new Error("CSV文件缺少必要的列头: " + missingHeaders.join(', '));
            }
          }

          const data = allRows.map(row => {
            const values = parseLine(row);
            const item = {};
            headers.forEach((header, i) => {
              item[header] = values[i] || '';
            });
            return item;
          });
          resolve(data);

        } else {
          // --- 场景2：处理无表头的指令型CSV (用于风险模拟图) ---
          const data = allRows.map(row => parseLine(row));
          resolve(data);
        }

      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error("无法读取文件，请检查文件是否损坏或编码是否正确。"));
    };
    reader.readAsText(file, 'UTF-8');
  });
};


/**
 * 根据风险等级返回对应的CSS类名。
 * @param {'高' | '中' | '低'} level - 风险等级。
 * @returns {{text: string, bg: string}} 包含文本和背景样式的对象。
 */
export const getRiskStyling = (level) => {
  const styles = {
    '高': { text: 'risk-high', bg: 'risk-high-bg' },
    '中': { text: 'risk-medium', bg: 'risk-medium-bg' },
    '低': { text: 'risk-low', bg: 'risk-low-bg' }
  };
  return styles[level] || { text: 'text-slate-400', bg: 'bg-slate-700/50' };
};