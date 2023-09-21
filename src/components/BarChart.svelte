<script>
    import { scaleOrdinal } from 'd3';
    import { colors } from '../styles/colors';

    export let data;
    
    let colorScale = scaleOrdinal()
            .domain(data.map(d => d.group))
            .range(colors);

    let containerWidth;
    let gapPercentage = 0;

    $: if (containerWidth) {
        gapPercentage = (1 / containerWidth) * 100;
    }
    
    function shouldAddBorder(i) {
        // Check that the bar at the current index has a non-zero value
        if (data[i].value <= 0) return false;

        // If the current bar is the last bar in the series, return false
        if (i === data.length - 1) return false;

        // Check the bars that come after the current one
        for (let j = i + 1; j < data.length; j++) {
            // If any subsequent bar has a non-zero value, return true
            if (data[j].value > 0) return true;
        }

        // If all subsequent bars are zero-value bars, return false
        return false;
    }
</script>

<div bind:clientWidth={containerWidth} class="bar-chart">
    {#each data as d, i (d.group)}
        <div class={`bar ${shouldAddBorder(i) ? 'add-border' : ''}`} 
             style="background-color: {colorScale(d.group)}; width: calc({d.value}% - {gapPercentage}%);">
            <!-- {#if d.value >= 1.4}
                <span class="bar-text">{(d.value).toFixed(0)}{d.value > 5 ? '%' : ''}</span>
            {/if} -->
        </div>
    {/each}
</div>

<style>
.bar-chart {
    width: 100%;
    height: 25px;
    display: flex;
    align-items: center;
}

.bar {
    height: 100%;
    position: relative;
}

.add-border {
    border-right: 1px solid white;
}

.bar-text {
    font-size: 0.85rem;
    letter-spacing: 0.05rem;
    font-weight: 400;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
