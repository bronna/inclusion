<script>
    import { scaleOrdinal, pie, arc } from "d3"
    import { colors } from "../styles/colors";

    export let data
    export let chartColors
    export let innerRadius = 55
    export let outerRadius = 80
    export let width = 343
    export let height = 160
    export let centerText = ''
    export let centerText2 = ''
    export let centerText3 = ''
    export let barSpacing = 0.7

    const padAngle = barSpacing * 0.0174533  // Convert from degrees to radians

    let colorScale, pieFunc, pieData, arcGenerator

    $: if (data && data.length > 0) {
        colorScale = scaleOrdinal()
            .domain(data.map(d => d.group))
            .range(chartColors)

        pieFunc = pie()
            .value(d => d.value)
            .sort(null)
            .padAngle(padAngle)

        pieData = pieFunc(data)
        
        arcGenerator = arc().innerRadius(innerRadius).outerRadius(outerRadius)
    }
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`} class="donut-chart">
    <g transform={`translate(${width / 2}, ${height / 2})`}>
        {#each pieData as d (d.data.group)}
            <path d={arcGenerator(d)} fill={colorScale(d.data.group)} />
        {/each}

        <text x="0" y={centerText2 ? "-14" : "0"} dominant-baseline="middle" text-anchor="middle" fill={colors[5]} font-size="1.9rem" font-weight="bold">
            {centerText}
        </text>
        <text x="0" y="12" dominant-baseline="middle" text-anchor="middle" fill={colors[5]} font-size="1rem">
            {centerText2}
        </text>
        <text x="0" y="30" dominant-baseline="middle" text-anchor="middle" fill={colors[5]} font-size="1rem">
            {centerText3}
        </text>
    </g>
</svg>

<style>
    .donut-chart {
        margin-top: 1.6rem;
        padding-bottom: 1rem;
    }
</style>