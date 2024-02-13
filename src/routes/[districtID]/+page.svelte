<script>
    import { page } from '$app/stores'
    import { districtsData } from '../../stores/stores'
    import { colors } from '../../styles/colors'
    import InclusionRing from '../../components/InclusionRing.svelte'
    import MiniHistogram from '../../components/MiniHistogram.svelte'
    import DonutChart from '../../components/DonutChart.svelte'
    import DonutLegend from '../../components/DonutLegend.svelte'
    import AlertsCards from '../../components/AlertsCards.svelte'
    import Sources from '../../components/Sources.svelte'
    import DistrictCard from '../../components/DistrictCard.svelte'

    let districtData, stateData, alerts

    $: districtID = $page.params.districtID

    $: if ($districtsData) {
        districtData = $districtsData.find(d => d.properties.GEOID === districtID)
        stateData = $districtsData.find(d => d.properties.GEOID === "999999")
    }

    $: alerts = [
        {name: "Suspension/Expulsion", value: districtData.properties.SuspExplFg},
        {name: "Suspension/Expulsion by race", value: districtData.properties.SuspExplRaceEthnicityFg},
        {name: "Disproportionate representation", value: districtData.properties.DisPrptnRprsntnFg},
        {name: "Disproportionate representation by disability", value: districtData.properties.DisPrptnRprsntnDsbltyFg},
    ]

    let inclusionCategories, gradRates, gradDonutCenterText, stateAvgGradRate

    $: if (districtData && districtData.properties["Total Student Count"]) {
        inclusionCategories = [
            {group: "inclusive", value: districtData.properties["LRE Students >80%"]},
            {group: "semi-inclusive", value: districtData.properties["LRE Students >40% <80%"]},
            {group: "non-inclusive", value: districtData.properties["LRE Students <40%"]},
            {group: "separate", value: districtData.properties["LRE Students Separate Settings"]},
        ]

        gradRates = [
            {group: "graduated", value: districtData.properties["IEP 4Yr Cohort Grad 18-19"]},
            {group: "notGraduated", value: 100 - districtData.properties["IEP 4Yr Cohort Grad 18-19"]},
        ]

        if (districtData.properties['IEP 4Yr Cohort Grad 18-19'] === 5) {
            gradDonutCenterText = '<' + Math.round(districtData.properties['IEP 4Yr Cohort Grad 18-19']) + '%';
        } else if (districtData.properties['IEP 4Yr Cohort Grad 18-19'] === 95) {
            gradDonutCenterText = '>' + Math.round(districtData.properties['IEP 4Yr Cohort Grad 18-19']) + '%';
        } else {
            gradDonutCenterText = Math.round(districtData.properties['IEP 4Yr Cohort Grad 18-19']) + '%';
        }

        stateAvgGradRate = stateData.properties['IEP 4Yr Cohort Grad 18-19']
        }
</script>

<section>
{#if districtData}
    <h1 class="district-name">{districtData.properties["Institution Name"]}</h1>

    <div class="text-width metric" id="score">
        <div class="score-label">
            <h3 class="metric-name">Inclusion Score: </h3>
            <InclusionRing value={districtData.properties.decile} weighted_inclusion={districtData.properties.weighted_inclusion} />
        </div>
        
        <div class="comparison-hists">
            <div class="hist-inclusion">
                <MiniHistogram 
                    metric1={"weighted_inclusion"}
                    currentMetric1Value={districtData.properties.weighted_inclusion}
                    metric2={"decile"}
                    currentMetric2Value={districtData.properties.decile}
                    districtName={districtData.properties["Institution Name"]}
                />
            </div>
        </div>
    </div>

    <div class="text-width metric">
        <h3 class="metric-name" id="inclusion-donut">Inclusion Rates</h3>
        {#if inclusionCategories && inclusionCategories.length > 0}
            <DonutChart 
                data = {inclusionCategories} 
                chartColors = {colors}
                centerText={districtData.properties["Total Student Count"].toLocaleString('en-US')}
                centerText2="students"
                centerText3="with IEPs"
            />
            <DonutLegend data={districtData} />
        {:else}
            <p>No data available</p>
        {/if}
    </div>

    <div class="text-width metric">
        <h3 class="metric-name">Alerts</h3>
        <p class="data-asterisk">*lower discipline rates school year 21-22 due to remote learning</p>
        {#if districtData.properties["Total Student Count"] && alerts}
            <AlertsCards alertsData={alerts} />
        {:else}
            <p>No data available</p>
        {/if}
    </div>

    <div class="text-width metric">
        <h3 class="metric-name">4-Year Graduation Rate of Students with IEPs</h3>
        <p class="data-asterisk">*school year 2018-19</p>
        {#if districtData.properties["Total Student Count"]}
            <DonutChart 
                height = {120}
                outerRadius = {60}
                innerRadius = {40}
                barSpacing = {1}
                data = {gradRates} 
                chartColors = {[colors[0], colors[6]]}
                centerText={gradDonutCenterText}
                indicator={[{group: "gradRate", value: stateAvgGradRate}, {group: "notGradRate", value: 100 - stateAvgGradRate}]}
            />
        {:else}
            <p>No data available</p>
        {/if}
    </div>

    <div class="text-width metric">
        <h3 class="metric-name">Nearby Districts</h3>
        <div class="district-cards-container">
            {#each districtData.properties.neighbors as neighbor}
                <DistrictCard districtId={neighbor} />
            {/each}
        </div>
    </div>

    <div class="sources">
        <Sources />
    </div>
    
{:else}
    <p>Loading...</p>
{/if}
</section>

<style>
    .metric {
        margin: 2.5rem 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    #score {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .score-label {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1.6rem;
    }

    .metric-name {
        color: var(--color-text);
        font-size: 1.3rem;
        letter-spacing: 0.01rem;
        font-weight: 700;
        font-family: 'Bitter', serif;
        margin-right: 1rem;
    }

    .comparison-hists {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .hist-inclusion {
        display: flex;
        flex-direction: column;
    }

    #inclusion-donut {
        margin-bottom: 1rem;
    }

    .data-asterisk {
        font-size: 0.9rem;
        color: var(--color-text);
        margin-top: 0.5rem;
    }

    .district-cards-container {
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        gap: 1rem;
        max-width: 100%;
        white-space: nowrap;
    }

    .sources {
        margin-top: 1rem;
    }
</style>

