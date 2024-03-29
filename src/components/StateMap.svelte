<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { geoBounds, geoTransverseMercator, geoPath, scaleLinear, zoom, zoomIdentity, select } from 'd3';
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

    function showTooltip(name, value, rawInclusion) {
      if(value) {
        tooltip.textContent = `${name}`

        new InclusionRing({
          target: tooltip,
          props: {
            value: value,
            weighted_inclusion: rawInclusion
          }
        })
      } else {
        tooltip.innerHTML = `${name}<br><span class="tooltip-no-ieps">Data not available</span>`
      }

      tooltip.style.opacity = 1;
    }

    function updateTooltipPosition(event) {
      // Check if event has touches (is a touch event)
      if (event.touches) {
          tooltip.style.left = event.touches[0].pageX + "px";
          tooltip.style.top = event.touches[0].pageY + "px";
      } else {
          tooltip.style.left = event.pageX + "px";
          tooltip.style.top = event.pageY + "px";
      }
    }

    function hideTooltip() {
      tooltip.style.opacity = 0;
    }

    let isTouched = false;

    function toggleDistrictSelection(district) {
      const districtId = district.properties.GEOID;

      // Check if the district is already selected
      if ($selectedDistricts.includes(districtId)) {
        // Deselect it
        selectedDistricts.update(currentSelected => {
          return currentSelected.filter(id => id !== districtId);
        });
      } else {
        // Select it
        selectedDistricts.update(currentSelected => {
          return [...currentSelected, districtId];
        });
      }
    }

    let touchStartPosition = { x: 0, y: 0 };
    const tapThreshold = 10; // pixels, threshold to distinguish between tap and drag

    function handleTouchStart(event, district) {
      console.log("touchstart", event)
      if (event.touches && event.touches.length > 0) {
        // event.preventDefault();
        isTouched = true;
        touchStartPosition.x = event.touches[0].clientX;
        touchStartPosition.y = event.touches[0].clientY;
      }
    }

    function handleTouchMove(event) {
      console.log("touchmove", event)
      if (event.touches && event.touches.length > 0) {
        updateTooltipPosition(event);
      }
    }

    function handleTouchEnd(event, district) {
      console.log("touchend", event)
      if (event && event.changedTouches && event.changedTouches.length > 0) {
        const touchEndPosition = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY
        };

        // Calculate the distance moved
        const distanceMoved = Math.sqrt(
            Math.pow(touchEndPosition.x - touchStartPosition.x, 2) +
            Math.pow(touchEndPosition.y - touchStartPosition.y, 2)
        );

        // If the distance moved is less than the threshold, treat it as a tap
        if (distanceMoved < tapThreshold) {
            toggleDistrictSelection(district);
            showTooltip(district.properties["Institution Name"], district.properties.decile, district.properties.weighted_inclusion);
            updateTooltipPosition(event);
        }

        isTouched = false;
      }
    }

    function handleDistrictClick(event, district) {
      toggleDistrictSelection(district);
      
      if (!tooltipVisible) {
          showTooltip(district.properties["Institution Name"], district.properties.decile, district.properties.weighted_inclusion);
          updateTooltipPosition(event);
          tooltipVisible = true;
      } else {
          hideTooltip();
          tooltipVisible = false;
      }
    }

    let currentTransform = writable({ x: 0, y: 0, k: 1 })
    let svgElement
    let gElement

    function zoomed(event, transform) {
        // If event is not defined, use the provided transform directly
        if(!event) {
            const {x, y, k} = transform;
            gElement.setAttribute('transform', `translate(${x}, ${y}) scale(${k})`);
            return;
        }
        
        // Else use the transform from the D3 zoom event
        const {x, y, k} = event.transform;
        gElement.setAttribute('transform', `translate(${x}, ${y}) scale(${k})`);

        // Update the store
        currentTransform.set({ x, y, k });
    }

    let zoomBehavior
    let d3GElement

    function applyZoom(factor) {
        // Instead of manually calculating new scales and translations, we'll use the D3 API to do it
        d3GElement.call(zoomBehavior.scaleBy, factor);
    }

    // Adjust the dimensions and projection once the data is loaded
    onMount(() => {
      d3GElement = select(gElement)

      zoomBehavior = zoom()
        .scaleExtent([0.5, 8])
        .on("zoom", zoomed)

      d3GElement.call(zoomBehavior)

      updateProjection()

      window.addEventListener('resize', updateProjection)

      return () => {
        window.removeEventListener('resize', updateProjection)
      }
    })
