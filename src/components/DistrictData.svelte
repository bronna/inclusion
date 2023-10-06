<script>
    import { scaleLinear, scaleOrdinal, pie, arc, interpolateString } from 'd3';
    import { slide } from 'svelte/transition';
    import { tick } from 'svelte';
    import { colors } from '../styles/colors';
    import BarChart from './BarChart.svelte';
    import InclusionRing from './InclusionRing.svelte';

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
    // //let districtNameParts = districtData.properties["Institution Name"].split('SD');
    // let districtNameParts = districtData.properties["Institution Name"]
    // // Remove leading/trailing spaces and 'SD' from the district name
    // districtNameParts = districtNameParts.map(namePart => namePart.trim());

    $: {
        data = [
            {group: "inclusive", value: districtData.properties["LRE Students >80%"]},
            {group: "semi-inclusive", value: districtData.properties["LRE Students >40% <80%"]},
            {group: "non-inclusive", value: districtData.properties["LRE Students <40%"]},
            {group: "separate", value: districtData.properties["LRE Students Separate Settings"]},
        ]

        xScale = scaleLinear()
            .domain([0, 100])
            .range([0, 100])

        colorScale = scaleOrdinal()
            .domain(data.map(d => d.group))
            .range(colors)

        // Prepare stacked bar chart
        const barSpacing = 0.7

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
        arcGenerator = arc().innerRadius(50).outerRadius(75);

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

    const donutLabels = [
        {
            line1: 'are in', 
            colorKey1: null,
            x1: 122, 
            y1: 34,
            line2: 'an inclusive', 
            colorKey2: "inclusive",
            x2: 116, 
            y2: 54,
            line3: 'setting',
            colorKey3: null,
            x3: 88,
            y3: 74
        },
        {
            line1: 'are in a', 
            colorKey1: null,
            x1: -126, 
            y1: 34, 
            line2: 'semi-inclusive', 
            colorKey2: "semi-inclusive",
            x2: -122, 
            y2: 54,
            line3: 'setting',
            colorKey3: null,
            x3: -86,
            y3: 74
        },
        {
            line1: 'are in a', 
            colorKey1: null,
            x1: -86, 
            y1: -78,
            line2: 'non-inclusive',  
            colorKey2: "non-inclusive",
            x2: -116, 
            y2: -58,
            line3: 'setting',
            colorKey3: null,
            x3: -108,
            y3: -38
        },
        {
            line1: 'of students with IEPs', 
            colorKey1: null,
            x1: 75, 
            y1: -92, 
            line2: 'are in a separate', 
            colorKey2: "separate",
            x2: 106, 
            y2: -72,
            line3: 'setting',
            colorKey3: null,
            x3: 98,
            y3: -52
        },
    ]

    // Helper function to split string while keeping multi-word terms
    function splitString(str) {
        const multiWordTerms = ["semi-inclusive", "non-inclusive"];
        let words = [];
        multiWordTerms.forEach(term => {
            if (str.includes(term)) {
                words.push(term);
                str = str.replace(term, '').trim();
            }
        });
        return words.concat(str.split(' '));
    }
</script>

<!-- <div class="district-data" class:expanded={expanded}> -->
<div class="district-data" class:expanded={expanded}>
    <div class="district-info">
        <div class="header-wrapper">
            <h3 class="district-name">
                <!-- {#if districtNameParts[0]}
                    {districtNameParts[0]}
                {/if}
                {#if districtNameParts[1]}
                    <span style="font-weight:400; margin-left:2px;">{districtNameParts[1]}</span>
                {/if} -->
                {districtData.properties["Institution Name"]}
            
                {#if districtData.properties.nAlerts}
                    {#each Array(districtData.properties.nAlerts).fill() as _}
                        <span class="alert-icon">!</span>
                    {/each}
                {/if}
            </h3>

            {#if districtData.properties["Total Student Count"]}
                <button on:click={toggleExpanded} class="expand-button">
                    {#if expanded}
                        <!-- Chevron-up SVG -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={colors[4]} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="expand-icon">
                            <polyline points="6 15 12 9 18 15"></polyline>
                        </svg>
                    {:else}
                        <!-- Chevron-down SVG -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={colors[4]} stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="expand-icon">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    {/if}
                </button>
            {/if}
            
            <!-- <p class="score-label">inclusion score</p> -->
            <p class="metric-value">
                {#if districtData.properties["Total Student Count"]}
                    <InclusionRing value={districtData.properties.decile} />
                {/if}
            </p>
        </div>
    
        {#if districtData.properties["Total Student Count"] === 0 && !expanded}
            <p class="zeroDistrict" transition:slide={{duration: 200}}>no students with IEPs</p>
        {:else if districtData.properties["Total Student Count"] < 500 && !expanded}
            <p class="smallDistrict" transition:slide={{duration: 200}}>less than 500 students with IEPs</p>
        {/if}

        {#each expanded ? [districtData] : [] as data (data.properties["Institution Name"])}
            <div class="expanded-content" transition:slide={{duration: 200}}>
                <svg width="100%" height="200" viewBox="0 0 343 200" class="donut-chart">
                    <g transform="translate(171.5, 120)">
                        {#each pieData as d (d.data.group)}
                            <path
                                d={arcGenerator(d)}
                                fill={colorScale(d.data.group)}
                            />
                        {/each}

                        <!-- text labels for segments -->
                        {#each pieData as d (d.data.group)}
                            <text
                                x={donutLabels[d.index].x1}
                                y={donutLabels[d.index].y1}
                                class="setting-text"
                            >
                                <tspan font-size="1.1rem" fill={colorScale(d.data.group)} font-weight="700">
                                    {Math.round(d.value)}%
                                </tspan> 
                                <tspan dx="1"> <!-- shifts the second tspan a bit to the right -->
                                    {donutLabels[d.index].line1}
                                </tspan>
                            </text>
                        {/each}
                        {#each pieData as d (d.data.group)}
                            <text x={donutLabels[d.index].x2} y={donutLabels[d.index].y2} class="setting-text">
                                {#each splitString(donutLabels[d.index].line2) as word}
                                    <tspan
                                        fill={word === donutLabels[d.index].colorKey2 ? colorScale(word) : 'currentcolor'}
                                        font-weight={word === donutLabels[d.index].colorKey2 ? '700' : 'normal'}
                                    >
                                        {word}
                                    </tspan>
                                    <tspan dx="0.2em"></tspan> <!-- space between words -->
                                {/each}
                            </text>
                        {/each}
                        {#each pieData as d (d.data.group)}
                            <text
                                x={donutLabels[d.index].x3}
                                y={donutLabels[d.index].y3}
                                class="setting-text"
                            >
                                {donutLabels[d.index].line3}
                            </text>
                        {/each}
                        
                        <!-- number of students in center of donut chart -->
                        <text x="0" y="-14" text-anchor="middle" dominant-baseline="middle" font-size="1.6rem" font-weight="bold" fill="black">
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
                
                <!-- section for alerts, if there are any -->
                {#if districtData.properties.nAlerts}
                    <div class="alerts">
                        <svg width="100%" height="12" viewBox="0 0 343 12">
                            <g transform="translate(171.5, 0)">
                                <path 
                                    fill=none 
                                    stroke={colors[3]} 
                                    stroke-width="2" 
                                    d="M-90 10 L-4 10 L0 2 L4 10 L90 10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                </path>
                            </g>
                        </svg>
                        {#if districtData.properties["SuspExplFg"] === "Yes"}
                            <div class="alert-label">
                                <span class="alert-icon-sm">!</span>
                                <span class="alert-text">disproportionate discipline of students with IEPs</span>
                            </div>
                        {/if}
                        {#if districtData.properties["SuspExplRaceEthnicityFg"] === "Yes"}
                            <div class="alert-label">
                                <span class="alert-icon-sm">!</span>
                                <span class="alert-text">disproportionate discipline of students in specific racial groups with IEPs</span>
                            </div>
                        {/if}
                        {#if districtData.properties["DisPrptnRprsntnFg"] === "Yes"}
                            <div class="alert-label">
                                <span class="alert-icon-sm">!</span>
                                <span class="alert-text">disproportionate identification of students in specific racial groups as having disabilities</span>
                            </div>
                        {/if}
                        {#if districtData.properties["DisPrptnRprsntnDsbltyFg"] === "Yes"}
                            <div class="alert-label">
                                <span class="alert-icon-sm">!</span>
                                <span class="alert-text">disproportionate identification of students in specific racial groups as having specific disabilities</span>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    {#if !expanded}
        {#if districtData.properties["Total Student Count"] !== 0}
            <div class="bar-border-top bar-border-bottom">
                <BarChart data={data} />
            </div>
        {:else}
            <div></div>
        {/if}
    {/if}

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

    .header-wrapper {
        display: flex;
        /* justify-content: space-between; */
        align-items: center; /* align items vertically */
    }

    .expanded {
        background: white;
        padding-bottom: 2rem;
    }

    .district-name {
        font-size: 1.1rem;
        letter-spacing: 0.03rem;
        text-transform: uppercase;
        /* font-family: 'Source Serif 4', serif; */
    }

    .setting-text {
        text-anchor: middle;
        font-size: 0.95rem;
        font-weight: 400;
        letter-spacing: 0.02rem;
        color: var(--dark-gray);
        fill: var(--dark-gray);
    }

    .alerts {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
    }

    .alert-icon {
        background-color: var(--separate-color);
        color: white;
        margin-left: 0.5rem;
        padding: 1px;
        border-radius: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 15px;
        height: 15px;
        font-size: 0.7rem;
        font-weight: 700;
        transform: translateY(-2px);
    }

    .alert-label {
        display: flex;
        align-items: top;
        margin-top: 0.45rem;
        width: 200px;
        line-height: 1.18rem;
    }

    .alert-icon-sm {
        background-color: var(--separate-color);
        color: white;
        padding: 1px;
        border-radius: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 12px;
        height: 12px;
        font-size: 0.6rem;
        font-weight: 700;
        transform: translateY(2px);
    }

    .alert-text {
        font-size: 0.92rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        color: var(--dark-gray);
        margin: 0 0 0 0.5rem;
        padding: 0;
    }

    .expand-icon {
        height: 1em;
        width: 1em;
        cursor: pointer;
        transform: translateY(2px);
    }

    .score-label {
        margin-left: auto;
        color: var(--dark-gray);
        font-size: 0.9rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        text-align: right;
        margin-bottom: 5px;
    }

    .metric-value {
        margin-left: auto;
        background-color: white;
        color: var(--color-text);
        font-size: 1.9rem;
        letter-spacing: 0.02rem;
        font-weight: 400;
        margin-bottom: 0px;
        margin-top: 0px;
    }

    .bar-border-top {
        border-top: 9px solid white;
    }

    .bar-border-bottom {
        border-bottom: 9px solid white;
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

    .expand-button {
        background: white;
        border: none;
        cursor: pointer;
        margin-left: 0.5rem;
    }

    .expanded-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #fff;
        padding-top: 0.5rem;
    }
</style>