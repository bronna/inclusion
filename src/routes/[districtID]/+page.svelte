<script>
    import InclusionRing from '../../components/InclusionRing.svelte';
    import MiniHistogram from '../../components/MiniHistogram.svelte';
    import DistrictDonut from '../../components/DistrictDonut.svelte';
    import DonutLegend from '../../components/DonutLegend.svelte';
    export let data

    console.log(data)
</script>

<section>
    <h1 class="district-name">{data.properties["Institution Name"]}</h1>

    <div class="text-width metric" id="score">
        <div class="score-label">
            <h3 class="metric-name">Inclusion Score: </h3>
            <InclusionRing value={data.properties.decile} weighted_inclusion={data.properties.weighted_inclusion} />
        </div>
        
        <div class="comparison-hists">
            <MiniHistogram 
                metricName={"weighted_inclusion"} 
                metric ={data.properties.weighted_inclusion}
                metricLabel={data.properties.decile}
            />
        </div>
    </div>

    <div class="text-width metric">
        <h3 class="metric-name">Inclusion Breakdown</h3>
        <DistrictDonut districtData={data} />
        <DonutLegend districtData={data} />
    </div>

    <div class="text-width metric">
        <h3 class="metric-name">Discipline</h3>
        <p>
            {data.properties.SuspExplFg === "No" ? "No reports of disproportionate discipline of students with IEPs" : "This district reported disproportionate discipline of students with IEPs"}
        </p>
        <p>
            {data.properties.SuspExplRaceEthnicityFg === "No" ? "No reports of disproportionate discipline of students in certain racial groups with IEPs" : "This district reported disproportionate discipline of students in certain racial groups with IEPs"}
        </p>
    </div>

    <div class="text-width metric">
        <h3 class="metric-name">Racial Representation</h3>
        <p>
            {data.properties.DisPrptnRprsntnFg === "No" ? "No reports of disproportionate identification of students in certain racial groups as having a disability" : "This district reported disproportionate identification of students in certain racial groups as having a disability"}
        </p>
        <p>
            {data.properties.DisPrptnRprsntnDsbltyFg === "No" ? "No reports of disproportionate identification of students in certain racial groups as having a certain disability" : "This district reported disproportionate identification of students in certain racial groups as having a certain disability"}
        </p>
    </div>

    <div class="text-width metric">
        <h3 class="metric-name">Graduation Rate</h3>
    </div>

    <div class="text-width metric">
        <h3 class="metric-name">Nearby Districts</h3>
    </div>
</section>

<style>
    .metric {
        margin: 1rem 0;
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
    }

    .metric-name {
        color: var(--color-text);
        font-size: 1.3rem;
        letter-spacing: 0.01rem;
        font-weight: 700;
        font-family: 'Bitter', serif;
        margin-right: 1rem;
    }
</style>