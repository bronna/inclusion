<script>
    import InclusionRing from "./InclusionRing.svelte";

    export let district

    function handleClick(district) {
        console.log('clicked')
    }
</script>

<div class="card" on:click={() => handleClick(district)}>
    <div>{district.properties["Institution Name"]}</div>
    <div>{district.properties.decile}</div>
    <div>{district.properties.nAlerts}</div>
    <div>{district.properties["Total Student Count"]}</div>
    <InclusionRing value={district.properties.decile} weighted_inclusion={district.properties.weighted_inclusion} />
</div>

<style>
    .card {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        cursor: pointer;
    }

    .card:hover {
        background-color: #f9f9f9;
    }

    .card > div:nth-child(1) {
        text-align: left;
    }

    .card > div:nth-child(2),
    .card > div:nth-child(3) {
        text-align: center;
    }

    .card > div:last-child {
        text-align: right;
    }
</style>
