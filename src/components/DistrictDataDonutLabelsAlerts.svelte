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
        pieFunc = pie().value(d => d.value).padAngle(padAngle);
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
        padding-bottom: 2rem;
    }

    .setting-text {
        text-anchor: middle;
        font-size: 0.95rem;
        font-weight: 400;
        letter-spacing: 0.02rem;
        color: var(--dark-gray);
        fill: var(--dark-gray);
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
        padding-top: 0.5rem;
    }
</style>