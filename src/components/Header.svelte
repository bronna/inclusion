<script>
  import { colors } from "../styles/colors";
</script>

<header>
  <div class="logo">
    <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="25" fill={colors[0]} />
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
    color: var(--inclusive-color);
    font-size: 1.2rem;
    line-height: 1.1rem;
  }
</style>
