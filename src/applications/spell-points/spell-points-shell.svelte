<script>

  import { getContext } from 'svelte';
  import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
  import SpellSlotRow from "./spell-slot-row.svelte";
  import { SpellSlotStore } from "./SpellSlotStore.js";

  const { application } = getContext('external');

  export let actor;
  export let elementRoot;
  let form;

  const store = new SpellSlotStore(actor);

  const floatingSorcPoints = store.floatingSorcPoints;

  async function submit() {
    await store.update();
    application?.options?.resolve();
    application.close();
  }

  function requestSubmit() {
    form.requestSubmit();
  }

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>

  <form bind:this={form} on:submit|once|preventDefault={submit} autocomplete=off>

    <div class="sorc-points bottom-border-padding">

      You currently have <strong>{$floatingSorcPoints} / {store.maxSorcPoints}</strong> Sorcery Points.
      <a style="font-size: 1rem; margin-left: 0.5rem;" on:click={() => { store.reset() }}><i class="fas fa-undo"></i></a>

    </div>

    <div class="sorc-grid">

      <div class="sorc-header">
        Spell Slot
      </div>
      <div class="sorc-header">
        Create slot
      </div>
      <div class="sorc-header">
        Convert to
      </div>

    </div>

    <div class="sorc-grid bottom-border-padding">

      {#each store.spellSlots as spellSlot, index (index)}
        <SpellSlotRow {spellSlot} {store}/>
      {/each}

    </div>

    <footer>
      <button type="button" on:click|once={requestSubmit}>
        <i class="fas fa-magic"></i> Submit changes
      </button>
    </footer>

  </form>

</ApplicationShell>

<style lang="scss">

  .sorc-layout{
    display: flex;

    & > * {
      flex: 1;
    }
  }

  .sorc-points{
    text-align: center;
    font-size: 1.25rem;
  }

  .bottom-border-padding {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0,0,0,0.5);
  }

  .sorc-header{
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .sorc-grid {
    display: grid;
    grid-template-columns: 1fr 0.5fr 0.5fr;
    gap: 0.25rem;
  }

  button {
    background-color: #d9a743;
  }

</style>
