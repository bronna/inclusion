<script>
    import { selectedDistrictsData } from '../stores/stores.js';
    let expandedDistrict = null;

    function toggleExpand(district) {
        if(expandedDistrict === district) {
            expandedDistrict = null;
        } else {
            expandedDistrict = district;
        }
    }
</script>

<div class="text-width">
    <div class="header-row">
        <span>district</span>
        <span>score</span>
        <span>alerts</span>
        <span>number students<br>with IEPs</span>
    </div>
    
    {#each $selectedDistrictsData as district}
        <div class="card" on:click={() => toggleExpand(district)}>
            <div>{district.properties["Institution Name"]}</div>
            <div>{district.properties.decile}</div>
            <div>{district.properties.nAlerts}</div>
            <div>{district.properties["Total Student Count"]}</div>
            {#if expandedDistrict === district}
                <div class="expanded-content">
                    <!-- Add more detailed information about the district here -->
                    Detailed information about {district.properties["Institution Name"]}
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .text-width {
        max-width: 36rem;
        width: 100%;
    }

    .header-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid #e0e0e0;
        text-align: left;
        vertical-align: bottom;
        line-height: 1rem;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03rem;
        color: var(--dark-gray);
    }

    .card {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
    }

    .card:hover {
        background-color: #f9f9f9;
    }

    .card > div:nth-child(1) {
        text-align: left;
    }

    .card > div:nth-child(2),
    .card > div:nth-child(3) {
        text-align: center;
    }

    .card > div:last-child {
        text-align: right;
    }

    .expanded-content {
        grid-column: 1 / -1;  /* Span all the columns */
        padding-top: 1rem;
        color: var(--dark-gray);
    }
</style>
