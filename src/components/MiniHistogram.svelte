<script>
    import * as d3 from 'd3'
    import { districtsData } from '../stores/stores'
    import { colors } from '../styles/colors'

    export let metricName
    export let metric
    export let metricLabel

    let data
    let bins
    let area
    let xScale, yScale
    const margin = { top: 10, right: 10, bottom: 30, left: 10 }
    const width = 300 - margin.left - margin.right
    const height = 120 - margin.top - margin.bottom

    // extract the data values from districtsData for the specified metric
    $: data = $districtsData
        .filter(district => district.properties[metricName] > 0)
        .map(district => district.properties[metricName])
    $: if (data && data.length > 0) {
        createHistogram()
    }

    $: xPos = metric ? xScale(metric) : null

    function createHistogram() {
        const numThresholds = 10

        // create the histogram layout
        const histogram = d3.histogram()
            .value(d => d)
            .domain(d3.extent(data))
            .thresholds(numThresholds)

        bins = histogram(data)

        const maxBinHeight = d3.max(bins, d => d.length)

        // create scales
        xScale = d3.scaleLinear()
            .domain(d3.extent(data))
            .range([0, width])

        yScale = d3.scaleLinear()
            .domain([0, maxBinHeight])
            .range([height, 0])

        area = d3.area()
            .x(d => xScale((d.x0 + d.x1) / 2))
            .y0(height)
            .y1(d => yScale(d.length))
            .curve(d3.curveMonotoneX)
    }
</script>

<svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
        {#if area}
            <path d={area(bins)} fill={colors[6]} />
        {/if}

        {#if xPos}
            <line
                x1={xPos}
                x2={xPos}
                y1={-10}
                y2={height + 11}
                stroke={colors[0]}
                stroke-width={2.5}
            />

            <text
                x={xPos}
                y={height + 30}
                text-anchor="middle"
                fill={colors[0]}
                font-size="1.2rem"
                font-weight="600"
            >
                {metricLabel}
            </text>
        {/if}
    </g>
</svg>

<style>

</style>