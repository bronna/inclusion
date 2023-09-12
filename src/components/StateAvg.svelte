<script>
    import { colors } from '../styles/colors';
    import BarChartMin from "./BarChartMin.svelte";

    export let stateData;

    let data

    $: {
        data = [
            {group: "eighty", value: stateData.properties.eighty * 100},
            {group: "between", value: stateData.properties.between * 100},
            {group: "forty", value: stateData.properties.forty * 100},
            {group: "separate", value: stateData.properties.separate * 100},
        ]
    }
</script>

<p class="title">
    state average
</p>

<!-- <div class="color-legend">
    <span class="setting-name" style="background-color:{colors[0]}; color:white;">inclusive</span>
    <span class="setting-name" style="background-color:{colors[1]}; color:white;">semi-inclusive</span>
    <span class="setting-name" style="background-color:{colors[2]}; color:white;">non-inclusive</span>
    <span class="setting-name" style="background-color:{colors[3]}; color:white;">separate</span> 
</div> -->

<div class="state-data">
    {#if stateData.students !== 0}
        <BarChartMin data={data} />
    {/if}
</div>

<style>
    .title {
        color: var(--dark-gray);
        font-size: 0.9rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        margin-top: -0.4rem;
        margin-bottom: 0.5rem;
        text-align: right;
        /* text-transform: uppercase; */
    }

    .color-legend {
        margin-top: 0.5rem;
        display: flex;
        justify-content: space-between;
    }

    .setting-name {
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        padding: 1px 6px;
        letter-spacing: 0.04rem;
        border-radius: 3px;
    }
</style>