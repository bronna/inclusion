<script>
    import { onMount } from 'svelte';
    import { geoBounds, geoTransverseMercator, geoPath, scaleLinear, zoom, select } from 'd3';
    import { hideSmallDistricts, selectedDistricts, minWeightedInclusion, maxWeightedInclusion } from '../stores/stores.js';
    import { colors } from "../styles/colors";
    import InclusionRing from './InclusionRing.svelte';

    // Import and format the data
    export let data

    const featureCollection = {
      type: "FeatureCollection",
      features: data
    }

    const colorScale = scaleLinear()
      .domain([$minWeightedInclusion, $maxWeightedInclusion])
      .range(['#fff', colors[0]]);
  
    // Set initial values for dimensions and projection
    let dims = { width: 0, height: 0 }
    let centralLat = 43.9
    let centralLong = -120.5

    let projection
    let districtPathGenerator

    // Find the bounds encompassing all districts in the state
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

    data.forEach(feature => {
      if(feature.geometry) {
        const [[featureMinLng, featureMinLat], [featureMaxLng, featureMaxLat]] = geoBounds(feature);

        if (featureMinLng < minLng) minLng = featureMinLng;
        if (featureMinLat < minLat) minLat = featureMinLat;
        if (featureMaxLng > maxLng) maxLng = featureMaxLng;
        if (featureMaxLat > maxLat) maxLat = featureMaxLat;
      }
    });

    // const stateBounds = [[minLng, minLat], [maxLng, maxLat]];

    // resize the map when the window resizes
    function updateProjection() {
      const ref = document.querySelector('#map')
      const widthStateBounds = maxLng - minLng
      const heightStateBounds = maxLat - minLat
      const aspectRatio = widthStateBounds / heightStateBounds

      dims.width = ref.offsetWidth

      const minHeight = 300
      dims.height = Math.max(dims.width / aspectRatio, minHeight)

      projection = geoTransverseMercator()
        .rotate([-centralLong, -centralLat])
        .fitSize([dims.width, dims.height], featureCollection);

      districtPathGenerator = geoPath(projection);
    }

    let tooltip;
    let tooltipVisible = false

    function showTooltip(name, value) {
      if(value) {
        tooltip.textContent = `${name}`

        new InclusionRing({
          target: tooltip,
          props: {
            value: value
          }
        })
      } else {
        tooltip.innerHTML = `${name}<br><span class="tooltip-no-ieps">No students with IEPs</span>`
      }

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
      const districtId = district.properties.GEOID;

      // check if the district is already selected
      if ($selectedDistricts.includes(districtId)) {
        // deselect it
        selectedDistricts.update(currentSelected => {
          return currentSelected.filter(id => id !== districtId)
        })
      } else {
        // select it
        selectedDistricts.update(currentSelected => {
          return [...currentSelected, districtId]
        })
      }

      if (!tooltipVisible) {
          showTooltip(district.name, district.decile);
          updateTooltipPosition(event);
          tooltipVisible = true;
      } else {
          hideTooltip();
          tooltipVisible = false;
      }
    }

    let svgElement
    let gElement

    // let currentZoomScale = 1
    // let currentTranslateX = 0
    // let currentTranslateY = 0

    // function applyZoom(increment) {
    //     if (typeof increment !== 'number' || isNaN(increment)) {
    //       console.error('Invalid zoom increment:', increment);
    //       return;  // Exit the function early if increment is invalid
    //     }

    //     // Calculate the new scale
    //     const newScale = currentZoomScale * increment;

    //     // Ensure the scale is within the limits [0.5, 8]
    //     currentZoomScale = Math.max(0.5, Math.min(newScale, 8));

    //     // Find the current center point within the view of the SVG element, taking into account the translation from panning
    //     const centerX = (dims.width / 2 - currentTranslateX) / currentZoomScale;
    //     const centerY = (dims.height / 2 - currentTranslateY) / currentZoomScale;

    //     // Calculate the translation needed to keep the current view centered
    //     currentTranslateX = dims.width / 2 - centerX * currentZoomScale;
    //     currentTranslateY = dims.height / 2 - centerY * currentZoomScale;

    //     // Apply the transformations directly to the element
    //     gElement.setAttribute('transform', `translate(${currentTranslateX}, ${currentTranslateY}) scale(${currentZoomScale})`);
    // }

    // Adjust the dimensions and projection once the data is loaded
    onMount(() => {
      const d3SvgElement = select(svgElement)

      const zoomBehavior = zoom()
        .scaleExtent([0.5, 8])
        .on("zoom", (event) => {
          const {x, y, k} = event.transform; // k is scale, x and y are translation coordinates
          gElement.setAttribute('transform', `translate(${x}, ${y}) scale(${k})`);
        })

      d3SvgElement.call(zoomBehavior)

      svgElement.addEventListener('wheel', event => {
        event.preventDefault()

        zoomBehavior.on("zoom").call(svgElement, event)
      }, { passive: false })

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

<!-- <button on:click={() => applyZoom(1.2)}>+</button>
<button on:click={() => applyZoom(0.8)}>-</button> -->
  
<div id="map">

    <svg bind:this={svgElement} width={dims.width} height={dims.height}>
      <g bind:this={gElement}>
        {#if districtPathGenerator}
            <g style={{ clipPath: "url(#districts)" }}>
                
                {#each data as district}
                    {#if district.properties.GEOID !== "999999"}
                        <path
                            class="districtShape"
                            key={district.properties.GEOID}
                            d={districtPathGenerator(district)}
                            fill={
                              $hideSmallDistricts && district.properties["Total Student Count"] < 500 
                              ? "lightgray" 
                              : district.properties.weighted_inclusion 
                                ? colorScale(district.properties.weighted_inclusion) 
                                : "lightgray"
                            }
                            stroke="white"
                            stroke-width="0.75"
                            fill-rule="evenodd"
                            on:mouseover={() => showTooltip(district.properties["Institution Name"], district.properties.decile)}
                            on:mousemove={updateTooltipPosition}
                            on:mouseout={hideTooltip}
                            on:click={e => handleDistrictClick(e, district)}
                        ></path>
                    {/if}
                {/each}

                {#each data as district}
                    {#if district.properties.GEOID !== "999999" && $selectedDistricts.includes(district.properties.GEOID)}
                        <path
                            class="districtShape"
                            key={district.properties.GEOID}
                            d={districtPathGenerator(district)}
                            fill={
                              $hideSmallDistricts && district.properties["Total Student Count"] < 500 
                              ? "lightgray" 
                              : district.properties.weighted_inclusion 
                                ? colorScale(district.properties.weighted_inclusion) 
                                : "lightgray"
                            }
                            stroke="black"
                            stroke-width="1.2"
                            on:mouseover={() => showTooltip(district.properties["Institution Name"], district.properties.decile)}
                            on:mousemove={updateTooltipPosition}
                            on:mouseout={hideTooltip}
                            on:click={e => handleDistrictClick(e, district)}
                        ></path>
                    {/if}
                {/each}
                
            </g>
        {/if}
      </g>
      
    </svg>
</div>

<style>
  #map {
    width: 100%;
    min-height: 300px;
    display: flex;
    justify-content: center;
  }

  .tooltip {
    position: absolute;
    padding: 10px;
    color: var(--text-color);
    background-color: white;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .districtShape:hover {
    /* opacity: 0.5; */
    /* stroke: var(--inclusive-color);
    stroke-width: 2px; */
  }

  .tooltip-no-ieps {
    font-size: 0.6rem;
    color: var(--dark-gray);
  }
</style>
  
