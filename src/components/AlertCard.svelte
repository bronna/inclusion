<script>
    import { colors } from "../styles/colors"

    export let alertData
</script>

<div class="alert-card">
    {#if alertData.value === "Yes"}
        <!-- exclamation mark -->
        <svg width="100px" height="100px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="transform: scale(0.5);">
            <line 
                x1="50" y1="20" 
                x2="50" y2="60" 
                stroke={colors[3]} 
                stroke-width="12" 
                stroke-linecap="round"
            />
            <circle 
                cx="50" cy="80" 
                r="8" 
                fill={colors[3]}
            />
        </svg>
    {:else}
        <!-- check mark -->
        <svg width="100px" height="100px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="transform: scale(0.5);">
            <path 
                d="M20,55 L40,75 L80,25" 
                stroke={colors[0]} 
                stroke-width="12" 
                fill="none" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            />
        </svg>
    {/if}
    {#if alertData.name === "Suspension/Expulsion"}
        <p class="alert-description">{alertData.value === "No" ? "No reports of disproportionate discipline of students with IEPs" : "This district reported disproportionate discipline of students with IEPs"}</p>
    {:else if alertData.name === "Suspension/Expulsion by race"}
        <p class="alert-description">{alertData.value === "No" ? "No reports of disproportionate discipline of students in certain racial groups with IEPs" : "This district reported disproportionate discipline of students in certain racial groups with IEPs"}</p>
    {:else if alertData.name === "Disproportionate representation"}
        <p class="alert-description">{alertData.value === "No" ? "No reports of disproportionate identification of students in certain racial groups as having a disability" : "This district reported disproportionate identification of students in certain racial groups as having a disability"}</p>
    {:else if alertData.name === "Disproportionate representation by disability"}
        <p class="alert-description">{alertData.value === "No" ? "No reports of disproportionate identification of students in certain racial groups as having a certain disability" : "This district reported disproportionate identification of students in certain racial groups as having a specific disability"}</p>
    {/if}
    
</div>

<style>
    .alert-card {
        width: 100%;
        max-width: 140px;
        margin-top: -0.5rem;
    }

    .alert-card p {
        margin-top: -1rem;
    }

    .alert-description {
        font-size: 0.9rem;
        margin-bottom: 0;
    }
</style>

