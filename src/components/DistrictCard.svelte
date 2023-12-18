<script>
    import { districtsData } from "../stores/stores.js"
    import InclusionRing from "./InclusionRing.svelte"

    export let districtId

    $: matchedDistrict = $districtsData.find(district => district.properties.GEOID === districtId)

    function handleClick(district) {
        console.log('clicked')
    }
</script>

{#if matchedDistrict}
    <div class="card" on:click={() => handleClick(matchedDistrict)}>
        <div class="card-title">{matchedDistrict.properties["Institution Name"]}</div>
        <InclusionRing value={matchedDistrict.properties.decile} weighted_inclusion={matchedDistrict.properties.weighted_inclusion} />
        <div class="card-info"><span class="highlight">{matchedDistrict.properties["Total Student Count"]}</span> students with IEPs</div>
    </div>
{/if}

<style>
    .card {
        flex: 0 0 auto;
        cursor: pointer;
        border-radius: 1rem;
        box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
        padding: 1.5rem 1rem;
        margin: 1.5rem 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 140px;
    }

    .card-title {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 1rem;
        font-family: 'Bitter', serif;
        text-align: center;
    }

    .card-info {
        font-size: 0.9rem;
        font-weight: 400;
        margin-top: 1rem;
        text-align: center;
        line-height: 1.2rem;
    }

    .highlight {
        font-weight: 700;
        font-size: 1rem;
    }
</style>
