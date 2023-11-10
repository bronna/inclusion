<script>
    import { hideSmallDistricts, selectedDistrictsData } from '../stores/stores.js'
    import { writable, derived } from 'svelte/store'
    import InclusionRing from './InclusionRing.svelte'

    const sortKey = writable('null')
    const sortOrder = writable(1) // 1 for ascending, -1 for descending

    function sortBy(key) {
        sortKey.set(key)
        sortOrder.update(n => -n) // toggle between ascending and descending
    }

    const sortedDistrictsData = derived(
        [selectedDistrictsData, sortKey, sortOrder],
        ([$selectedDistrictsData, $sortKey, $sortOrder]) => {
            if (!$sortKey) return $selectedDistrictsData;
            return $selectedDistrictsData.slice().sort((a, b) => {
                const aValue = a.properties[$sortKey];
                const bValue = b.properties[$sortKey];
                return $sortOrder * ((aValue > bValue) - (bValue > aValue));
            });
        }
    )

    const arrowUp = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>`
    const arrowDown = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>`
</script>

<table class="text-width">
    <thead>
        <tr>
            <th on:click={() => sortBy("Institution Name")} class:sorted={$sortKey === "Institution Name"}>
                DISTRICT
                {@html $sortKey === "Institution Name" ? ($sortOrder === 1 ? arrowUp : arrowDown) : ''}
            </th>
            <th on:click={() => sortBy("decile")} class:sorted={$sortKey === "decile"}>
                INCLUSION SCORE
                {@html $sortKey === "decile" ? ($sortOrder === 1 ? arrowUp : arrowDown) : ''}
            </th>
            <th on:click={() => sortBy("nAlerts")} class:sorted={$sortKey === "nAlerts"}>
                ALERTS
                {@html $sortKey === "nAlerts" ? ($sortOrder === 1 ? arrowUp : arrowDown) : ''}
            </th>
            <th on:click={() => sortBy("Total Student Count")} class:sorted={$sortKey === "Total Student Count"}>
                # OF STUDENTS WITH IEPs
                {@html $sortKey === "Total Student Count" ? ($sortOrder === 1 ? arrowUp : arrowDown) : ''}
            </th>
        </tr>
    </thead>
    <tbody>
        {#each $sortedDistrictsData as district (district.properties.GEOID)}
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
        color: var(--dark-gray); /* make lighter */
        cursor: pointer;
        position: relative; /* for arrow */
    }

    th.sorted {
        color: var(--separate-color);
    }

    /* th svg {
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
    } */

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
