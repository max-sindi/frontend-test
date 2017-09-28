'use strict';
	document.addEventListener("DOMContentLoaded", function() {

		// popup module start

		// clickable items
		const items = document.querySelectorAll('.item-img-wrap');
		
		for(let i = 0; i < items.length; i++) {
			items[i].addEventListener('click', popupHandle);
		}

		//here will be active popup item
		let currentTemplate;
		let thumb = window.innerWidth - document.documentElement.clientWidth;
		let addedElem;

		function popupHandle(e) {
			let self = this;

			// create popup element and render it
			function render(that) {

				let elem = new PopupItem(that);
				document.body.appendChild(elem.dom);

				addedElem = document.querySelector('.popup-wrap');

				document.body.style.overflowY = 'hidden';
				document.body.style.paddingRight = `${thumb}px`;
				
				// add event listener for close 
				addedElem.addEventListener('click', closePopup);

				function closePopup(e) {
					// if <close-button /> or outer wrapper => remove popup item
					if(e.target.closest('.popup-close-btn') || e.target === this) {
						removePopup();
					}
				}

				// add event listener for toggling size
				let sizeList = addedElem.querySelector('.popup-size-list');
				sizeList.addEventListener('click', changeSize);
				
				// here will be active-size element

				let activeSize = document.querySelector('.popup-size-list-item.active');
				function changeSize(e) {
					let item = e.target.closest('.popup-size-list-item');
					let that = this;

					if( checkItem() ) {
						doChange();
					}

					// verify <li> && non-active
					function checkItem() {
						return (item &&
										item !== that &&
										!item.classList.contains('active'));
					}

					// change size 
					function doChange() {
						item.classList.add('active');
						activeSize.classList.remove('active');
						activeSize = item;
					} 
				}


				// var scroll = window.pageYOffset;
				// document.body.style.overflowY = "hidden";
				// document.body.scrollTop(scroll);
				// debugger
				// return addedElem;
			}

			let popup = render(this);
			// => vertical-align = middle 
			let windowHeight = document.documentElement.clientHeight;
			let windowWidth = document.documentElement.clientWidth;

			heightChange();

			// change height => change padding
			window.onresize = function() {

				let currentHeight = document.documentElement.clientHeight;
				let currentWidth = document.documentElement.clientWidth;
				
				if(currentWidth !== windowWidth) {
					widthChanged();
					windowWidth = currentWidth;
				}	else if (currentHeight !== windowHeight) {
					heightChange();
					windowHeight = currentHeight;
				} 
			};
	 	
	 		function widthChanged() {
	 			if( chooseTemplate() !== currentTemplate) {
	 				changePopup();
					heightChange();
	 			}
	 		}
	 		function changePopup() {
	 			removePopup();
	 			popup = render(self);
	 		}
			function heightChange() {
				addedElem.style.padding = calcPadding(addedElem);
			}

			function calcPadding(elem) {
				let elemChild  = elem.children[0];
				let elemHeight = elemChild.offsetHeight;

				if(elemHeight >= windowHeight) return 0;

				let result = (windowHeight - elemHeight) / 2;
				console.log('changed');
				return `${result}px 0`; 
			}
		}

		// constructor popup element 
		function PopupItem(elem) {

			let tempName = chooseTemplate();
			currentTemplate = tempName;
			let handler = elem;

			// get correspondive html template
			let temp = document.getElementById(tempName);

			let tempClone = document.importNode(temp.content, true);

			
			fillDom(tempClone, 'title', 'id', 'price', 'detail', 'img-cont');
			this.dom = tempClone;
			this.screen = tempName;


			function fillDom(elem, ...rest) {
				let itemS = rest;
				let len = itemS.length;

				for(let i = 0; i < len; i++) {
					let item = itemS[i];
					let parent = handler.parentElement;
					const queryItem = elem.querySelector(`.popup-${item}`);
					queryItem.innerHTML = parent.querySelector(`.item-${item}`).innerHTML;
				}
			}
		}

		
	  /* define which html template use accordingly to current window width; 
		   returns the string => id */ 
	  function chooseTemplate() {
			let width = document.documentElement.clientWidth;
			let tempName;

			if(width >= 960) {
				tempName = 'template-large';
			} else if (width < 960 && width > 720) {
				tempName = 'template-middle';
			} else {
				tempName = 'template-small';
			}

			return tempName;
		}

		function removePopup() {
			if(!addedElem) return;

			addedElem.parentElement.removeChild(addedElem);
			addedElem = null;
			document.body.style.overflowY = "";
			document.body.style.paddingRight = '';
		}

		var autoclick = document.querySelector('.item-img-wrap');
		autoclick.click();

		// function itemsHandler (e) {
		// 	console.log('new module');
		// 	let body = document.body;
		// 	let scroll =  window.pageYOffset;
		// 	document.body.style.overflow = "hidden";

		// 	let wth = document.documentElement.clientWidth;
		// 	let temp;

		// 	if (wth >= 960) {
		// 		temp = document.getElementById('template-large');
		// 	} else if (wth < 960 && wth > 720) {
		// 		temp = document.getElementById('template-middle');
		// 	} else {
		// 		temp = document.getElementById('template-small');
		// 	}

		// 	let cont = temp.content;
		// 	let parent = this.parentNode;

		// 	const img = cont.querySelector('.popup-item-img');
		// 	const urlImg = parent.querySelector('.main-item-img').src;
		// 	img.src = urlImg;

		// 	function fillContent(args) {
		// 		let l = arguments.length;
		// 		for(let i = 0; i < l; i++) {
		// 			const item = cont.querySelector(`.popup-${arguments[i]}`);
		// 			item.innerHTML = parent.querySelector(`.item-${arguments[i]}`).innerHTML;
		// 		}
		// 	};

		// 	fillContent('title', 'id', 'price', 'detail');

		// 	const tempClone = document.importNode(temp.content, true);
		// 	document.body.appendChild(tempClone);
		// 	addedElem = document.querySelector('.popup-wrap');
			
			
		// 	const sizeArr = addedElem.querySelectorAll('.popup-size-list-item');
		// 	for(let i = 0; i < sizeArr.length; i++) {
		// 		sizeArr[i].addEventListener('click', chooseSize);
		// 	}
			
		// 	var currentActive = document.querySelector('.popup-size-list-item.active');
		// 	function chooseSize(e) {
		// 		if(this.classList.contains('active')) return;
		// 		this.classList.add('active');
		// 		currentActive.classList.remove('active');
		// 		currentActive = this;
		// 	}

		// 	function deleteNode() {
		// 		addedElem.parentElement.removeChild(addedElem);
		// 	}

		// 	const btn = addedElem.querySelector('.popup-close-btn');
			
		// 	addedElem.addEventListener('click', closePopup);
		// 	function closePopup(e) {
				
		// 		if(e.target === this 
		// 			 || e.target === btn 
		// 			 || e.target.parentElement === btn) 
		// 		{
		// 					deleteNode();
		// 					document.body.style.overflow = "";
		// 					window.scrollBy(0, scroll);
		// 		}
		// 	}

		// 	let that = this;
		// 	let currentMode = temp.dataset.media;
			
		// 	window.onresize = funcResize;
			
		// 	function funcResize(arg) {
		// 		let width = document.documentElement.clientWidth;
		// 		let newMode = findNewMode(width);
		// 		if(newMode !== currentMode) {
		// 			btn.click();
		// 			that.click();
		// 			currentMode = newMode; 
		// 		}

		// 		function findNewMode(width) {
		// 			let newMode;

		// 			if(width >= 960) {
		// 				newMode = 'large';
		// 			} else if (width < 960 && width > 720 ) {
		// 				newMode = 'middle';
		// 			} else {
		// 				newMode = 'small';
		// 			};

		// 			return newMode;
		// 		};

		// 	}
		// }
});

// function A() {this.name = 123, this.age = 24};

// function B() {};
// B.prototype = new A();
// var v = new B();


// var a = new B();

// for (var key in a) {
// 	console.dir(key);
// }

// function inherit(F) {
// 	var q = {};
// 	q.__proto__ = new F();
// 	return q;
// }
// var f = inherit(A);

function Menu(options) {
	this.options = Object.create(options);

 }
 let options = {
 	width: 300,
 	height: 100,
 }
 var menu = new Menu(options);