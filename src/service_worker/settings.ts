const SETTINGS_KEY = "Settings"

export function update_settings(settings: Object) {

  chrome.storage.sync.set({ 
    [SETTINGS_KEY]: settings 
  });
}
