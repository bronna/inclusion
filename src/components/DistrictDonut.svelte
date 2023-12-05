<script>
    import { scaleOrdinal, pie, arc } from 'd3';
    import { slide } from 'svelte/transition';
    import { colors } from '../styles/colors';

    export let districtData

    let data
    let colorScale
    let pieFunc
    let pieData
    let arcGenerator
    let startAngle

    const totalValue = 100;  // The sum of all values (in percent)

    // For each data object, calculate start angle, end angle, and create a donut slice path using the arc generator
    let anglePerUnit = (2 * Math.PI) / totalValue;  // totalValue is the sum of all values

    $: {
        data = [
            {group: "inclusive", value: districtData.properties["LRE Students >80%"]},
            {group: "semi-inclusive", value: districtData.properties["LRE Students >40% <80%"]},
            {group: "non-inclusive", value: districtData.properties["LRE Students <40%"]},
            {group: "separate", value: districtData.properties["LRE Students Separate Settings"]},
        ]

        colorScale = scaleOrdinal()
            .domain(data.map(d => d.group))
            .range(colors)

        const barSpacing = 0.7

        // Prepare pie function for donut chart generation
        const padAngle = barSpacing * 0.0174533;  // Convert from degrees to radians
        pieFunc = pie()
            .value(d => d.value)
            .sort(null)
            .padAngle(padAngle);
        pieData = pieFunc(data);
    
        // Prepare arc function for donut chart generation
        arcGenerator = arc().innerRadius(50).outerRadius(70);

        startAngle = 0;
        data.forEach(d => {
            d.startAngle = startAngle;
            d.endAngle = startAngle + d.value * anglePerUnit;

            // Use the arc generator to create the path data for a donut slice. The input for the arc generator is an object that must have two properties: startAngle and endAngle. The angles must be in radians.
            d.donutPath = arcGenerator({ startAngle: d.startAngle, endAngle: d.endAngle });

            startAngle = d.endAngle;
        });     
    }

    let expanded = true

    $: data.forEach(d => {
        d.path = expanded ? d.donutPath : d.barPath
    })
</script>

<!-- <div class="district-data" class:expanded={expanded}> -->
<div class="district-data" class:expanded={expanded}>
    <div class="district-info">
        {#if districtData.properties["Total Student Count"] === 0 && !expanded}
            <p class="zeroDistrict" transition:slide={{duration: 200}}>no students with IEPs</p>
        {:else if districtData.properties["Total Student Count"] < 500 && !expanded}
            <p class="smallDistrict" transition:slide={{duration: 200}}>less than 500 students with IEPs</p>
        {/if}

        {#each expanded ? [districtData] : [] as data (data.properties["Institution Name"])}
            <div class="expanded-content" transition:slide={{duration: 200}}>
                <svg width="100%" height="160" viewBox="0 0 343 140" class="donut-chart">
                    <g transform="translate(171.5, 70)">
                        {#each pieData as d (d.data.group)}
                            <path
                                d={arcGenerator(d)}
                                fill={colorScale(d.data.group)}
                            />
                        {/each}
                        
                        <!-- number of students in center of donut chart -->
                        <text x="0" y="-14" text-anchor="middle" dominant-baseline="middle" font-size="1.6rem" font-weight="bold" fill={colors[5]}>
                            {data.properties["Total Student Count"].toLocaleString('en-US')}
                        </text>
                        <text x="0" y="8" text-anchor="middle" dominant-baseline="middle" font-size="0.9rem" fill={colors[5]}>
                            students
                        </text>
                        <text x="0" y="23" text-anchor="middle" dominant-baseline="middle" font-size="0.9rem" fill={colors[5]}>
                            with IEPs
                        </text>
                    </g>
                </svg>
            </div>
        {/each}
    </div>

</div>

<style>
    .district-data {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        margin-top: 1.6rem;
        justify-content: center;
    }

    .expanded {
        background: var(--color-background);
        padding-bottom: 1rem;
    }

    .smallDistrict {
        font-size: 0.85rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        color: var(--dark-gray);
        margin: 0;
        padding: 0;
        margin-top: -8px;
    }

    .zeroDistrict {
        font-size: 0.85rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        color: var(--dark-gray);
        margin: 0;
        padding: 0;
    }

    .expanded-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: var(--color-background);
    }
</style>