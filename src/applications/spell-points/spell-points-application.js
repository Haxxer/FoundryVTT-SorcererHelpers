import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import SpellPointShell from "./spell-points-shell.svelte";

export default class SpellPointsApplication extends SvelteApplication {
  
  constructor(actor, options = {}) {
    
    super({
      id: `spell-points-${actor.id}`,
      title: "Spell Points",
      svelte: {
        class: SpellPointShell,
        target: document.body,
        props: {
          actor
        }
      },
      close: () => this.options.resolve?.(null),
      ...options
    });
  }
  
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 400,
      resizable: false
    })
  }
  
  static getActiveApp(id) {
    return Object.values(ui.windows).find(app => app.id === `spell-points-${id}`)
  }
  
  static async show(actor, options = {}, dialogData = {}) {
    const app = this.getActiveApp(actor.id);
    if (app) return app.render(false, { focus: true });
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(actor, options, dialogData).render(true);
    })
  }
}