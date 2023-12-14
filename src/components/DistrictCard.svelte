<script>
    import InclusionRing from "./InclusionRing.svelte";

    export let district

    function handleClick(district) {
        console.log('clicked')
    }
</script>

<div class="card" on:click={() => handleClick(district)}>
    <div class="card-title">{district.properties["Institution Name"]}</div>
    <InclusionRing value={district.properties.decile} weighted_inclusion={district.properties.weighted_inclusion} />
    <div class="card-info"><span class="highlight">{district.properties["Total Student Count"]}</span> students with IEPs</div>
</div>

<style>
    .card {
        cursor: pointer;
        border-radius: 1rem;
        box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
        padding: 2rem 2rem;
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
