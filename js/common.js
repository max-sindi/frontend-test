'use strict';
	document.addEventListener("DOMContentLoaded", function() {
		
		function trimLineThrough() {
			let items = document.querySelectorAll('.cancelled-price');

			for(let i = 0; i < items.length; i++) {
				let text = items[0].innerHTML;
				items[0].innerHTML = text.trim();
			}
			
		}

		trimLineThrough();


		// popup module

		// clickable items
		const items = document.querySelectorAll('.item-img-wrap');
		
		for(let i = 0; i < items.length; i++) {
			items[i].addEventListener('click', popupHandle);
		}

		//here will be active popup item
		let addedElem;
		
		let wrap = document.querySelector('.wrap');
		let thumb = document.documentElement.offsetWidth - wrap.clientWidth;

		let windowHeight = document.documentElement.clientHeight;
		let windowWidth = document.documentElement.clientWidth;
		
		let currentTemplate;
		function popupHandle(e) {
			let self = this;

			// create popup element and render it
			function render(that) {

				let elem = new PopupItem(that);
				document.body.appendChild(elem.dom);
				addedElem = document.querySelector('.popup-wrap');

				if(elem.screen === 'template-large') {
					addedElem.style.marginLeft = ` -${thumb}px `;
				}
				
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
			}

			let popup = render(this);

			// vertical-align = middle 
			heightChange();

			// change height => change padding
			window.onresize = function() {

				if(!addedElem) return;

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
		}
});