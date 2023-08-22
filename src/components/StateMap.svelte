<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { selectedDistricts } from '../stores/stores.js';

    export let data
  
    let dims = {width: 500, height: 300};
  
    let sphere = { type: "Sphere" };
    let projection = d3.geoTransverseMercator()
      .rotate([120 + 55 / 75, -44])
      .fitWidth(dims.width, sphere)
      .translate([dims.width * 0.485, dims.height * 0.7])
      .scale(4700 * dims.width / 490);
  
    let districtPathGenerator = d3.geoPath(projection);
  
    onMount(() => {
      const ref = document.querySelector('#map');
      dims.width = ref.offsetWidth
      //dims.height = dims.width * 0.8;
      dims.height = dims.width * 0.8 > 500 ? 500 : dims.height;
    });
</script>
  
<div class="flex place-content-center" id="map" style="width: 100%;">
    <svg width={dims.width} height={dims.height}>
      <defs>
        <clipPath id="Map_sphere">
          <path d={districtPathGenerator(sphere)} />
        </clipPath>
      </defs>
  
      <g style={{ clipPath: "url(#Map_sphere)" }}>
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
    </svg>
</div>
  

