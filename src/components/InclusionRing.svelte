<script>
    import { arc, pie } from 'd3-shape';
    import { interpolateHsl } from 'd3-interpolate'
    import { scaleSequential } from 'd3-scale';
    import { scaleLinear } from 'd3-scale';
    import { colors } from '../styles/colors';
    import { minWeightedInclusion, maxWeightedInclusion } from '../stores/stores.js';
  
    export let value = 0;
    export let weighted_inclusion = 0;

    let dataset = [{ label: 'filled', value: value }, { label: 'empty', value: 10 - value }];
  
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
          <circle cx="0" cy="0" r="20" fill={value ? computedColor : "white"} stroke={colors[0]} />
        </g>
    </svg>
    {#if value}
        <!-- <svg width="200" height="100">
            <text x="10" y="50" fill="white" stroke="black" stroke-width="1">My Text</text>
        </svg>-->
        <p class="metric-value">{value}</p>
    {:else}
        <p class="metric-value">—</p>
    {/if}
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
        text-shadow:
            -1px -1px 0 var(--inclusive-color),
            1px -1px 0 var(--inclusive-color),
            -1px 1px 0 var(--inclusive-color),
            1px 1px 0 var(--inclusive-color); /* Simulates a stroke */
        font-size: 1.6rem;
        letter-spacing: 0.02rem;
        font-weight: 700;
    }
</style>

  