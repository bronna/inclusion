<script>
    import { hideSmallDistricts, selectedDistrictsData } from '../stores/stores.js'
    import { writable, derived } from 'svelte/store'
    import { goto } from '$app/navigation'
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
                <span class="header-content">
                    DISTRICT
                    <span class="sort-arrow">
                        {@html $sortKey === "Institution Name" ? ($sortOrder === 1 ? arrowUp : arrowDown) : arrowDown}
                    </span>
                </span>
            </th>
            <th on:click={() => sortBy("weighted_inclusion")} class:sorted={$sortKey === "weighted_inclusion"}>
                <span class="header-content">
                    INCLUSION SCORE
                    <span class="sort-arrow">
                        {@html $sortKey === "weighted_inclusion" ? ($sortOrder === 1 ? arrowUp : arrowDown) : arrowDown}
                    </span>
                </span>
            </th>
            <!-- <th on:click={() => sortBy("nAlerts")} class:sorted={$sortKey === "nAlerts"}>
                <span class="header-content">
                    ALERTS
                    <span class="sort-arrow">
                        {@html $sortKey === "nAlerts" ? ($sortOrder === 1 ? arrowUp : arrowDown) : arrowDown}
                    </span>
                </span>
            </th> -->
            <th on:click={() => sortBy("Total Student Count")} class:sorted={$sortKey === "Total Student Count"}>
                <span class="header-content">
                    # OF STUDENTS WITH IEPs
                    <span class="sort-arrow">
                        {@html $sortKey === "Total Student Count" ? ($sortOrder === 1 ? arrowUp : arrowDown) : arrowDown}
                    </span>
                </span>
            </th>
        </tr>
    </thead>
    <tbody>
        {#each $sortedDistrictsData as district (district.properties.GEOID)}
            {#if !$hideSmallDistricts || (district.properties["Total Student Count"] > 500)}
                <tr>
                    <td class="district-name">
                        <span on:click={district.properties["Total Student Count"] ? () => goto(`/${district.properties.GEOID}`) : null}>
                            {district.properties["Institution Name"]}
                            {#if district.properties["Total Student Count"]}
                                <svg viewBox="0 0 24 24" width="12" height="12" class="inline-arrow">
                                    <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="3" />
                                </svg>
                            {/if}
                        </span>
                    </td>
                    <td class="district-metric">
                        {#if district.properties["Total Student Count"]}
                            <InclusionRing value={district.properties.decile} weighted_inclusion={district.properties.weighted_inclusion} />
                        {/if}
                    </td>
                    <!-- <td>
                        {#if district.properties.nAlerts > 0}
                            <span class="alert">{district.properties.nAlerts}</span>
                        {/if}
                    </td> -->
                    <td class="student-count">
                        {#if district.properties["Total Student Count"]}
                            {district.properties["Total Student Count"].toLocaleString()}
                        {:else}
                            <span class="no-data">-</span>
                        {/if}
                    </td>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>

<style>
    table {
        border-collapse: collapse;
        width: 100%;
    }
    
    th, td {
        padding: 8px 12px;
    }

    @media (max-width: 768px) {
        th, td {
            font-size: 0.75rem; /* smaller font size on mobile */
            padding: 6px 8px; /* smaller padding on mobile */
        }

        th:nth-child(1), td:nth-child(1) {
            width: 50%;
        }

        th:nth-child(2), td:nth-child(2) {
            width: 30%;
            text-align: center;
        }

        th:nth-child(3), td:nth-child(3) {
            width: 20%;
            text-align: right;
        }
    }

    th {
        border-bottom: 2px solid var(--dark-gray);
        text-align: left;
        vertical-align: middle;
        line-height: 1rem;
        font-size: 0.85rem;
        letter-spacing: 0.01rem;
        color: var(--dark-gray);
        cursor: pointer;
        position: relative; /* for arrow */
        opacity: 0.8;
    }

    .header-content {
        display: inline-flex;
        align-items: center;
        gap: 4px; /* Space between text and arrow */
    }

    .sort-arrow {
        display: inline-block;
        margin-left: 4px;
        opacity: 0.5;
    }

    th.sorted {
        color: var(--inclusive-color);
        opacity: 1;
    }

    th.sorted .sort-arrow {
        opacity: 1;
    }

    tbody tr td:hover {
        text-decoration: underline;
        text-decoration-thickness: 1.5px;
        text-underline-offset: 3px;
    }

    th:nth-child(1), 
    td:nth-child(1) {
        width: 50%; 
        padding-left: 1rem;
    }

    th:nth-child(2), 
    td:nth-child(2) {
        width: 35%; 
    }

    th:nth-child(3), 
    td:nth-child(3) {
        width: 25%; 
        text-align: right;
    }

    .district-name {
        font-family: 'Bitter', serif;
        font-size: 1.08rem;
        font-weight: 700;
        line-height: 1.5rem;
        letter-spacing: 0.04rem;
        white-space: normal;
        cursor: pointer;
    }

    .district-metric {
        text-align: center;
        white-space: normal;
        padding-left: 2.25rem;
    }

    .student-count {
        font-size: 1.2rem;
        white-space: normal;
        text-align: right;
        padding-right: 2rem;
    }

    /* .no-data {
        font-size: 0.9rem;
        line-height: -10rem;
    } */
</style>
