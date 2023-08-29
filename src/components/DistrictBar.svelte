<script>
    import { scaleLinear, scaleOrdinal, pie, arc, interpolateString } from 'd3';
    import { slide } from 'svelte/transition';
    import { tick } from 'svelte';
    import { colors } from '../styles/colors';
    import BarChart from './BarChart.svelte';

    export let districtData

    let data
    let xScale
    let colorScale
    let stackStart
    let height
    let pieFunc
    let pieData
    let arcGenerator
    let startAngle

    const totalValue = 100;  // The sum of all values (in percent)

    // For each data object, calculate start angle, end angle, and create a donut slice path using the arc generator
    let anglePerUnit = (2 * Math.PI) / totalValue;  // totalValue is the sum of all values

    // // Split the district name around 'SD'
    // let districtNameParts = districtData.name.split('SD');
    // // Remove leading/trailing spaces and 'SD' from the district name
    // districtNameParts = districtNameParts.map(namePart => namePart.trim());

    $: {
        data = [
            {group: "eighty", value: districtData.eighty},
            {group: "between", value: districtData.between},
            {group: "forty", value: districtData.forty},
            {group: "separate", value: districtData.separate},
        ]

        xScale = scaleLinear()
            .domain([0, 100])
            .range([0, 100])

        colorScale = scaleOrdinal()
            .domain(data.map(d => d.group))
            .range(colors)

        // Prepare stacked bar chart
        const barSpacing = 0.3

        stackStart = 0
        height = 30

        data.forEach(d => {
            d.start = stackStart
            d.width = xScale(d.value) - barSpacing

            let x = xScale(d.start)
            let y = 0

            // create a path string for a rectangle
            d.barPath = `M ${x} ${y} L ${x + d.width} ${y} V ${y + height} H ${x} Z`

            stackStart += d.width + barSpacing
        })

        // Prepare pie function for donut chart generation
        const padAngle = barSpacing * 0.0174533;  // Convert from degrees to radians
        pieFunc = pie().value(d => d.value).padAngle(padAngle);
        pieData = pieFunc(data);
    
        // Prepare arc function for donut chart generation
        arcGenerator = arc().innerRadius(70).outerRadius(100);

        startAngle = 0;
        data.forEach(d => {
            d.startAngle = startAngle;
            d.endAngle = startAngle + d.value * anglePerUnit;

            // Use the arc generator to create the path data for a donut slice. The input for the arc generator is an object that must have two properties: startAngle and endAngle. The angles must be in radians.
            d.donutPath = arcGenerator({ startAngle: d.startAngle, endAngle: d.endAngle });

            startAngle = d.endAngle;
        });     
    }

    let expanded = false
    const toggleExpanded = () => {
        expanded = !expanded
    }

    function interpolatePaths(a, b) {
        const i = interpolateString(a, b)
        return function(t) {
            return i(t)
        }
    }

    function pathTransition(node, { from, to }) {
        return {
            async run(t) {
                await tick()
                node.setAttribute('d', interpolatePaths(from, to)(t))
            }
        }
    }

    $: data.forEach(d => {
        d.path = expanded ? d.donutPath : d.barPath
    })
</script>

<div class="district-data">
    <div class="district-info">
        <div class="header-wrapper">
            <h3 class="district-name">
                <!-- <strong>
                    {#if districtNameParts[0]}
                        {districtNameParts[0]}
                    {/if}
                </strong>
                {#if districtNameParts[1]}
                    {districtNameParts[1]}
                {/if} -->
                <strong>{districtData.name}</strong>
            
                {#if districtData.nAlerts}
                    {#each Array(districtData.nAlerts).fill() as _}
                        <span class="alert-icon">!</span>
                    {/each}
                {/if}
            </h3>

            <button on:click={toggleExpanded} class="expand-button">
                {#if expanded}
                    <!-- Chevron-up SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="expand-icon">
                        <polyline points="6 15 12 9 18 15"></polyline>
                    </svg>
                {:else}
                    <!-- Chevron-down SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="expand-icon">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                {/if}
            </button>
            
              
        </div>
    
        {#if districtData.students === 0 && !expanded}
            <p class="smallDistrict" transition:slide={{duration: 200}}>no students with IEPs</p>
        {:else if districtData.students < 500 && !expanded}
            <p class="smallDistrict" transition:slide={{duration: 200}}>less than 500 students with IEPs</p>
        {/if}

        {#each expanded ? [districtData] : [] as data (data.name)}
            {#if districtData.students === 0}
                <div class="expanded-content" transition:slide={{duration: 200}}>
                    <p>No students with IEPs</p>
                </div>
            {:else}
                <div class="expanded-content" transition:slide={{duration: 200}}>
                    <p>{data.students} students with IEPs</p>
                </div>
            {/if}
        {/each}
    </div>

    {#if expanded}
        {#if districtData.students !== 0}
            <svg width="200" height="200" class="donut-chart">
                <g transform="translate(100, 100)">
                    {#each pieData as d (d.data.group)}
                        <path
                            d={arcGenerator(d)}
                            fill={colorScale(d.data.group)}
                        />
                    {/each}
                </g>
            </svg>
        {/if}
    {:else}
        {#if districtData.students !== 0}
            <BarChart data={data} />   
        {/if}
    {/if}

    <!-- <svg width="200" height="200" class={expanded ? "donut-chart" : "bar-chart"}>
        <g transform="translate(100, 100)">
            {#each data as d (d.group)}
                <path 
                    d={d.path} 
                    fill={colorScale(d.group)} 
                    transition:pathTransition="{{ delay: 0, duration: 500, from: d.barPath, to: d.donutPath }}"
                />
            {/each}
        </g>
    </svg> -->

</div>

<style>
    .district-data {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        margin-top: 1.3rem;
    }

    .header-wrapper {
        display: flex;
        /* justify-content: space-between; */
        align-items: center; /* align items vertically */
    }

    .district-name {
        font-size: 1.05rem;
        letter-spacing: 0.03rem;
        text-transform: uppercase;
        /* font-family: 'Source Serif 4', serif; */
    }

    .alert-icon {
        background-color: var(--separate-color);
        color: white;
        margin-left: 0.5rem;
        padding: 1px;
        border-radius: 10%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 10px;
        height: 15px;
        font-size: 0.85rem;
        font-weight: 700;
    }

    .expand-icon {
        height: 1em;
        width: 1em;
        cursor: pointer;
        transform: translateY(2px);
    }

    .smallDistrict {
        font-size: 0.85rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        color: var(--dark-gray);
        margin: -2px 0 0 0;
        padding: 0;
    }

    .expand-button {
        background: white;
        border: none;
        cursor: pointer;
        margin-left: 0.5rem;
    }

    .expanded-content {
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 5px;
    }
</style>