<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<script>
  import { getData } from "../data/processData.js";
  import { selectedDistricts, selectedDistrictsData } from "../stores/stores.js"
  import Svelecte from "svelecte";
  import StateBar from "../components/StateBar.svelte";
  import DistrictBar from "../components/DistrictBar.svelte";
  import StateMap from "../components/StateMap.svelte";

  let data = getData()

  let numberDistricts = data.length

	// Define the sort and filter actions
    let actions = [
        { 
			name: `Select all (${numberDistricts})`, 
			action: () => {
				selectedDistricts.set(
					data
						.filter(district => district.GEOID !== undefined && district.GEOID !== null)
						.map(district => district.GEOID)
				);
				showMenu = false;
				// this needs to map just the GEOIDs to selectedDistricts, not all their data
			} 
		},
        { name: 'Sort by most inclusive', action: () => console.log('Sort most inclusive') },
        { name: 'Sort by least inclusive', action: () => console.log('Sort least inclusive') },
		{ 
			name: 'Sort by name', 
			action: () => {
				sortName.set((a, b) => a.name.localeCompare(b.name)); // change
            	showMenu = false;
			} 
		},
		// { name: 'Filter by disability', action: () => console.log('Filter disability') },
		{ name: 'Sort by size', action: () => console.log('Sort # students') },
		{ name: 'Filter by size', action: () => console.log('Filter # students') },
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
	let districtNames = data.map((district) => {
		return { value: district.GEOID, label: district.name };
	});

</script>

<section>
  <h1>
    How inclusive are Oregon's school districts for students with disabilities?
  </h1>

  <div class="state">
	<StateBar stateData={data.find(row => row.GEOID === "999999")} />
  </div>

  <StateMap data={data} />

  <div class="striped-background">
	<!-- <svg width="0" height="0" style="position:absolute;">
		<defs>
			<pattern id="striped-pattern" width="80" height="40" patternUnits="userSpaceOnUse">
				<line x1="0" y1="0" x2="0" y2="40" style="stroke:#333; stroke-width:10" />
			</pattern>			
		</defs>
	</svg> -->
	<!-- <svg width="500" height="500">
		<rect width="500" height="500" fill="url(#striped-pattern)"/>
	</svg> -->
	
	  <div class="search">
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
							<li>
								<button on:click={action.action}>
								{action.name}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	
	  <div class="comparison-bars">
		<!-- <div class="legend">
			<div class="box teal">
				More inclusive <span class="arrow">&#8594;</span>
			  </div>
			  <div class="box dark-pink">
				<span class="arrow">&#8592;</span> Less inclusive
			  </div>
		</div> -->
		
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
  }

  h1 {
    width: 100%;
	padding-bottom: 1rem;
	line-height: 3rem;
  }

  .striped-background {
    /* background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40"><line x1="0" y1="0" x2="0" y2="40" style="stroke:%23f2f2f2; stroke-width:10" /></svg>'); */
	background: url('../styles/striped-pattern.svg')
	/* height: 800px;
	width: 100%; */
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

    .search-description {
        display: flex;
        align-items: center;
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

  .legend {
	display: flex;
	justify-content: space-between;
	margin: 2rem 0;
  }

  .box {
	padding: 1px 8px; 
	color: white; 
	font-size: 0.75rem; 
	text-transform: uppercase;
	font-weight: 600;
	letter-spacing: 0.06rem;
	text-align: center;
  }

  .teal {
	background-color: var(--inclusive-color); 
  }

  .dark-pink {
	background-color: var(--separate-color); 
  }

  .arrow {
	font-size: 1rem;
  }

  .comparison-bars {
	margin-top: 2.4rem;
  }
</style>
