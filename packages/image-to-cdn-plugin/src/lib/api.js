/**
 * 调用 Figma REST API 导出节点图片。
 * @param {{ fileKey: string, nodeIds: string[], scale: number, format: string, figmaApiKey: string }} params
 * @returns {Promise<{ key: string, url: string }[]>}
 */
export async function requestFigmaImages({ fileKey, nodeIds, scale, format, figmaApiKey }) {
  // Figma 图片接口的 ids 用冒号格式，这里把 URL 里的横线格式（如 6705-22289）统一转成冒号
  const ids = nodeIds.map((id) => id.replace("-", ":"));
  const paramsString = `ids=${ids.join(",")}&scale=${scale}&format=${format}`;
  const response = await fetch(`https://api.figma.com/v1/images/${fileKey}?${paramsString}`, {
    headers: { "X-Figma-Token": figmaApiKey }
  });
  const data = await response.json();
  if (data.err) {
    throw new Error(data.err);
  }
  return Object.entries(data.images).map(([key, value]) => ({ key, url: value }));
}

/**
 * 上传图片到 OSS，返回 CDN 链接。
 * @param {{ src: string, isCompressed?: boolean, width?: number, height?: number }} option
 * @returns {Promise<string>}
 */
export async function requestUploadAsset({ src, isCompressed = false, width = 0, height = 0 }) {
  // 上传地址走环境变量，避免内部服务地址写死在源码里随 git 泄露
  const uploadUrl = process.env.IMAGE_TO_CDN_PLUGIN_UPLOAD_URL;
  if (!uploadUrl) {
    throw new Error("请先设置环境变量 IMAGE_TO_CDN_PLUGIN_UPLOAD_URL");
  }
  const res = await fetch(uploadUrl, {
    method: "POST",
    body: JSON.stringify({ imgUrl: src, isCompressed, size: { width, height } }),
    headers: { "Content-Type": "application/json" }
  }).then((r) => r.json());

  const { code, data, message } = res;
  if (code !== 1) {
    throw new Error(message);
  }
  return data.remoteUrl;
}
