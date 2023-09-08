<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<script>
  import { getData } from "../data/processData.js";
  import { selectedDistricts, districtsData, selectedDistrictsData } from "../stores/stores.js"
  import { colors } from '../styles/colors';
  import Svelecte from "svelecte";
  import RangeSlider from "svelte-range-slider-pips"
  import StateLegend from "../components/StateLegend.svelte";
  import DistrictBar from "../components/DistrictBar.svelte";
  import StateMap from "../components/StateMap.svelte";
  import StateAvg from "../components/StateAvg.svelte";
  import { scaleOrdinal } from "d3";

  let data = getData()

  let stateData = data.find(row => row.properties.GEOID === "999999")
  let stateAvgLines = [
	stateData.properties.eighty, 
	stateData.properties.eighty + stateData.properties.between, 
	stateData.properties.eighty + stateData.properties.between + stateData.properties.forty
  ]//.map(value => parseFloat(value.toFixed(2)));

  let numberDistricts = $districtsData.length

  let backgroundSVG

	// Define the sort and filter actions
    let actions = [
        { 
			name: `Select all (${numberDistricts})`, 
			action: () => {
				selectedDistricts.set(
					$districtsData
						.filter(district => district.GEOID !== undefined && district.GEOID !== null)
						.map(district => district.GEOID)
				);
				minSize = 0;
				maxSize = 9000
				values = [minSize, maxSize]
				showMenu = false;
			} 
		},
        { 
			name: 'Sort by most inclusive', 
			action: () => {
				let sortedDistricts = $selectedDistrictsData
					.sort((a, b) => (b.eighty + b.between) - (a.eighty + a.between))
					.map(district => district.GEOID)
				selectedDistricts.set(sortedDistricts)
				showMenu = false;
			} 
		},
        { 
			name: 'Sort by least inclusive', 
			action: () => {
				let sortedDistricts = $selectedDistrictsData
					.sort((a, b) => (b.forty + b.separate) - (a.forty + a.separate))
					.map(district => district.GEOID)
				selectedDistricts.set(sortedDistricts)
				showMenu = false;
			} 
		},
		{ 
			name: 'Sort by name', 
			action: () => {
				let sortedDistricts = $selectedDistrictsData
					.sort((a, b) => a.name.localeCompare(b.name))
					.map(district => district.GEOID)
				selectedDistricts.set(sortedDistricts)
            	showMenu = false;
			} 
		},
		// { name: 'Filter by disability', action: () => console.log('Filter disability') },
		{ 
			name: 'Sort by size',
			action: () => {
				let sortedDistricts = $selectedDistrictsData
					.sort((a, b) => b.students - a.students)
					.map(district => district.GEOID)
				selectedDistricts.set(sortedDistricts)
				showMenu = false;
			}  
		},
		{
			name: 'Filter by size', 
			action: filterBySize
		},
    ];

	let showMenu = false;

	function clickOutside(element, callbackFunction) {
		function onClick(event) {
			if (!element.contains(event.target)) {
				callbackFunction();
			}
		}
		
		document.body.addEventListener('click', onClick);
		
		return {
			update(newCallbackFunction) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener('click', onClick);
			}
		}
	}

	// create array of objects with id and name value for each item in the data array
	let districtNames = $districtsData.map((district) => {
		return { value: district.GEOID, label: district.name };
	});

	function filterBySize() {
		let filteredDistricts = $selectedDistrictsData
			.filter(district => district.students >= minSize && district.students <= maxSize)
			.map(district => district.GEOID);
		
		selectedDistricts.set(filteredDistricts);
		console.log($selectedDistricts)
	}

	// set state for filter option
	let minSize = 0;
	let maxSize = 9000
	let values = [minSize, maxSize]

	// color scale for background average lines
	let lineColorScale = scaleOrdinal()
		.domain([0, 1, 2])
		.range([colors[4], colors[5], colors[6]]);
</script>

