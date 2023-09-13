<script>
    import { onMount } from 'svelte';
    import { geoBounds, geoTransverseMercator, geoPath } from 'd3';
    import { selectedDistricts } from '../stores/stores.js';
    import { colors } from "../styles/colors";

    // Import and format the data
    export let data

    const featureCollection = {
      type: "FeatureCollection",
      features: data
    }
  
    // Set initial values for dimensions and projection
    let dims = {}
    let centralLat = 43.9
    let centralLong = -120.5

    let projection
    let districtPathGenerator

    // Find the bounds encompassing all districts in the state
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

    data.forEach(feature => {
        const [[featureMinLng, featureMinLat], [featureMaxLng, featureMaxLat]] = geoBounds(feature);
        if (featureMinLng < minLng) minLng = featureMinLng;
        if (featureMinLat < minLat) minLat = featureMinLat;
        if (featureMaxLng > maxLng) maxLng = featureMaxLng;
        if (featureMaxLat > maxLat) maxLat = featureMaxLat;
    });

    const stateBounds = [[minLng, minLat], [maxLng, maxLat]];

    // resize the map when the window resizes
    function updateProjection() {
      const ref = document.querySelector('#map')
      const widthStateBounds = maxLng - minLng
      const heightStateBounds = maxLat - minLat
      const aspectRatio = widthStateBounds / heightStateBounds

      dims.width = ref.offsetWidth
      dims.height = dims.width / aspectRatio

      projection = geoTransverseMercator()
        .rotate([-centralLong, -centralLat])
        .fitSize([dims.width, dims.height], featureCollection);

      districtPathGenerator = geoPath(projection);
    }

    let tooltip;
    let tooltipVisible = false

    function showTooltip(name) {
      tooltip.textContent = name;
      tooltip.style.opacity = 1;
    }

    function updateTooltipPosition(event) {
      // Check if event has touches (is a touch event)
      if (event.touches) {
          tooltip.style.left = event.touches[0].clientX + "px";
          tooltip.style.top = event.touches[0].clientY + "px";
      } else {
          tooltip.style.left = event.pageX + "px";
          tooltip.style.top = event.pageY + "px";
      }
    }

    function hideTooltip() {
      tooltip.style.opacity = 0;
    }

    function handleDistrictClick(event, district) {
        if (!tooltipVisible) {
            showTooltip(district.name);
            updateTooltipPosition(event);
            tooltipVisible = true;
        } else {
            hideTooltip();
            tooltipVisible = false;
        }
    }

    // Adjust the dimensions and projection once the data is loaded
    onMount(() => {
      updateProjection()

      const resizeHandler = () => {
        updateProjection()
      }

      window.addEventListener('resize', resizeHandler)

      return () => {
        window.removeEventListener('resize', resizeHandler)
      }
    });
</script>

<div class="tooltip" bind:this={tooltip}></div>
  
<div id="map">
    <svg width={dims.width} height={dims.height}>
      {#if districtPathGenerator}
        <g style={{ clipPath: "url(#districts)" }}>
          {#each data as district}
            {#if district.GEOID !== "999999"}
              <path
                class="districtShape"
                key={district.GEOID}
                d={districtPathGenerator(district)}
                fill={$selectedDistricts.includes(district.GEOID) ? colors[0] : "lightgray"}
                stroke="white"
                stroke-width="0.75"
                on:mouseover={() => showTooltip(district.name)}
                on:mousemove={updateTooltipPosition}
                on:mouseout={hideTooltip}
                on:click={e => handleDistrictClick(e, district)}
              ></path>
            {/if}
          {/each}
        </g>
      {/if}
    </svg>
</div>

<style>
  #map {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .tooltip {
    position: absolute;
    padding: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .districtShape:hover {
    fill: rgb(67,182,161,0.6);
  }
</style>
  

