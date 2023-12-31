<svelte:head>
  <title>Data on inclusion for students with disabilities</title>
  <meta name="Inclusion Data" content="Data on inclusion for students with disabilities" />
</svelte:head>

<script>
  import { getData } from "../data/processData.js";
  import { selectedDistricts, districtsData, selectedDistrictsData, hideSmallDistricts } from "../stores/stores.js"
  import Svelecte from "svelecte";
  import RangeSlider from "svelte-range-slider-pips"
  import StateMap from "../components/StateMap.svelte";
  import TableOfDistricts from "../components/TableOfDistricts.svelte";
  import Sources from "../components/Sources.svelte";

  let data = getData()

  let stateData = data.find(row => row.properties.GEOID === "999999")

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

  function deepClone(arr) {
	return JSON.parse(JSON.stringify(arr))
  }

	// create array of objects with id and name value for each item in the data array
	let districtNames = $districtsData.map((district) => {
		return { value: district.properties.GEOID, label: district.properties["Institution Name"] };
	});

	function toggleHideSmallDistricts() {
		hideSmallDistricts.update(value => !value)
	}

	function selectAllDistricts() {
		selectedDistricts.set(
			[...$districtsData]
				.filter(district => district.properties.GEOID !== undefined && district.properties["Institution Name"])
				.map(district => district.properties.GEOID)
		);
		minSize = minStudents;
		maxSize = maxStudents
		values = [minSize, maxSize]
	}

	function clearSelectedDistricts() {
		selectedDistricts.set([])
		minSize = 0;
		maxSize = 9000
		values = [minSize, maxSize]
	}

	function filterBySize() {
		let filteredDistricts = deepClone($districtsData)
			.filter(district => district.properties["Total Student Count"] >= minSize && district.properties["Total Student Count"] <= maxSize)
			.map(district => district.properties.GEOID);
		
		selectedDistricts.set(filteredDistricts);
	}

	// set state for filter option
	let minSize = 0;
	let maxSize = 9000
	let values = [minSize, maxSize]

</script>

<section id="scores">
	<h1 class="headline">
		How included are students with disabilities in your local schools?
	</h1>

	<p class="text-width">
		Around the country, advocates work to ensure that students with disabilities are included in their school communities. This involves having them in regular classrooms alongside their peers as much as possible, with any needed supports. Mounting research indicates that such inclusive educational environments benefit all students, whether they're disabled or not.
	</p>

	<p class="text-width">
		This tool allows you to explore the most recent inclusion data from school districts across your state. To begin, enter the name of districts below, or select them on the map.
	</p>

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
				closeAfterSelect={true}
			/>
		</div>
	</div>

	<StateMap data={$districtsData} />

	<div class="filters">
		<!-- Hide/show small districts -->
		<button on:click={toggleHideSmallDistricts} class="action-button" id="hide-button">
			{$hideSmallDistricts ? 'show small districts' : 'hide small districts'}
		</button>

		<!-- Select all -->
		<button on:click={selectAllDistricts} class="action-button" id="select-all-button">
			select all
		</button>

		<!-- Select none -->
		<button on:click={clearSelectedDistricts} class="action-button" id="select-none-button">
			select none
		</button>

		<!-- Filter by size action -->
		<!-- <div class="filter-size">
			<div class="slider-label">
				<span>Filter by # of</span>
				<span>students with IEPs:</span>
			</div>
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
		</div> -->
	</div>

	<TableOfDistricts />
</section>

<section id="breakdown">
	<aside class="text-width">
		<div class="inner-content">
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
			<p><strong>I</strong>ndividualized <strong>E</strong>ducation <strong>P</strong>lans (<strong>IEP</strong>s), are collaboratively crafted documents put together by a team of teachers, therapists, students, and families. Designed for students with disabilities, these plans outline what supports each student will need to assist achieving their educational goals</p>
		</div>
	</aside>

	<Sources />
</section>

<style>
  p {
	margin: 0.6rem 0;
  }

  h1 {
    width: 100%;
	max-width: 60rem;
	padding-top: 2rem;
	font-size: 3.7rem;
	line-height: 4.4rem;
	text-align: center;
	font-weight: 800;
	letter-spacing: 0.09rem;
	color: var(--color-text);
  }

  @media (max-width: 768px) {
    h1 {
        font-size: 2rem;
		line-height: 2.5rem;
		max-width: 96%;
    }
  }

  p {
	font-size: 1.1rem;
	line-height: 1.6rem;
  }

  aside {
	margin: 1rem 0;
  }

  aside .inner-content {
	display: flex;
	align-items: top;
  }

  .comment-icon {
	padding-right: 0.5rem;
	width: 60px;
	min-width: 30px;
	height: 60px;
	transform: translateY(-4px);
  }

  .inner-content svg {
    color: #fff;
    margin-right: 10px;
  }

  .state {
	width: 100%;
	margin-bottom: 1rem;
  }

  .search p {
	margin-top: 0;
	margin-bottom: 0.6rem;
  }

  .search-description {
	color: var(--color-text);
	font-size: 1.3rem;
	letter-spacing: 0.01rem;
	font-weight: 700;
	font-family: 'Bitter', serif;
  }

  .search {
	width: 100%;
	padding: 1.5rem 0 2rem 0;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 2rem 0 1rem 0;
    width: 100%;
    max-width: 72rem;
    gap: 1rem;
  }

  .filter-size {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* Space between label and slider */
  }

  .slider-label {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Ensure the slider has a minimum width */
	.rangeSlider {
		min-width: 150px; /* Adjust as needed */
		font-size: 2rem;
	}

  @media (max-width: 768px) {
	.filters {
		width: 100%;
	}

	.filter-size {
        width: 100%;
    }
  }

  .action-button {
    padding: 0.5rem 1rem;
    margin: 0;
    border-radius: 20px;
    cursor: pointer;
	color: white;
	transition: background-color 0.3s, border-color 0.3s;
  	border: 2px solid var(--dark-gray);
	font-size: 0.9rem;
	white-space: nowrap;
	font-weight: 700;
	letter-spacing: 0.02rem;
	opacity: 0.85;
  }

  #hide-button {
	background-color: var(--separate-color);
  }

  #select-all-button {
	background-color: var(--non-inclusive-color);
  }

  #select-none-button {
	background-color: var(--semi-inclusive-color);
  }

  .action-button:hover {
      background-color: gray;
  }

	.search-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

  #scores {
	margin-bottom: 5rem;
  }

  #breakdown {
	background-color: var(--light-light-gray);
	padding-top: 3rem;
  }
</style>
