<script>
    import { arc, pie } from 'd3-shape';
    import { interpolateHsl } from 'd3-interpolate'
    import { scaleSequential } from 'd3-scale';
    import { scaleLinear } from 'd3-scale';
    import { colors } from '../styles/colors';
    import { minWeightedInclusion, maxWeightedInclusion } from '../stores/stores.js';
  
    export let value = 0;
    export let weighted_inclusion = 0;

    let dataset  = [{ label: 'filled', value: value }, { label: 'empty', value: 10 - value }]
    $: dataset = [{ label: 'filled', value: value }, { label: 'empty', value: 10 - value }]
  
    let width = 42;
    let height = 42;
    let radius = Math.min(width, height) / 2;
    let donutWidth = 5;

    const colorScale = scaleLinear()
      .domain([$minWeightedInclusion, $maxWeightedInclusion])
      .range(['#fff', colors[0]]);
  
    let arcGenerator = arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
  
    let pieData = pie()
        .sort(null)
        .value(d => d.value)(dataset);
  
    $: pathData = pieData.map(d => arcGenerator(d));

    function fourPointInterpolator(t) {
        const interpolators = [
            interpolateHsl(colors[0], colors[1]),
            interpolateHsl(colors[1], colors[2]),
            interpolateHsl(colors[2], colors[3]),
        ]

        if (t < 0.33) return interpolators[0](t * 3)
        else if (t < 0.66) return interpolators[1]((t - 0.33) * 3)
        else return interpolators[2]((t - 0.66) * 3)
    }

    // const colorScale = scaleSequential(fourPointInterpolator)
    //     .domain([10, 0])

    let computedColor = colorScale(weighted_inclusion)
    $: computedColor = colorScale(weighted_inclusion)
</script>

<div class="donut-chart">
    <!-- <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        {#each pathData as d, i}
          <path d={d} fill={i === 0 ? computedColor : colors[7]} />
        {/each}
      </g>
    </svg> -->
    <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          <!-- {#each pathData as d, i}
            <path d={d} fill={i === 0 ? computedColor : colors[7]} />
          {/each} -->
          <circle cx="0" cy="0" r="20" fill={value ? computedColor : "white"} stroke={colors[5]} stroke-width="2" />
            <!-- SVG text element for displaying the value -->
            <text x={0} y={2} text-anchor="middle" dominant-baseline="middle"
                fill="white" stroke="black" stroke-width="2"
                font-size="1.9rem" font-weight="900"
            >
                {value ? value : "—"}
            </text>
            <text x={0} y={2} text-anchor="middle" dominant-baseline="middle"
                fill="white" stroke="none"
                font-size="1.7rem" font-weight="400"
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
    
    .metric-value {
        position: absolute;
        top: 52%;
        left: 51%;
        transform: translate(-50%, -120%);
        color: white;
        text-shadow: /* Simulates a stroke - H offset, V offset, blur R, color */
            -2px -2px 0 var(--color-text), /* Bottom right shadow */
            2px 2px 0 var(--color-text), /* Top left shadow */
            -2px 2px 0 var(--color-text), /* Top right shadow */
            2px -2px 0 var(--color-text); /* Bottom left shadow */
        font-size: 1.6rem;
        letter-spacing: 0.02rem;
        font-weight: 600;
    }
</style>
