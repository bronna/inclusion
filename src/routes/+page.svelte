<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<script>
   import { getData } from "../data/processData.js";
  import { hideSmallDistricts, selectedDistricts, districtsData, selectedDistrictsData } from "../stores/stores.js"
  import { colors } from '../styles/colors';
  import Svelecte from "svelecte";
  import RangeSlider from "svelte-range-slider-pips"
  import StateLegend from "../components/StateLegend.svelte";
  import DistrictData from "../components/DistrictData.svelte";
  import StateMap from "../components/StateMap.svelte";
  import StateCompare from "../components/StateCompare.svelte";
  import TableOfDistricts from "../components/TableOfDistricts.svelte";
  import DistrictCards from "../components/DistrictCards.svelte";
  import { scaleOrdinal } from "d3";

  let data = getData()

  let stateData = data.find(row => row.properties.GEOID === "999999")
  let stateCompareLines = [
	stateData.properties["LRE Students >80%"], 
	stateData.properties["LRE Students >80%"] + stateData.properties["LRE Students >40% <80%"], 
	stateData.properties["LRE Students >80%"] + stateData.properties["LRE Students >40% <80%"] + stateData.properties["LRE Students <40%"]
  ]//.map(value => parseFloat(value.toFixed(2)));

  let numberDistricts = $districtsData.length

  let maxStudents = Math.max(
	...$districtsData
		.filter(district => district.properties.GEOID !=="999999")
  		.map(district => district.properties["Total Student Count"])
		.filter(n => typeof n === 'number')
  );
  let minStudents = Math.min(
	...$districtsData
		.filter(district => district.properties.GEOID !=="999999")
		.map(district => district.properties["Total Student Count"])
		.filter(n => typeof n === 'number')
  );

  let backgroundSVG

  function deepClone(arr) {
	return JSON.parse(JSON.stringify(arr))
  }

	// Define the sort and filter actions
    let actions = [
        { 
			name: `Select all (${numberDistricts})`, 
			action: () => {
				selectedDistricts.set(
					[...$districtsData]
						.filter(district => district.properties.GEOID !== undefined && district.properties["Institution Name"])
						.map(district => district.properties.GEOID)
				);
				minSize = minStudents;
				maxSize = maxStudents
				values = [minSize, maxSize]
				showMenu = false;
			} 
		},
		{ 
			name: 'Sort by size',
			action: () => {
				let sortedDistricts = deepClone($selectedDistrictsData)
					.sort((a, b) => b.properties["Total Student Count"] - a.properties["Total Student Count"])
					.map(district => district.properties.GEOID)
				selectedDistricts.set(sortedDistricts)
				showMenu = false;
			}  
		},
		{
			name: 'Filter by size', 
			action: filterBySize
		},
        { 
			name: 'Sort by most inclusive', 
			action: () => {
				let sortedDistricts = deepClone($selectedDistrictsData)
					.filter(district => district.properties.GEOID !== undefined && district.properties.GEOID !== '999999')
					// .filter(district => district.properties.weighted_inclusion !== undefined && district.properties.weighted_inclusion !== null)
					.sort((a, b) => b.properties.weighted_inclusion - a.properties.weighted_inclusion)
					.map(district => district.properties.GEOID)
				selectedDistricts.set(sortedDistricts)
				showMenu = false;
			} 
		},
        { 
			name: 'Sort by least inclusive', 
			action: () => {
				let sortedDistricts = deepClone($selectedDistrictsData)
					.sort((a, b) => a.properties.weighted_inclusion - b.properties.weighted_inclusion)
					.map(district => district.properties.GEOID)
				selectedDistricts.set(sortedDistricts)
				showMenu = false;
			} 
		},
		{ 
			name: 'Sort by name', 
			action: () => {
				let sortedDistricts = deepClone($selectedDistrictsData)
					.sort((a, b) => a.properties["Institution Name"].localeCompare(b.properties["Institution Name"]))
					.map(district => district.properties.GEOID)
				selectedDistricts.set(sortedDistricts)
            	showMenu = false;
			} 
		},
		// { name: 'Filter by disability', action: () => console.log('Filter disability') },
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
		return { value: district.properties.GEOID, label: district.properties["Institution Name"] };
	});

	function filterBySize() {
		//let filteredDistricts = [...$districtsData]
		let filteredDistricts = deepClone($districtsData)
			.filter(district => district.properties["Total Student Count"] >= minSize && district.properties["Total Student Count"] <= maxSize)
			.map(district => district.properties.GEOID);
		
		selectedDistricts.set(filteredDistricts);
	}

	// set state for filter option
	let minSize = 0;
	let maxSize = 9000
	let values = [minSize, maxSize]

	// color scale for background average lines
	let lineColorScale = scaleOrdinal()
		.domain([0, 1, 2])
		.range([colors[0], colors[1], colors[2]]);
</script>

