let todoItems = [];
let currentView = "all";
let isDark = false;

const btnAllItems = document.querySelector( "#allItems" );
const btnActiveItems = document.querySelector( "#activeItems" );
const btnCompletedItems = document.querySelector( "#completedItems" );
const btnClearCompletedItems = document.querySelector( "#clearCompletedItems" );
const iconTheme = document.querySelector( "#iconTheme" );

const toggleMode = () =>
{
	isDark = !isDark;
	document.body.classList.toggle( "dark-mode" );
	iconTheme.setAttribute( "src", isDark ? "/images/icon-sun.svg" : "/images/icon-moon.svg" );
	iconTheme.setAttribute( "alt", isDark ? "icon moon" : "icon sun" );
	document.querySelector( ".bg-image" ).style.backgroundImage = `url(${ isDark ? 'images/bg-desktop-dark.jpg' : 'images/bg-desktop-light.jpg' })`;
};

const onAllItems = () =>
{
	console.log( "onAllItems" );
	currentView = "all";
	btnAllItems.classList.add( "active" );
	btnActiveItems.classList.remove( "active" );
	btnCompletedItems.classList.remove( "active" );
	document.querySelector( ".todo-lists" ).innerHTML = "";
	todoItems.forEach( ( item, index ) =>
	{
		createElementItem( item.id, item.text, item.completed );
	} );
};
const onActiveItems = () =>
{
	console.log( "onActiveItems" );
	currentView = "active";
	btnAllItems.classList.remove( "active" );
	btnActiveItems.classList.add( "active" );
	btnCompletedItems.classList.remove( "active" );
	const activeItems = todoItems.filter( ( item, index ) => !item.completed );
	console.log( activeItems );
	document.querySelector( ".todo-lists" ).innerHTML = "";

	activeItems.forEach( ( item, index ) =>
	{
		createElementItem( item.id, item.text, item.completed );
	} );
};
const onCompletedItems = () =>
{
	console.log( "onCompletedItems" );
	currentView = "complete";
	btnAllItems.classList.remove( "active" );
	btnActiveItems.classList.remove( "active" );
	btnCompletedItems.classList.add( "active" );
	const completedItems = todoItems.filter( ( item, index ) => item.completed );
	console.log( completedItems );
	document.querySelector( ".todo-lists" ).innerHTML = "";

	completedItems.forEach( ( item, index ) =>
	{
		createElementItem( item.id, item.text, item.completed );
	} );
};
const onClearCompletedItems = () =>
{
	console.log( "onClearCompletedItems" );
	currentView = "all";
	btnAllItems.classList.add( "active" );
	btnActiveItems.classList.remove( "active" );
	btnCompletedItems.classList.remove( "active" );
	todoItems = [];
	document.querySelector( ".todo-lists" ).innerHTML = "";
	onItemCountChange();
};

const onChangeView = () =>
{
	switch ( currentView )
	{
		case "all":
			onAllItems();
			break;
		case "active":
			onActiveItems();
			break;
		case "complete":
			onCompletedItems();
			break;
		default:
			onAllItems();
			break;
	}
};

const init = () =>
{
	btnAllItems.classList.add( "active" );
	btnAllItems.addEventListener( "click", onAllItems );
	btnActiveItems.addEventListener( "click", onActiveItems );
	btnCompletedItems.addEventListener( "click", onCompletedItems );
	btnClearCompletedItems.addEventListener( "click", onClearCompletedItems );

	iconTheme.addEventListener( "click", toggleMode );

	document.querySelector( "#itemCount" ).innerHTML = "0 item";
	const textInput = document.querySelector( ".text-input" );
	textInput.addEventListener( "keypress", function ( event )
	{
		if ( event.key === "Enter" )
		{
			event.preventDefault();

			const previousCheckbox = event.target.previousElementSibling;
			console.log( previousCheckbox.checked );

			const uniqueId = Date.now();
			todoItems.push( {
				id: uniqueId,
				text: textInput.value,
				completed: previousCheckbox.checked,
			} );

			createElementItem( uniqueId, textInput.value, previousCheckbox.checked );

			textInput.value = "";
			previousCheckbox.checked = false;
		}

		onChangeView();
	} );
};

const onItemCountChange = () =>
{
	// const todoLists = document.querySelectorAll( ".todo-lists li" );
	// document.querySelector( "#itemCount" ).innerHTML = `${ todoLists.length } ${ todoLists.length > 1 ? 'items' : 'item' } ${ todoLists.length > 0 ? 'left' : '' }`;
	const activeItems = todoItems.filter( ( item, index ) => !item.completed );
	document.querySelector( "#itemCount" ).innerHTML = `${ activeItems.length } ${ activeItems.length > 1 ? 'items' : 'item' } ${ activeItems.length > 0 ? 'left' : '' }`;
};

const onItemCompleted = ( event ) =>
{
	const item = event.target.parentNode;
	const index = todoItems.findIndex( it => Number( it.id ) === Number( item.getAttribute( "data-id" ) ) );
	console.log( index );
	if ( index > -1 )
	{

		if ( event.currentTarget.checked )
		{
			todoItems[ index ].completed = true;
			item.setAttribute( "data-completed", true );
		} else
		{
			todoItems[ index ].completed = false;
			item.setAttribute( "data-completed", false );
		}
	}

	onChangeView();
	onItemCountChange();

	console.log( todoItems );
};

const createElementItem = ( uniqueId, text, completed ) =>
{
	// Create a new element - li
	const item = document.createElement( "li" );
	item.classList.add( "sortable" );
	item.setAttribute( "data-id", uniqueId );
	item.setAttribute( "data-completed", completed );

	// Create a new element - input
	const checkboxEl = document.createElement( "input" );
	checkboxEl.setAttribute( "type", "checkbox" );
	checkboxEl.checked = completed;
	checkboxEl.classList.add( "checkbox" );
	checkboxEl.addEventListener( 'change', onItemCompleted );
	item.appendChild( checkboxEl );

	// Create a new element - span
	const spanEl = document.createElement( "span" );
	spanEl.innerHTML = text;
	item.appendChild( spanEl );

	// Create a new element - img
	const imgEl = document.createElement( "img" );
	imgEl.setAttribute( "src", "/images/icon-cross.svg" );
	imgEl.setAttribute( "alt", "remove icon" );
	imgEl.classList.add( "remove" );
	imgEl.addEventListener( "click", removeElementItem );
	item.appendChild( imgEl );

	document.querySelector( ".todo-lists" ).appendChild( item );

	onItemCountChange();
};

// Remove an item from the todo lists
const removeElementItem = ( event ) =>
{
	const todoLists = event.target.parentNode.parentNode;
	const item = event.target.parentNode;
	const index = todoItems.findIndex( it => Number( it.id ) === Number( item.getAttribute( "data-id" ) ) );
	console.log( index );
	if ( index > -1 )
	{
		todoItems.splice( index, 1 );
		todoLists.removeChild( item );
	}

	console.log( todoItems );

	onItemCountChange();
};

init();
