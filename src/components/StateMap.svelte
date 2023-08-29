<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { selectedDistricts } from '../stores/stores.js';

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
        const [[featureMinLng, featureMinLat], [featureMaxLng, featureMaxLat]] = d3.geoBounds(feature);
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

      projection = d3.geoTransverseMercator()
        .rotate([-centralLong, -centralLat])
        .fitSize([dims.width, dims.height], featureCollection);

      districtPathGenerator = d3.geoPath(projection);
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
  
<div id="map">
    <svg width={dims.width} height={dims.height}>
      {#if districtPathGenerator}
        <defs>
          <clipPath id="Map_districts">
            <path d={districtPathGenerator(data)} />
          </clipPath>
        </defs>
    
        <g style={{ clipPath: "url(#districts)" }}>
          {#each data as district}
            {#if district.GEOID !== "999999"}
              <path
                class="districtShape"
                key={district.GEOID}
                d={districtPathGenerator(district)}
                fill={$selectedDistricts.includes(district.GEOID) ? "rgb(67,182,161,1.0)" : "lightgray"}
                stroke="white"
              >
                <title>
                  {district.name}
                </title>
              </path>
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
</style>
  

