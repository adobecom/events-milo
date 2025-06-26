async function miloReplaceKey(miloLibs, key, sheetName) {
  try {
    const [utils, placeholders] = await Promise.all([
      import(`${miloLibs}/utils/utils.js`),
      import(`${miloLibs}/features/placeholders.js`),
    ]);

    const { getConfig } = utils;
    const { replaceKey } = placeholders;
    const config = getConfig();

    return await replaceKey(key, config, sheetName);
  } catch (error) {
    window.lana?.log(`Error trying to replace placeholder:\n${JSON.stringify(error, null, 2)}`);
    return key;
  }
}

export default miloReplaceKey;
