import { writable, get } from "svelte/store";
import { numToWords, ordinalSuffixOf } from "../../lib/lib.js";

export class SpellSlotStore {
  
  constructor(actor) {
    this.actor = actor;
    this.fontOfMagic = this.actor.items.find(item => item.name === "Font of Magic");
    this.setup();
  }
  
  setup() {
    
    this.currSorcPoints = this.fontOfMagic.system.uses.value;
    this.maxSorcPoints = this.fontOfMagic.system.uses.max;
    this.floatingSorcPoints = writable(this.currSorcPoints);
    
    this.spellSlots = [];
    
    for (const [level, slot] of Object.entries(this.actor.system.spells)) {

      const levelNum = Number(level[level.length - 1]) || slot?.level;

      if ((!slot.override && !slot.max) || levelNum > 5) continue;

      const spellSlot = writable({
        label: ordinalSuffixOf(levelNum) + " level" + (level === "pact" ? ` pact ` : ` spell `) + "slot",
        level: levelNum,
        max: slot.override || slot.max,
        value: slot.value,
        originalValue: slot.value,
        spellPoints: levelNum,
        spellPointCost: level === "pact" ? false : (levelNum < 3 ? levelNum + 1 : levelNum + 2),
        pact: level === "pact",
        path: `system.spells.${level}.value`
      });
      
      if (level === "pact") {
        this.spellSlots.unshift(spellSlot);
      } else {
        this.spellSlots.push(spellSlot);
      }
    }
  }
  
  reset() {
    this.floatingSorcPoints.set(this.currSorcPoints);
    for (let spellSlot of this.spellSlots) {
      spellSlot.update((slot) => {
        slot.value = slot.originalValue;
        return slot;
      })
    }
  }
  
  sellSlot(spellSlot) {
    spellSlot.update(slot => {
      slot.value--;
      this.floatingSorcPoints.update((val) => {
        return val + slot.spellPoints;
      });
      return slot;
    })
  }
  
  buySlot(spellSlot) {
    spellSlot.update(slot => {
      slot.value++;
      this.floatingSorcPoints.update((val) => {
        return val - slot.spellPointCost;
      });
      return slot;
    })
  }
  
  async update() {
    const spent = [];
    const created = [];
    let first = true;
    await this.actor.update(this.spellSlots.reduce((acc, spellSlot) => {
      const slot = get(spellSlot);
      if(slot.value !== slot.originalValue){
        acc[slot.path] = slot.value;
        if(slot.value > slot.originalValue){
          const total = slot.value - slot.originalValue;
          created.push(`<p>${first ? this.actor.name : "They"} created ${numToWords(total)} ${slot.label}${total > 1 ? "s" : ""} costing ${slot.spellPointCost * (total)} Sorcery Points.</p>`)
        }else{
          const total = slot.originalValue - slot.value;
          spent.push(`<p>${first ? this.actor.name : "They"} spent ${numToWords(total)} ${slot.label}${total > 1 ? "s" : ""}, creating ${slot.spellPoints * (total)} Sorcery Points.</p>`)
        }
        first = false;
      }
      return acc;
    }, {}));
    const message = spent.concat(created);
    const newSorcPoints = get(this.floatingSorcPoints)
    if (newSorcPoints !== this.currSorcPoints) {
      message.push(`<p>In total, they ${newSorcPoints > this.currSorcPoints ? "created" : "spent"} ${Math.abs(newSorcPoints - this.currSorcPoints)}${newSorcPoints < this.currSorcPoints ? " out of their " + this.maxSorcPoints : ""} Sorcery Points.</p>`)
    }
    await this.fontOfMagic.update({
      "system.uses.value": newSorcPoints
    });
    if(message.length) {
      await ChatMessage.create({ content: message.join("") });
    }
  }
  
}
