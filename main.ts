import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import Katakana_Characters from 'Katakana.json'

const Katakana = Katakana_Characters.katakana;
export default class KatakanaPlugin extends Plugin {
  async onload() {
	console.log("Katakana Plugin loaded!");

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