<section id="scores">
	<h1 class="headline text-width">
		How inclusive are Oregon's school districts?
	</h1>

	<p class="text-width" style="margin-bottom:3rem;">
		Have you ever wondered how included students with disabilities are in your local schools? To see districts' scores for inclusion, on a scale of 1 to 10, select them on the map, or in the dropdown, below.
	</p>

	<label class="rough-filter">
		<input type="checkbox" bind:checked={$hideSmallDistricts} />
		Hide small districts
	</label>

	<StateMap data={$districtsData} />
	
	<div class="search text-width">
		<p class="search-description text-width">
			Find a school district
		</p>

		<div class="search-container text-width">
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
									<span style="margin:0; padding:0.5rem 1rem;">Filter by size</span>
									<RangeSlider 
										bind:values
										range={true} 
										min={minStudents} 
										max={maxStudents} 
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
									<button on:click={action.action} style="margin:0; padding:0.5rem 1rem;">
									{action.name}
								</li>
							{/if}
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>

	<!-- <DistrictCards /> -->

	<TableOfDistricts />

	<!-- <div class="striped-background text-width">
		<svg bind:this={backgroundSVG} width="100%" height="100%">
			{#each stateCompareLines as linePos, index (index)}
				<line 
					x1="{linePos}%" 
					x2="{linePos}%" 
					y1="50px" 
					y2="100%" 
					stroke={lineColorScale(index)} 
					stroke-width="2" 
					stroke-dasharray="2, 4"
				/>
			{/each}
		</svg>
	
		<StateCompare stateData={stateData} />
	
		<div class="comparison-bars">
			{#each $selectedDistrictsData as district (district.properties.GEOID)}
				{#if district.properties["Institution Name"] && district.properties.GEOID !== null}
					<DistrictData districtData={district} />
				{/if}
			{/each}
		</div>
	</div> -->
</section>

<section id="breakdown">
	<p class="text-width">
		Inclusion scores are based on the rates published annually by school districts. Inclusion rates can be broken down as follows, using the entire state of Oregon as an example:
	</p>

	<div class="state text-width">
		<StateLegend stateData={stateData} />
	</div>

	<aside class="aside text-width">
		<div class="inner-content">
			<!-- <Icon data="{comment}" scale="4" class="comment-icon" /> -->
			<svg 
				xmlns="http://www.w3.org/2000/svg" 
				x="0px" 
				y="0px" 
				width="96" 
				height="96" 
				viewBox="0 0 32 32"
				class="comment-icon"
			>
				<path 
					d="M 16 3 C 12.210938 3 8.765625 4.113281 6.21875 5.976563 C 3.667969 7.835938 2 10.507813 2 13.5 C 2 17.128906 4.472656 20.199219 8 22.050781 L 8 29 L 14.746094 23.9375 C 15.15625 23.96875 15.570313 24 16 24 C 19.789063 24 23.234375 22.886719 25.78125 21.027344 C 28.332031 19.164063 30 16.492188 30 13.5 C 30 10.507813 28.332031 7.835938 25.78125 5.976563 C 23.234375 4.113281 19.789063 3 16 3 Z M 16 5 C 19.390625 5 22.445313 6.015625 24.601563 7.589844 C 26.757813 9.164063 28 11.246094 28 13.5 C 28 15.753906 26.757813 17.835938 24.601563 19.410156 C 22.445313 20.984375 19.390625 22 16 22 C 15.507813 22 15.015625 21.972656 14.523438 21.925781 L 14.140625 21.894531 L 10 25 L 10 20.859375 L 9.421875 20.59375 C 6.070313 19.019531 4 16.386719 4 13.5 C 4 11.246094 5.242188 9.164063 7.398438 7.589844 C 9.554688 6.015625 12.609375 5 16 5 Z">
				</path>
			</svg>
			<p><strong>IEP</strong>s, or <strong>I</strong>ndividualized <strong>E</strong>ducation <strong>P</strong>lans, are documents put together by teams of teachers, therapists, and families for students with disabilities. They determine what supports the student will receive at school to help them work towards their educational goals</p>
		</div>
	</aside>

	<hr class="text-width" />

	<div class="data-source text-width">
		<p>Data is from the 2021-22 school year and comes from the <a href="https://www.ode.state.or.us/data/reportcard/media.aspx" target="_blank">Oregon Department of Education</a>. Geography data comes from the <a href="https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2022&layergroup=School+Districts" target="_blank">US Census</a></p>
		<p>Methodology can be found on <a href="https://github.com/bronna/inclusion/tree/main/src/data" target="_blank">Github</a></p>
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
	line-height: 1.6rem;
  }

  aside {
	background-color: var(--light-gray);
	margin: 1rem 0;
  }

  aside .inner-content {
	display: flex;
	align-items: top;
    padding: 2% 7%;
  }

  .comment-icon {
	margin-right: 10px;
	width: 60px;
	min-width: 30px;
	height: 60px;
	transform: translateY(4px);
  }

  .inner-content svg {
    color: #fff;
    margin-right: 10px;
  }

  .state {
	width: 100%;
	margin-bottom: 1rem;
  }

  .text-width {
	max-width: 36rem;
	width: 100%;
	box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .text-width {
        padding: 0 1rem;
    }
  }

  .search p {
	margin-top: 0;
	margin-bottom: 0.6rem;
  }

  .search-description {
	color: var(--dark-gray);
	font-size: 1rem;
	letter-spacing: 0.01rem;
	font-weight: 600;
	/* text-transform: uppercase; */
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
		margin-top: 1rem;
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

  #scores {
	margin-bottom: 5rem;
  }

  #breakdown {
	background-color: var(--light-light-gray);
	padding-top: 3rem;
	padding-bottom: 4rem;
  }

  hr {
	margin-top: 3rem;
	border: 0;
    height: 1px;
    background-color: var(--dark-gray);
    box-shadow: none;
  }

  .data-source p {
	font-size: 1rem;
  }
</style>
