<script>
  import { colors } from "../styles/colors";
</script>

<header>
  <div class="logo">
    <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M 25,2 A 23,23 0 1,1 7,11"
            fill="none" 
            stroke={colors[8]} 
            stroke-width="3.5"
            stroke-linecap="round"
        />
    </svg>  
    <a href="https://specialeducationdata.org">
      Data for<br>Caregivers
    </a>
  </div>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4rem;
  }

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
    color: var(--dark-gray);
    font-size: 1.2rem;
    line-height: 1.1rem;
  }
</style>