</script>

<div class="tooltip" bind:this={tooltip}></div>
  
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
                            stroke-width={0.75 / $currentTransform.k}
                            fill-rule="evenodd"
                            on:touchstart={e => {
                              // e.preventDefault();
                              handleTouchStart(e, district);
                            }}
                            on:touchmove={e => {
                                // e.preventDefault();
                                handleTouchMove(e);
                            }}
                            on:touchend={e => {
                                // e.preventDefault();
                                handleTouchEnd(e, district);
                            }}
                            on:mouseover={e => {
                                if (!isTouched) showTooltip(district.properties["Institution Name"], district.properties.decile, district.properties.weighted_inclusion);
                            }}
                            on:mousemove={e => {
                                if (!isTouched) updateTooltipPosition(e);
                            }}
                            on:mouseout={e => {
                                if (!isTouched) hideTooltip();
                            }}
                            on:click={e => {
                                if (!isTouched) handleDistrictClick(e, district);
                            }}
                        ></path>

                        <!-- Circle at center of district
                        <circle
                            cx={projection([district.properties.INTPTLON, district.properties.INTPTLAT])[0]}
                            cy={projection([district.properties.INTPTLON, district.properties.INTPTLAT])[1]}
                            r="2"
                            fill="red"
                        /> -->
                    {/if}
                {/each}

                {#each data as district}
                    {#if district.properties.GEOID !== "999999" && $selectedDistricts.includes(district.properties.GEOID)}
                        {#if ($hideSmallDistricts && district.properties["Total Student Count"] >= 500) || !$hideSmallDistricts}
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
                              stroke={colors[4]}
                              stroke-width={1.4 / $currentTransform.k}
                              on:touchstart={e => {
                                // e.preventDefault();
                                handleTouchStart(e, district);
                              }}
                              on:touchmove={e => {
                                  // e.preventDefault();
                                  handleTouchMove(e);
                              }}
                              on:touchend={e => {
                                  // e.preventDefault();
                                  handleTouchEnd(e, district);
                              }}
                              on:mouseover={e => {
                                  if (!isTouched) showTooltip(district.properties["Institution Name"], district.properties.decile, district.properties.weighted_inclusion);
                              }}
                              on:mousemove={e => {
                                  if (!isTouched) updateTooltipPosition(e);
                              }}
                              on:mouseout={e => {
                                  if (!isTouched) hideTooltip();
                              }}
                              on:click={e => {
                                  if (!isTouched) handleDistrictClick(e, district);
                              }}
                          ></path>
                        {/if}
                    {/if}
                {/each}
                
            </g>
        {/if}
      </g>
    </svg>

    <!-- Legend -->
    <svg class="color-legend" width="150" height="210">
      <defs>
        <linearGradient id="inclusionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:{colors[0]}; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fff; stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect x="15" y="10" width="20" height="180" fill="url(#inclusionGradient)" />

      <text x="45" y="15" font-size="0.8rem" text-anchor="start" font-weight="600">More</text>
      <text x="45" y="30" font-size="0.8rem" text-anchor="start" font-weight="600">Inclusive</text>
      <text x="45" y="190" font-size="0.8rem" text-anchor="start" font-weight="600">Less</text>
      <text x="45" y="205" font-size="0.8rem" text-anchor="start" font-weight="600">Inclusive</text>
    </svg>

    <div class="zoom-controls">
      <button class="zoom-button" on:click={() => applyZoom(1.2)}>+</button>
      <button class="zoom-button" on:click={() => applyZoom(0.8)}>-</button>
    </div>
</div>

<style>
  #map {
      position: relative; /* Needed for absolute positioning of children */
      width: 100%;
      max-width: 72rem;
      min-height: 300px;
      display: flex;
      justify-content: center;
  }

  .color-legend {
      position: absolute;
      left: 10px;
      bottom: 10px;
      pointer-events: none; /* Make the legend non-interactive */
  }

  .zoom-controls {
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
  }

  .zoom-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--background-color);
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      color: var(--color-text);
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1;
      transition: var(--background-color) 0.3s;
      border: 2px solid var(--color-text);
      box-sizing: border-box;
      aspect-ratio: 1 / 1;
  }

  @media (max-width: 768px) {
    .zoom-button {
        font-size: 1.4rem;
    }
  }

  .zoom-button:hover {
      background-color: white;
  }

  .tooltip {
    position: absolute;
    padding: 10px;
    color: var(--text-color);
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
</style>
  
