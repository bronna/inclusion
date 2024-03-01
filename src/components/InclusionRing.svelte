<script>
    import { scaleLinear } from 'd3-scale'
    import { colors } from '../styles/colors'
    import { minWeightedInclusion, maxWeightedInclusion } from '../stores/stores.js'
  
    export let value = 0
    export let weighted_inclusion = 0

    $: letterSpacing = (value >= 10) ? "-0.05em" : "normal"

    let dataset  = [{ label: 'filled', value: value }, { label: 'empty', value: 10 - value }]
    $: dataset = [{ label: 'filled', value: value }, { label: 'empty', value: 10 - value }]
  
    let width = 42
    let height = 42

    const colorScale = scaleLinear()
      .domain([$minWeightedInclusion, $maxWeightedInclusion])
      .range(['#fff', colors[0]])

    let computedColor = colorScale(weighted_inclusion)
    $: computedColor = colorScale(weighted_inclusion)
</script>

<div class="donut-chart">
    <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          <circle cx="0" cy="0" r="20" fill={value ? computedColor : "white"} stroke={colors[5]} stroke-width="2" />
            <!-- SVG text element for displaying the value -->
            <text x={0} y={2} text-anchor="middle" dominant-baseline="middle"
                fill="white" stroke="black" stroke-width="2"
                font-size="1.9rem" font-weight="900"
                letter-spacing={letterSpacing}
            >
                {value ? value : "—"}
            </text>
            <text x={0} y={2} text-anchor="middle" dominant-baseline="middle"
                fill="white" stroke="none"
                font-size="1.7rem" font-weight="600"
            >
                {value ? value : "—"}
            </text>
        </g>
    </svg>
</div>
  
<style>
    .donut-chart {
        position: relative;
        width: 42px;
        height: 42px;
    }
</style>
