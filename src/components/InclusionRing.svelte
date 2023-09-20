<script>
    import { arc, pie } from 'd3-shape';
    import { colors } from '../styles/colors';
  
    export let value = 0;

    let dataset = [{ label: 'filled', value: value }, { label: 'empty', value: 4 - value }];
  
    let width = 42;
    let height = 42;
    let radius = Math.min(width, height) / 2;
    let donutWidth = 3;
  
    let arcGenerator = arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
  
    let pieData = pie()
        .sort(null)
        .value(d => d.value)(dataset);
  
    $: pathData = pieData.map(d => arcGenerator(d));
</script>

<div class="donut-chart">
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2},${height / 2})`}>
        {#each pathData as d, i}
          <path d={d} fill={i === 0 ? colors[0] : '#fff'} />
        {/each}
      </g>
    </svg>
    <p class="metric-value">{value}</p>
</div>
  
<style>
    .donut-chart {
        position: relative;
        width: 42px;
        height: 42px;
    }
    
    .metric-value {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-53%, -128%);
        color: var(--color-text);
        font-size: 1.8rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
    }
</style>

  