<section>
	<h1 class="headline text-width">
		Inclusion in the state of Oregon
	</h1>

	<p class="text-width">Oregon ranks 11th out of 50 states for how included students with disabilities are in its schools</p>

	<p class="text-width">Overall, the state's rates of inclusion can be broken down as follows:</p>

	<div class="state text-width">
		<StateLegend stateData={stateData} />
	</div>

	<p class="text-width" style="margin-bottom:3rem;">These rates of inclusion are just the statewide average, however. Districts within the state vary widely. To see the inclusion rates of individual districts, select below</p>

	<StateMap data={$districtsData} />
	
	<div class="search text-width">
		<p class="search-description">
			find a school district
		</p>

		<div class="search-container">
			<Svelecte 
				options={districtNames} 
				bind:value={$selectedDistricts} 
				multiple={true} 
				collapseSelection={$selectedDistricts.length < 6 ? false : true}
				placeholder={"find a school district"}
			/>

			<div class="menu-container">
				<button 
					on:click={(event) => {
						showMenu = true
						event.stopPropagation()
					}}
					class="icon-btn"
					style="visibility: {showMenu ? 'hidden' : 'visible'}"
				>
					<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
						<circle cx="6" cy="12" r="2" />
						<circle cx="14" cy="12" r="2" />
						<circle cx="22" cy="12" r="2" />
					</svg>
				</button>
				{#if showMenu}
					<ul class="menu" use:clickOutside={() => {
						showMenu = false
					}}>
						{#each actions as action (action.name)}
							{#if action.name === 'Filter by size'}
								<li>
									Filter by size
									<RangeSlider 
										bind:values
										range={true} 
										min={0} 
										max={10000} 
										float={true} 
										first={true}
										last={true}
										id="range-slider"
										aria-labels={["Minimum number of students", "Maximum number of students"]}
										on:stop={() => {
											minSize = values[0]
											maxSize = values[1]

											filterBySize()
										}}
									/>
								</li>
							{:else}
								<li>
									<button on:click={action.action}>
									{action.name}
								</li>
							{/if}
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>

	<div class="striped-background text-width">
		<!-- SVG for the striped pattern -- see if there's a way to move each stripe back by 2.2px * index -->
		<svg bind:this={backgroundSVG} width="100%" height="100%">
			{#each stateAvgLines as linePos, index (index)}
				<line 
					x1="{linePos * 100}%" 
					x2="{linePos * 100}%" 
					y1="30px" 
					y2="100%" 
					stroke={lineColorScale(index)} 
					stroke-width="2" 
					stroke-dasharray="2, 2"
				/>
			{/each}
		</svg>
	
		<StateAvg stateData={stateData} />
	
		<div class="comparison-bars">
			{#each $selectedDistrictsData as district}
				{#if district.name}
					<DistrictBar districtData={district} />
				{/if}
			{/each}
		</div>
	</div>
  
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
	align-items: center;
  }

  h1 {
    width: 100%;
	padding-top: 2rem;
	font-size: 3rem;
	line-height: 3.5rem;
	text-align: center;
  }

  p {
	font-size: 1.1rem;
  }

  .state {
	width: 100%;
	margin-bottom: 1rem;
  }

  .text-width {
	max-width: 36rem;
	width: 100%;
  }

  .search p {
	margin-top: 0;
	margin-bottom: 0.6rem;
  }

  .search-description {
	color: var(--dark-gray);
	font-size: 0.95rem;
	letter-spacing: 0.02rem;
	font-weight: 600;
  }

  .search {
	width: 100%;
	padding: 2rem 0;
  }

  .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
		fill: var(--dark-gray);
    }

	.search-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.menu-container {
		position: relative; /* to position the dropdown menu */
		z-index: 10;
		margin-left: 1rem;
	}

  .menu {
        position: absolute;
		right: 0;
        background: white;
        list-style: none;
        margin: 0;
		padding-left: 0;
		min-width: 200px;
		border-radius: 5px;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .menu button {
		width: 100%;
		border: none;
		background: none;
		text-align: left;
		padding: 10px;
		cursor: pointer;
  }
    
  .menu li {
        padding: 10px;
        cursor: pointer;
  }
    
  .menu li:hover {
        background: #eee;
  }

    .striped-background {
		position: relative;
	}

	.striped-background > svg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0; /* This ensures SVG stays behind other content */
	}

	/* Ensure other children of .striped-background stay above the SVG */
	.striped-background > * {
		position: relative;
		z-index: 1;
	}


  .comparison-bars {
	margin-top: 2.4rem;
  }
</style>
