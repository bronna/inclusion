<script>
    import { onMount } from 'svelte'

    export let content = ''
    export let visible = false
    export let position = { x: 0, y: 0 }

    let tooltipElement

    onMount(() => {
        updatePosition()
    })

    $: if (visible) {
        updatePosition()
    }

    function updatePosition() {
        if (tooltipElement) {
            tooltipElement.style.left = `${position.x}px`
            tooltipElement.style.top = `${position.y}px`
            tooltipElement.style.opacity = visible ? 1 : 0
        }
    }
</script>

<div bind:this={tooltipElement} class="tooltip">
    {@html content}
</div>

<style>
    .tooltip {
        position: absolute;
        padding: 10px;
        color: var(--text-color);
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 100;
    }
</style>
