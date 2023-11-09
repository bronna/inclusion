<script>
    import { hideSmallDistricts, selectedDistrictsData } from '../stores/stores.js';
    import InclusionRing from './InclusionRing.svelte';
</script>

<table class="text-width">
    <thead>
        <tr>
            <th>DISTRICT</th>
            <th>INCLUSION SCORE</th>
            <th>ALERTS</th>
            <th># OF STUDENTS WITH IEPs</th>
        </tr>
    </thead>
    <tbody>
        {#each $selectedDistrictsData as district (district.properties.GEOID)}
            {#if !$hideSmallDistricts || (district.properties["Total Student Count"] > 500)}
                <tr>
                    <td class="district-name">{district.properties["Institution Name"]}</td>
                    <td>
                        <InclusionRing value={district.properties.decile} />
                    </td>
                    <td>
                        {#if district.properties.nAlerts > 0}
                            <span class="alert">{district.properties.nAlerts}</span>
                        {/if}
                    </td>
                    <td class="student-count">{district.properties["Total Student Count"].toLocaleString()}</td>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>

<style>
    .text-width {
        max-width: 36rem;
        width: 100%;
    }

    table {
        border-collapse: collapse;
        width: 100%;
    }
    
    th, td {
        padding: 8px 12px;
    }

    th {
        border-bottom: 1px solid #e0e0e0;
        text-align: left;
        vertical-align: bottom;
        line-height: 1rem;
        font-size: 0.8rem;
        letter-spacing: 0.03rem;
        color: var(--dark-gray);
    }

    tr:hover {
        background-color: #f9f9f9;
    }

    th:nth-child(1), 
    td:nth-child(1) {
        width: 50%; 
    }

    th:nth-child(2), 
    td:nth-child(2) {
        width: 20%; 
    }

    th:nth-child(3), 
    td:nth-child(3) {
        width: 15%; 
    }

    th:nth-child(4),
    td:nth-child(4) {
        width: 15%
    }

    .district-name {
        font-family: 'Bitter', serif;
        font-size: 1.08rem;
        font-weight: 700;
        line-height: 1.5rem;
        letter-spacing: 0.04rem;
    }

    .student-count {
        font-size: 1.2rem;
    }
</style>
