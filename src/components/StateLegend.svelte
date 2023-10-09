<script>
    import { colors } from '../styles/colors';
    import BarChart from './BarChart.svelte';

    export let stateData

    let data

    $: {
        data = [
            {group: "inclusive", value: stateData.properties["LRE Students >80%"]},
            {group: "semiInclusive", value: stateData.properties["LRE Students >40% <80%"]},
            {group: "nonInclusive", value: stateData.properties["LRE Students <40%"]},
            {group: "separate", value: stateData.properties["LRE Students Separate Settings"]},
        ]
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

<div class="state-data text-width">
    {#if stateData.properties["Total Student Count"] !== 0}
        <BarChart {data} />      
    {/if}

    <div class="legend">
        <div class="legend-setting">
            <strong class="setting-amount" style="color:{colors[0]};">{(stateData.properties["LRE Students >80%"]).toFixed(0)}%</strong> 
            of students with IEPs
            are in an 
            <span class="setting-name" style="background-color:{colors[0]}; color:white;">inclusive</span>
            <div class="tooltip-container">
                <span class="question-bubble" use:tooltip={'spend more than 80% of their day in a regular classroom'}></span>
                <div class="tooltip">spend more than 80% of their day in a regular classroom</div>
            </div>
            setting
        </div>
        <div class="legend-setting">
            <strong class="setting-amount" style="color:{colors[1]};">{(stateData.properties["LRE Students >40% <80%"]).toFixed(0)}%</strong> 
            are in a 
            <span class="setting-name" style="background-color:{colors[1]}; color:white;">semi-inclusive</span>
            <div class="tooltip-container">
                <span class="question-bubble" use:tooltip={'spend 40% to 80% of their day in a regular classroom'}></span>
                <div class="tooltip">spend 40% to 80% of their day in a regular classroom</div>
            </div>
            setting
        </div>
        <div class="legend-setting">
            <strong class="setting-amount" style="color:{colors[2]};">{(stateData.properties["LRE Students <40%"]).toFixed(0)}%</strong> 
            are in a 
            <span class="setting-name" style="background-color:{colors[2]}; color:white;">non-inclusive</span> 
            <div class="tooltip-container">
                <span class="question-bubble" use:tooltip={'spend less than 40% of their day in a regular classroom'}></span>
                <div class="tooltip">spend less than 40% of their day in a regular classroom</div>
            </div>
            setting
        </div>
        <div class="legend-setting">
            <strong class="setting-amount" style="color:{colors[3]};">{(stateData.properties["LRE Students Separate Settings"]).toFixed(0)}%</strong> 
            are in a 
            <span class="setting-name" style="background-color:{colors[3]}; color:white;">separate</span> 
            <div class="tooltip-container">
                <span class="question-bubble" use:tooltip={'in a hospital, incarcerated, etc.'}></span>
                <div class="tooltip">in a hospital, incarcerated, etc.</div>
            </div>
            setting
        </div> 
    </div>
    
</div>

<style>
    .state-data {
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        margin-top: 1.3rem;
    }

    .setting-amount {
        font-weight: 700;
        font-size: 1.2rem;
        letter-spacing: 0.04rem;
    }

    .setting-name {
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        padding: 1px 6px;
        letter-spacing: 0.04rem;
        /* border-radius: 3px; */
    }

    .legend {
        margin-top: 0.5rem;
    }

    .legend div {
        margin: 0.6rem 0;
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
        left: -3px;
        width: 14px;
        height: 14px;
        background-color: white;
        border-radius: 50%;
        border: 1.25px solid var(--color-text);
        margin-left: -5px;
        cursor: pointer;
        text-align: center;
        line-height: 16px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-text);
    }

    .question-bubble:before {
        content: '?';
    }

    .tooltip {
        display: none;
        padding: 10px;
        color: var(--text-color);
        background-color: white;
        position: absolute;
        top: -6px;
        right: 10px;
        z-index: 1;
        border-radius: 4px;
        min-width: 200px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>