<script>
    import { scaleLinear, scaleOrdinal } from 'd3';
    import { colors } from '../styles/colors';

    export let stateData

    let data
    let xScale
    let colorScale
    let stackStart
    let height

    $: {
        data = [
            {group: "eighty", value: stateData.eighty * 100},
            {group: "between", value: stateData.between * 100},
            {group: "forty", value: stateData.forty * 100},
            {group: "separate", value: stateData.separate * 100},
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
    }

    // This variable will hold the currently opened tooltip
    let currentOpenTooltip = null;

    function tooltip(node, content) {

        function showTooltip(event) {
            let tooltip = node.nextElementSibling;
            tooltip.innerHTML = content;

            // Close the currently open tooltip if it exists
            if (currentOpenTooltip && currentOpenTooltip !== tooltip) {
                currentOpenTooltip.style.display = 'none';
            }

            // Update the currently open tooltip
            currentOpenTooltip = tooltip.style.display === 'block' ? null : tooltip;

            if (tooltip.style.display === 'block') {
                tooltip.style.display = 'none';
                document.removeEventListener('click', outsideClickListener);
            } else {
                tooltip.style.display = 'block';
                setTimeout(() => {
                    document.addEventListener('click', outsideClickListener);
                }, 0);
            }

            // Prevent this click from being propagated to document
            event.stopPropagation();
        }

        function outsideClickListener() {
            let tooltip = node.nextElementSibling;
            tooltip.style.display = 'none';

            // If this tooltip was the current one open, set currentOpenTooltip to null
            if (currentOpenTooltip === tooltip) {
                currentOpenTooltip = null;
            }

            document.removeEventListener('click', outsideClickListener);
        }

        node.addEventListener('click', showTooltip);

        return {
            destroy() {
                node.removeEventListener('click', showTooltip);
                document.removeEventListener('click', outsideClickListener);
            }
        };
    }

</script>

<div class="state-data">
    <div class="legend">
        <div class="legend-setting">
            <strong class="setting-amount" style="background-color:{colors[4]}; color:{colors[0]};">{(stateData.eighty * 100).toFixed(0)}%</strong> 
            of students with IEPs are in an 
            <span class="setting-name" style="background-color:{colors[4]}; color:{colors[0]};">inclusive</span>
            <div class="tooltip-container">
                <span class="question-bubble" use:tooltip={'More than 80% of the day spent in a regular classroom'}></span>
                <div class="tooltip">More than 80% of the day spent in a regular classroom</div>
            </div>
            setting
        </div>
        <div class="legend-setting">
            <strong class="setting-amount" style="background-color:{colors[5]}; color:{colors[1]};">{(stateData.between * 100).toFixed(0)}%</strong> 
            are in a 
            <span class="setting-name" style="background-color:{colors[5]}; color:{colors[1]};">semi-inclusive</span>
            <div class="tooltip-container">
                <span class="question-bubble" use:tooltip={'40% to 80% of the day spent in a regular classroom'}></span>
                <div class="tooltip">40% to 80% of the day spent in a regular classroom</div>
            </div>
            setting
        </div>
        <div class="legend-setting">
            <strong class="setting-amount" style="background-color:{colors[6]}; color:{colors[2]};">{(stateData.forty * 100).toFixed(0)}%</strong> 
            are in a 
            <span class="setting-name" style="background-color:{colors[6]}; color:{colors[2]};">non-inclusive</span> 
            <div class="tooltip-container">
                <span class="question-bubble" use:tooltip={'Less than 40% of the day spent in a regular classroom'}></span>
                <div class="tooltip">Less than 40% of the day spent in a regular classroom</div>
            </div>
            setting
        </div>
        <div class="legend-setting">
            <strong class="setting-amount" style="background-color:{colors[7]}; color:{colors[3]};">{(stateData.separate * 100).toFixed(0)}%</strong> 
            are in a 
            <span class="setting-name" style="background-color:{colors[7]}; color:{colors[3]};">separate</span> 
            <div class="tooltip-container">
                <span class="question-bubble" use:tooltip={'In a hospital, incarcerated, etc.'}></span>
                <div class="tooltip">In a hospital, incarcerated, etc.</div>
            </div>
            setting
        </div> 
    </div>
    
    {#if stateData.students !== 0}
        <div class="bar-chart">
            {#each data as d, i (d.group)}
                <div class="bar" style="background-color: {colorScale(d.group)}; width: {d.value}%">
                    {#if d.value >= 1}
                        <span class="bar-text">{(d.value).toFixed(0)}{i === 0 ? '%' : ''}</span>
                    {/if}
                </div>
            {/each}
        </div>        
    {/if}
</div>

<style>
    .state-data {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        margin-top: 1.3rem;
    }

    .bar-chart {
        display: flex;
        margin-top: 0.3rem;
        width: 100%;
        height: 20px;
    }

    .setting-amount {
        font-weight: 800;
        font-size: 1rem;
        padding: 0 8px;
        letter-spacing: 0.03rem;
        border-radius: 3px;
    }

    .setting-name {
        font-weight: 600;
        font-size: 1rem;
        text-transform: uppercase;
        padding: 0 8px;
        letter-spacing: 0.03rem;
        border-radius: 3px;
    }

    .legend {
        margin-top: 0.5rem;
    }

    .legend div {
        margin: 0.6rem 0;
    }

    .bar {
        display: inline-block;
        /* display: flex;
        align-items: center;
        justify-content: center; */
        height: 100%;
        position: relative;
        /* margin-right: 2px; */
    }

    .bar:last-child {
        margin-right: 0;
    }

    .bar-text {
        font-size: 0.8rem;
        font-weight: 600;
        color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .tooltip-container {
        display: inline-flex;
        position: relative;
        padding-right: 4px;
    }

    .question-bubble {
        display: inline-block;
        position: absolute;
        top: -12px;
        left: -4px;
        width: 16px;
        height: 16px;
        background-color: var(--medium-gray);
        border-radius: 50%;
        margin-left: -5px;
        cursor: pointer;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        font-weight: 600;
        color: white;
    }

    .question-bubble:before {
        content: '?';
    }

    .tooltip {
        display: none;
        background-color: white;
        padding: 8px;
        position: absolute;
        top: -6px;
        right: 10px;
        z-index: 1;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.15);
        border-radius: 3px;
        min-width: 200px;
    }
</style>