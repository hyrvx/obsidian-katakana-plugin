import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import Katakana_Characters from 'Katakana.json'

interface KatakanaPluginSettings {
  toggleQuotations: boolean;
}

const DEFAULT_SETTINGS: Partial<KatakanaPluginSettings> = {
  toggleQuotations: true,
}

const Katakana = Katakana_Characters.katakana;
export default class KatakanaPlugin extends Plugin {
  settings: KatakanaPluginSettings;
  
  // Load / Save Settings
  async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }
  async saveSettings() { await this.saveData(this.settings) };
  

  async onload() {

	console.log("Katakana Plugin loaded!");

  // Create Settings Tab
  this.addSettingTab(new KatakanaPluginSettings(this.app, this));

  // Create new Statusbar Item
  let katakana_item = this.addStatusBarItem();
  displayNewKatakana(katakana_item);
  
  this.addCommand({
      id: "load-new-katakana",
      name: "Load new Katakana",
      callback: () => {
        displayNewKatakana(katakana_item);
      }
    }
  )
	
  }
  async onunload() {
    // Release any resources configured by the plugin.
	console.log("Katakana Plugin unloaded!");
  }
}

class KatakanaPluginSettings extends PluginSettingTab
{
  plugin: KatakanaPlugin;

  constructor(app: App, plugin: KatakanaPlugin) {
    super(app, plugin);
    plugin = this.plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
    .setName("Display Quotations")
    .setDesc("Enable japanese style quotations")
    .addToggle((toggle) =>
      toggle
      .setValue(this.plugin.settings.toggleQuotations)
      .onChange(async (value) => {
        this.plugin.settings.toggleQuotations = value;
        await this.plugin.saveSettings();
      })
    )
  }
}

async function displayNewKatakana(katakana_item: HTMLElement) {
  // Change the Text Content of the Statusbar Item to a new random Katakana Character
  // TODO: Add a setting to toggle the single quotation marks
  katakana_item.textContent = "「" + (await getRandomKatakana()).character + " - " + (await getRandomKatakana()).pronunciation + "」";
}

async function getRandomKatakana()
{
  let randomIndex: number = Math.floor(Math.random() * Katakana_Characters.katakana.length);
  return Katakana_Characters.katakana[randomIndex];
}

