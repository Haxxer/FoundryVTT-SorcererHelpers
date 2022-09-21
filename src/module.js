import SpellPointsApplication from "./applications/spell-points/spell-points-application.js";

Hooks.once('ready', async function() {
  game.modules.get("sorcererhelpers").api = {
    showSpellPoints: (actor) => {
      SpellPointsApplication.show(actor);
    }
  }
});
