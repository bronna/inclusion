<script>
    import { colors } from "../styles/colors"
</script>

<div class="logo">
    <a href="/">
        <span class="logo-letters" style="color: {colors[8]};">A</span>
        <span class="logo-letters" style="color: {colors[8]};">d</span>
        <span class="logo-letters" style="color: {colors[8]};">a</span>
        <span class="logo-letters" style="color: {colors[8]}; font-weight: 400;">Data</span>
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
        font-weight: 800;
        font-size: 1.6rem;
        line-height: 1.2rem;
        display: flex;
    }

    .logo-letters {
        display: inline-block;
        transition: color 0.3s;
        margin-right: 1px;
        /* text-shadow: 0.25px 0.5px 0.5px rgba(0, 0, 0, 0.3); */
    }
</style>
