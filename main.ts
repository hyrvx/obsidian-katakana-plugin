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
  
  // Functions responsible for loading / saving settings
  async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }
  async saveSettings() { await this.saveData(this.settings) };
  

  async onload() {
  // Load settings
  await this.loadSettings();

	console.log("Katakana Plugin loaded!");
  
  // Create new Statusbar Item
  let katakana_character = this.addStatusBarItem();
  displayNewKatakana(katakana_character, this.settings.toggleQuotations, getRandomKatakanaIndex());

  // Create Settings Tab
  this.addSettingTab(new KatakanaPluginSettingsTab(this.app, this, katakana_character));

  
  this.addCommand({
      id: "load-new-katakana",
      name: "Load new Katakana",
      callback: () => {
        displayNewKatakana(katakana_character, this.settings.toggleQuotations, getRandomKatakanaIndex());
      }
    }
  )
  }

  async onunload() {
    // Release any resources configured by the plugin.
	console.log("Katakana Plugin unloaded!");
  }
}

class KatakanaPluginSettingsTab extends PluginSettingTab
{
  plugin: KatakanaPlugin;
  status_bar_item: HTMLElement;

  constructor(app: App, plugin: KatakanaPlugin, status_bar_item: HTMLElement) {
    super(app, plugin);
    this.plugin = plugin;
    this.status_bar_item = status_bar_item;
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
        displayNewKatakana(this.status_bar_item, value, getRandomKatakanaIndex())
        //new Notice("Will be updated when the next katakana is loaded.")
        
        await this.plugin.saveSettings();
      })
    )
  }
}

// Changes the displayed character
async function displayNewKatakana(status_bar_item: HTMLElement, quotations: boolean, katakana_index: number) {

  if (quotations)
    status_bar_item.textContent = "「" + Katakana_Characters.katakana[katakana_index].character + " - " + Katakana_Characters.katakana[katakana_index].pronunciation + "」";
  else 
    status_bar_item.textContent = Katakana_Characters.katakana[katakana_index].character + " - " + Katakana_Characters.katakana[katakana_index].pronunciation;

}

function getRandomKatakanaIndex(): number
{
  let randomIndex: number = Math.floor(Math.random() * Katakana_Characters.katakana.length);
  return randomIndex;
}

