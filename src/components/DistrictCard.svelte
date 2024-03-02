<script>
    import { districtsData } from "../stores/stores.js"
    import { goto } from '$app/navigation'
    import InclusionRing from "./InclusionRing.svelte"

    export let districtId

    $: matchedDistrict = $districtsData.find(district => district.properties.GEOID === districtId)
</script>

{#if matchedDistrict}
    <a on:click={() => goto(`/${districtId}`)} class="card-link">
        <div class="card">
            <div class="card-title">{matchedDistrict.properties["Institution Name"]}</div>
            <div class="inclusion-ring-container">
                <div class="metric-content">
                    <InclusionRing value={matchedDistrict.properties.decile} weighted_inclusion={matchedDistrict.properties.weighted_inclusion} />
                </div>
                {#if matchedDistrict.properties["Total Student Count"] < 500}
                    <span class="uncertainty">*</span>
                {/if}
            </div>
            {#if matchedDistrict.properties["Total Student Count"]}
                <div class="card-info"><span class="highlight">{matchedDistrict.properties["Total Student Count"]}</span> students with IEPs</div>
            {:else}
                <div class="card-info">No data available</div>
            {/if}
            
        </div>
    </a>
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
        justify-content: space-between;
        align-items: center;
        width: 140px;
        min-height: 140px;
    }

    .card-title {
        font-size: 1.1rem;
        font-weight: 700;
        font-family: 'Bitter', serif;
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
        max-width: 100%;
        overflow-wrap: break-word;
        flex-grow: 1;
    }

    .card-info {
        font-size: 0.9rem;
        font-weight: 400;
        margin-top: 1rem;
        text-align: center;
        line-height: 1.2rem;
    }

    .inclusion-ring-container {
        display: flex;
        align-items: center; /* Vertically center the contents */
    }

    .metric-content {
        display: flex;
        align-items: center; /* Ensure the InclusionRing is also centered if necessary */
    }

    .uncertainty {
        margin-left: 4px; /* Adjust as needed for spacing */
        align-self: flex-start; /* Align asterisk to the top */
        font-size: 1.6rem;
        color: var(--dark-gray);
        margin-left: 0.25rem;
    }

    .highlight {
        font-weight: 700;
        font-size: 1rem;
    }

    .card-link {
        text-decoration: none;
        color: inherit;
    }
</style>
