<script>
    import { colors } from "../styles/colors"
</script>

<div class="logo">
    <!-- <svg width="52" height="52" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M 26,3 A 23,23 0 1,1 8,11"
            fill="none" 
            stroke={colors[0]} 
            stroke-width="4.5"
            stroke-linecap="round"
        />
    </svg>   -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="550 96 452 428" width="62" height="62"><path id="path_ffe04486-c673-4874-0077-479379f58b9c" d="M170.92,-21.87 Q185.30,-20.12 232.30,-9.58 T316.87,38.46 365.18,124.23 364.27,218.93 313.92,298.30 227.67,340.37 127.99,340.89 43.58,290.79 4.40,200.42 18.21,108.41 49.56,58.52 61.85,51.08 65.23,50.28 68.70,50.59 71.88,52.00 74.45,54.35 76.13,57.39 76.75,60.82 76.25,64.26 74.67,67.36 72.18,69.80 69.05,71.31 65.60,71.74 62.19,71.05 59.18,69.31 56.88,66.70 55.54,63.49 55.29,60.02 56.17,56.65 58.07,53.74 60.80,51.59 64.08,50.42 67.56,50.36 70.88,51.42 73.68,53.48 75.68,56.32 76.67,59.66 76.54,63.13 75.30,66.39 73.10,69.08 71.77,70.24 48.48,97.76 26.26,173.09 53.21,262.86 128.39,314.27 227.29,312.80 307.67,263.08 338.13,173.07 308.87,81.76 230.73,32.16 174.31,22.26 164.49,21.32 159.52,19.62 155.09,16.78 151.48,12.97 148.89,8.40 147.46,3.34 147.29,-1.91 148.38,-7.05 150.66,-11.78 154.01,-15.83 158.24,-18.95 163.09,-20.98 168.28,-21.78 Z" fill={colors[0]} stroke="transparent" stroke-width="0" stroke-linejoin="round" stroke-linecap="round" pointer-events="all" transform="translate(590, 136)"/></svg>

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
        margin-left: 7px;
        text-decoration: none;
        font-family: var(--font-headers);
        color: var(--inclusive-color);
        font-weight: 800;
        font-size: 1.2rem;
        line-height: 1.2rem;
    }
</style>
