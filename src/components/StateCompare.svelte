<script>
    import { colors } from '../styles/colors';
    import BarChartMin from "./BarChartMin.svelte";
    // import InclusionRing from './InclusionRing.svelte';

    export let stateData;

    let data

    $: {
        data = [
            {group: "inclusive", value: stateData.properties["LRE Students >80%"]},
            {group: "semiInclusive", value: stateData.properties["LRE Students >40% <80%"]},
            {group: "nonInclusive", value: stateData.properties["LRE Students <40%"]},
            {group: "separate", value: stateData.properties["LRE Students Separate Settings"]},
        ]
    }
</script>

<!-- <div class="metric">
    <p class="title">
        statewide<br> 
        <span class="align-baseline">inclusion score</span>
    </p>
    <p class="metric-value">
        <InclusionRing value={stateData.properties.weighted_inclusion.toFixed(2) * 100} />
    </p>
</div> -->
<p class="title">statewide</p>

<div class="state-data">
    {#if stateData.properties["Total Student Count"] !== 0}
        <BarChartMin data={data} />
    {/if}
</div>

<style>
    /* .metric {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
    }

    .title, .metric-value {
        line-height: 1.2;
        margin: 0;
    }

    .title .align-baseline {
        align-self: baseline;
    } */

    .title {
        color: var(--dark-gray);
        font-size: 0.9rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        text-align: right;
        margin-bottom: 5px;
        /* margin-right: 8px; */
    }

    /* .metric-value {
        color: var(--color-text);
        font-size: 1.9rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        text-align: right;
    } */
</style>