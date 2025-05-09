export class DictionaryManager {
  #dictionary = {};

  static getPlaceholdersPath(config, sheet) {
    const path = `${config.locale.contentRoot}/placeholders.json`;
    const query = sheet !== 'default' && typeof sheet === 'string' && sheet.length ? `?sheet=${sheet}` : '';
    return `${path}${query}`;
  }

  async fetchDictionary({ config, sheet }) {
    try {
      const path = DictionaryManager.getPlaceholdersPath(config, sheet);
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch dictionary: ${response.status}`);
      }
      const data = await response.json();
      this.#dictionary = Object.freeze(data.data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {}));
    } catch (error) {
      window.lana?.log(`Error fetching dictionary:\n${JSON.stringify(error)}`);
      throw error;
    }
  }

  getValue(key) {
    return this.#dictionary[key] || key;
  }
}

export const dictionaryManager = new DictionaryManager();
