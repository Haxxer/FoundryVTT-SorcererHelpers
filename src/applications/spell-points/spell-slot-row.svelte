<script>

  export let spellSlot;
  export let store;

  const floatingSorcPoints = store.floatingSorcPoints;

</script>

<div class="form-group" style="text-align: center;">
  <label>{$spellSlot.label} ({$spellSlot.value}/{$spellSlot.max})</label>
</div>
<div>
  {#if !$spellSlot.pact}
    <button type="button"
            disabled={$floatingSorcPoints < $spellSlot.spellPointCost}
            title={$floatingSorcPoints < $spellSlot.spellPointCost ? "You cannot afford this spell slot." : ""}
            on:click={() => { store.buySlot(spellSlot); }}>
      Spend {$spellSlot.spellPointCost} SP
    </button>
  {/if}
</div>
<div>
  <button type="button"
          disabled={$spellSlot.value === 0 || $floatingSorcPoints === store.maxSorcPoints}
          title={$floatingSorcPoints === store.maxSorcPoints ? "You cannot have more than your max Sorcery Points." : ""}
          on:click={() => { store.sellSlot(spellSlot); }}>
    Get {$spellSlot.spellPoints} SP
  </button>
</div>

<style lang="scss">

  div {
    display: flex;
    align-items: center;
  }

  button {
    height:30px;
    line-height: inherit;
  }

  button:disabled{
    opacity: 0.75;
    cursor: not-allowed;
  }

</style>