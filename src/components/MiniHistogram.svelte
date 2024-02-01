<script>
    import * as d3 from 'd3'
    import { districtsData, largeDistrictsData } from '../stores/stores'
    import { colors } from '../styles/colors'

    export let metric1 // for line overlay
    export let currentMetric1Value // for line overlay
    export let metric2 // for hist bins, if applicable
    export let currentMetric2Value // decile
    export let districtName

    let data
    let metric1Domain
    let weightedData
    let bins
    let xScale, yScale
    let xPos
    const margin = { top: 30, right: 0, bottom: 30, left: 0 }
    const width = 300 - margin.left - margin.right
    const height = 150 - margin.top - margin.bottom

    let metricScale = d3.scaleLinear().range([0, width])

    // extract the data values from districtsData for the specified metrics
    $: data = $largeDistrictsData // make dynamic?
        .filter(district => district.properties[metric1] > 0)
        .map(district => district.properties[metric1])

    $: weightedData = $districtsData
        .filter(district => district.properties[metric2] > 0)
        .map(district => ({
            value: district.properties[metric2],
            weight: district.properties["Total Student Count"]
        }))
    $: if (weightedData && weightedData.length > 0) {
        createHistogram()
    }

    $: if (data && data.length > 0) {
        metric1Domain = d3.extent(data);
        metricScale.domain(metric1Domain)
    }

    $: if (metric1Domain && currentMetric1Value !== undefined) {
        if (currentMetric1Value < metric1Domain[0]) {
            xPos = metricScale(metric1Domain[0])
        } else if (currentMetric1Value > metric1Domain[1]) {
            xPos = metricScale(metric1Domain[1])
        } else {
            xPos = metricScale(currentMetric1Value)
        }
    }

    function createHistogram() {
        const thresholds = Array.from({ length: 10 }, (_, i) => i + 1) // make dynamic

        // create the histogram layout
        const histogram = d3.histogram()
            .value(d => d.value)
            .domain([1, 11]) // make dynamic
            .thresholds(thresholds)

        bins = histogram(weightedData)

        for (const bin of bins) {
            bin.weightedLength = d3.sum(bin, d => d.weight)
        }

        const maxBinWeight = d3.max(bins, d => d.weightedLength)

        xScale = d3.scaleLinear()
            .domain([1, 11])
            .range([0, width])

        yScale = d3.scaleLinear()
            .domain([0, maxBinWeight])
            .range([height, 0])
    }
</script>

<svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} overflow="visible">
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#each bins as bin, index}
            <rect
                x={xScale(bin.x0)}
                y={yScale(bin.weightedLength)}
                width={xScale(bin.x1) - xScale(bin.x0)}
                height={height - yScale(bin.weightedLength)}
                fill={colors[6]}
            />
            {#if (index + 1) === 1 || (index + 1) === 10}
                <text 
                    x={xScale((bin.x0 + bin.x1) / 2)}
                    y={height + 15}
                    fill={colors[5]}
                    text-anchor="middle"
                    font-size="0.8rem"
                >
                    {index + 1}
                </text>
            {/if}
        {/each}

        {#if currentMetric1Value && xPos !== undefined && xPos !== null}
            <text 
                x={xPos} 
                y=-20
                fill={colors[5]}
                font-size="0.8rem" 
                text-anchor="middle"
            >
                {districtName}
            </text>

            <line
                x1={xPos}
                x2={xPos}
                y1={-10}
                y2={height + 14}
                stroke={colors[0]}
                stroke-width={4}
            />

            <text 
                x={xPos} 
                y={height + 28} 
                fill={colors[5]}
                font-size="0.8rem" 
                text-anchor="middle"
            >
                {currentMetric2Value}
            </text>
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
                x1={metricScale(d3.min(data))}
                x2={metricScale(d3.min(data))}
                y1={0}
                y2={height}
                stroke="blue"
                stroke-width={2}
                opacity=0.5
            />
            <text 
                x={metricScale(d3.min(data))} 
                y={height + 10} 
                fill="blue" 
                font-size="0.8rem" 
                text-anchor="middle"
            >
                {Math.round(d3.min(data))}
            </text>

            <line
                x1={metricScale(d3.max(data))}
                x2={metricScale(d3.max(data))}
                y1={0}
                y2={height}
                stroke="blue"
                stroke-width={2}
                opacity=0.5
            />
            <text 
                x={metricScale(d3.max(data))} 
                y={height + 10} 
                fill="blue" 
                font-size="0.8rem" 
                text-anchor="middle"
            >
                {Math.round(d3.max(data))}
            </text>
        {/if}
        
-->