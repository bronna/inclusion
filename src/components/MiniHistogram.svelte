<script>
    import * as d3 from 'd3'
    import { districtsData, largeDistrictsData } from '../stores/stores'
    import { colors } from '../styles/colors'

    export let metric1 // "weighted_inclusion", for line overlay
    export let currentMetric1Value // the district's weighted_inclusion, for line overlay
    export let metric2 // "decile", for hist bins
    export let currentMetric2Value // the district's "decile", or inclusion score, for hist bins
    export let districtName
    export let districtSize

    let data
    let metric1Domain
    let weightedData
    let bins
    let yAxisTicks
    let xScale, yScale
    let xPos
    const margin = { top: 60, right: 0, bottom: 30, left: 0 }
    const width = 300 - margin.left - margin.right
    const height = 190 - margin.top - margin.bottom

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

        yAxisTicks = [10000, 20000]
    }
</script>

<svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} overflow="visible">
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        <!-- Histogram rectangles -->
        {#each bins as bin, index}
            <rect
                x={xScale(bin.x0)}
                y={yScale(bin.weightedLength)}
                width={xScale(bin.x1) - xScale(bin.x0) - 1}
                height={height - yScale(bin.weightedLength)}
                fill={colors[6]}
            />
            {#if districtSize && bin[0].value === currentMetric2Value}
                <rect
                    x={xScale(bin.x0)}
                    y={yScale(bin.weightedLength)}
                    width={xScale(bin.x1) - xScale(bin.x0) - 1}
                    height={districtSize < 300 ? (height - yScale(300)) : (height - yScale(districtSize))}
                    fill={colors[0]}
                />
            {/if}
            {#if (index + 1) === 2 || (index + 1) === 4 || (index + 1) === 6 || (index + 1) === 8 || (index + 1) === 10}
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

        <!-- Axes labels -->
        <g class="axes-labels">
            <text 
                x={0}
                y={height + 15}
                fill={colors[5]}
                text-anchor="middle"
                font-size="0.8rem"
                font-weight="600"
            >
                score
            </text>

            <text 
                x={width + 5}
                y={-20}
                fill={colors[5]}
                text-anchor="start"
                font-size="0.8rem"
                font-weight="600"
            >
                # students
            </text>
        </g>

        <!-- Y-axis ticks -->
        {#each yAxisTicks as tick}
            <text 
                x={width + 5} 
                y={yScale(tick)} 
                dy=".32em" 
                fill={colors[5]} 
                text-anchor="start" 
                font-size="0.8rem"
            >
                {d3.format(",.0f")(tick)}
            </text>
            <line 
                x1={width} x2={width + 5}
                y1={yScale(tick)} y2={yScale(tick)}
                stroke={colors[5]} 
                stroke-width="1" 
            />
        {/each}

        <!-- Legend -->
        <g class="legend" transform="translate(0, -65)">
            <rect width="15" height="15" fill={colors[6]}></rect>
            <text x="20" y="12.5" fill={colors[5]} font-size="0.9rem">All other school districts</text>

            <rect width="15" height="15" y="25" fill={colors[0]}></rect>
            <text x="20" y="37.5" fill={colors[5]} font-size="0.9rem">{districtName}</text>
        </g>

        {#if currentMetric1Value && xPos !== undefined && xPos !== null}
            <!-- <text 
                x={xPos} 
                y=-20
                fill={colors[5]}
                font-size="1rem"
                font-weight="600"
                text-anchor="middle"
            >
                {districtName}
            </text> -->

            <line
                x1={xPos}
                x2={xPos}
                y1={-10}
                y2={height + 14}
                stroke={colors[4]}
                stroke-width={2}
                stroke-dasharray="2, 2"
            />

            <text 
                x={xPos} 
                y={height + 28} 
                fill={colors[8]}
                font-size="1.2rem"
                font-weight="800"
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