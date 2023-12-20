<script>
    import { colors } from "../styles/colors"
</script>

<div class="logo">
    <svg width="52" height="52" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M 26,3 A 23,23 0 1,1 8,11"
            fill="none" 
            stroke={colors[0]} 
            stroke-width="4.5"
            stroke-linecap="round"
        />
    </svg>  
    <a href="/">
      Inclusion<br>Data
    </a>
</div>

<style>
    .logo {
        display: flex;
        align-items: flex-start; /* align the child items to the top */
    }

    .logo svg {
        opacity: 0.75;
    }

    .logo a {
        margin-left: 9px;
        text-decoration: none;
        font-family: var(--font-headers);
        color: var(--inclusive-color);
        font-weight: 800;
        font-size: 1.2rem;
        line-height: 1.1rem;
    }
</style>