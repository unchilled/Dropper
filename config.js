/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
import {
    @Vigilant,
    @ButtonProperty,
    @CheckboxProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SliderProperty
} from "Vigilance";

@Vigilant("dropper", guiTitle = "§dDropper")
class Settings {
    @CheckboxProperty({
        name: "§fSilly Dev Messages",
        category: "§fSettings",
        subcategory: '§9General',
        description: 'Disable / enable silly messages from unchilled in the chat during games.',
    })
    sillyMessages = true;

    @CheckboxProperty({
        name: "§fShow Hypixel Time",
        category: "§fSettings",
        subcategory: '§9General',
        description: 'Disable / enable showing Hypixel time in /dropstats and at the end of games.',
    })
    hypixelTime = true;

    @CheckboxProperty({
        name: "§fShow Actual Time",
        category: "§fSettings",
        subcategory: '§9General',
        description: 'Disable / enable showing actual time in /dropstats and at the end of games.',
    })
    actualTime = true;

    @CheckboxProperty({
        name: "§fAutoGG",
        category: "§fSettings",
        subcategory: '§9General',
        description: 'Disable / enable sending "gg" at the end of the game.',
    })
    autoGG = true;

    constructor() {
        this.initialize(this);
    }
}

export default new Settings();
