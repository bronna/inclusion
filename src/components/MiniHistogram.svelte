<script>
    import * as d3 from 'd3'
    import { districtsData, largeDistrictsData } from '../stores/stores'
    import { colors } from '../styles/colors'

    export let metric1 // for line overlay
    export let currentMetric1Value // for line overlay
    export let metric2 // for hist bins, if applicable
    export let largeDistricts = false

    let data1
    let metric1Domain
    let data2
    let bins
    let xScale, yScale
    let xPos
    const margin = { top: 10, right: 10, bottom: 30, left: 10 }
    const width = 300 - margin.left - margin.right
    const height = 120 - margin.top - margin.bottom

    let metricScale = d3.scaleLinear().range([0, width])

    // extract the data values from districtsData for the specified metrics
    $: data1 = $largeDistrictsData // make dynamic?
        .filter(district => district.properties[metric1] > 0)
        .map(district => district.properties[metric1])

    $: data2 = (largeDistricts ? $largeDistrictsData : $districtsData)
        .filter(district => district.properties[metric2] > 0)
        .map(district => district.properties[metric2])
    $: if (data2 && data2.length > 0) {
        createHistogram()
    }

    $: if (data1 && data1.length > 0) {
        metric1Domain = d3.extent(data1);
        metricScale.domain(metric1Domain)
        console.log(`Domain: ${metric1Domain}`);
    }

    $: if (metric1Domain && currentMetric1Value !== undefined) {
        if (currentMetric1Value < metric1Domain[0]) {
            xPos = metricScale(metric1Domain[0])
        } else if (currentMetric1Value > metric1Domain[1]) {
            xPos = metricScale(metric1Domain[1])
        } else {
            xPos = metricScale(currentMetric1Value)
        }

        console.log(`xPos: ${xPos}`);
    }

    function createHistogram() {
        const thresholds = Array.from({ length: 10 }, (_, i) => i + 1) // make dynamic

        // create the histogram layout
        const histogram = d3.histogram()
            .value(d => d)
            .domain([1, 11]) // make dynamic
            .thresholds(thresholds)

        bins = histogram(data2)

        const maxBinHeight = d3.max(bins, d => d.length)

        // create scales
        xScale = d3.scaleLinear()
            .domain([1, 11]) // make dynamic
            .range([0, width])

        yScale = d3.scaleLinear()
            .domain([0, maxBinHeight])
            .range([height, 0])
    }
</script>

<svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#each bins as bin, index}
            <rect
                x={xScale(bin.x0)}
                y={yScale(bin.length)}
                width={xScale(bin.x1) - xScale(bin.x0)}
                height={height - yScale(bin.length)}
                fill={colors[6]}
            />
            <!-- <text 
                x={xScale((bin.x0 + bin.x1) / 2)}
                y={yScale(bin.length) - 5}
                fill="blue"
                text-anchor="middle"
                font-size="0.8rem"
            >
                {index + 1}
            </text> -->
        {/each}

        {#if xPos !== undefined && xPos !== null}
            <line
                x1={xPos}
                x2={xPos}
                y1={-10}
                y2={height + 14}
                stroke={colors[0]}
                stroke-width={4}
            />

            <!-- <text 
                x={xPos} 
                y={height + 20} 
                fill="blue" 
                font-size="0.8rem" 
                text-anchor="middle"
            >
                {Math.round(currentMetric1Value)}
            </text> -->
        {/if}
    </g>
</svg>

<style>

</style>



<!-- Visual bounds of histogram

{#if bins && bins.length > 0}
            <line
                x1={xScale(bins[0].x0)}
                x2={xScale(bins[0].x0)}
                y1={0}
                y2={height}
                stroke="red"
                stroke-width={2}
                opacity=0.5
            />

            <line
                x1={xScale(bins[bins.length - 1].x1)}
                x2={xScale(bins[bins.length - 1].x1)}
                y1={0}
                y2={height}
                stroke="red"
                stroke-width={2}
                opacity=0.5
            />
        {/if}
        {#if xPos !== undefined && xPos !== null}
            <line
                x1={metricScale(d3.min(data1))}
                x2={metricScale(d3.min(data1))}
                y1={0}
                y2={height}
                stroke="blue"
                stroke-width={2}
                opacity=0.5
            />
            <text 
                x={metricScale(d3.min(data1))} 
                y={height + 10} 
                fill="blue" 
                font-size="0.8rem" 
                text-anchor="middle"
            >
                {Math.round(d3.min(data1))}
            </text>

            <line
                x1={metricScale(d3.max(data1))}
                x2={metricScale(d3.max(data1))}
                y1={0}
                y2={height}
                stroke="blue"
                stroke-width={2}
                opacity=0.5
            />
            <text 
                x={metricScale(d3.max(data1))} 
                y={height + 10} 
                fill="blue" 
                font-size="0.8rem" 
                text-anchor="middle"
            >
                {Math.round(d3.max(data1))}
            </text>
        {/if}
        
-->