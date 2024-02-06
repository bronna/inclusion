<script>
    import AlertCard from "./AlertCard.svelte";

    export let alertsData
</script>

<div class="alerts">
    {#each alertsData as alertData}
        <AlertCard alertData={alertData} />
    {/each}
</div>

<style>
    .alerts {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        max-width: 100%;
    }
</style>



