function moveBlock(button){
	block = button.parentNode;

	block_row = block.getAttribute('data-row-id');
	block_column = block.getAttribute('data-column-id');
	// console.log(block_row + '_' + block_column)


	emptyCell = document.getElementsByClassName('empty')[0];
	emptyCell_row = emptyCell.getAttribute('data-row-id');
	emptyCell_column = emptyCell.getAttribute('data-column-id');
	// console.log(emptyCell_row + '_' + emptyCell_column)

	direction = false;
	if (block_row == emptyCell_row){
		diff = block_column - emptyCell_column;
		if (diff == 1)
			direction = 'left';
		else if (diff == - 1)
			direction = 'right';

	}else if(block_column == emptyCell_column){
		diff = block_row - emptyCell_row;
		if (diff == 1)
			direction = 'up';
		else if (diff == -1)
			direction = 'down';
	}

	if (direction){
		button.classList.add(direction);
	}

}

function replaceBlock(e){
	if (e.propertyName == '-webkit-transform'){
		button = e.target;
		td = button.parentNode;
		emptyCell = document.getElementsByClassName('empty')[0];
		emptyCell.appendChild(button);
		button.className = '';
		emptyCell.classList.remove('empty');
		td.classList.add('empty');
	}
}

function renderPuzzle(){
	var table = document.getElementById("puzzle");
	table.innerHTML = '';
	rows = Math.round(Math.sqrt(data.length))
	blocks = [];
	for (var i = 0; i < data.length; i += rows) {
		blocks.push(data.slice(i, i + rows))
	};

	for (var i = 0; i < blocks.length; i++) {
		tr = document.createElement('tr');
		for (var j = 0; j < blocks[i].length; j++) {

			td = document.createElement('td');
			td.id = 'r' + (i + 1) + 'c' + (j + 1);
			td.setAttribute('data-row-id', i + 1);
			td.setAttribute('data-column-id', j + 1);
			if (!blocks[i][j])
				td.classList.add('empty');
			else{
				button = document.createElement('button');
				button.setAttribute('draggable', true);
				button.innerHTML = blocks[i][j];
				button.addEventListener('click', function(e){
					moveBlock(this)
				})

				button.addEventListener('drag', function(e){
					// console.log('drag')
				})
				

				button.addEventListener('webkitTransitionEnd', replaceBlock, false);

				td.appendChild(button);
			}

			tr.appendChild(td);
		};
		
		table.appendChild(tr);
	};
}

var data = [],
	size = 4;
function refresh(e){
	data = [];	
	for (var i = null; i < size * size; i++) {
		data.push(i)
	};

	console.log(data)
	data.sort(function() {
	  return .5 - Math.random();
	});

	saveData();

	renderPuzzle();
}

function changeSize(e){
	size = parseInt(e.target.value);
	if (size < 3 || isNaN(size))
		size = 4;
	window.localStorage.setItem('size', size)
	
}

function saveData(){
	window.localStorage.setItem('data', JSON.stringify(data));
}

function keyboardControl(e){
	code = e.keyCode;
	if (code == 37 || code == 38 || code == 39 || code == 40){
		emptyCell = document.getElementsByClassName('empty')[0];
		row = emptyCell.getAttribute('data-row-id');
		column = emptyCell.getAttribute('data-column-id');
		switch (code){
			case 37:
				column++;
				break
			case 38:
				row++;
				break
			case 39:
				column--;
				break
			case 40:
				row--;
				break
		}
		el = document.getElementById('r' + row + 'c' + column);
		if (el)
			moveBlock(el.childNodes[0]);
	}
}

window.onload = function(){
	data = window.localStorage.getItem('data');
	size = window.localStorage.getItem('size');
	if (!size)
		size = 4;
	if (!data)
		refresh();
	else{
		data = JSON.parse(data);
		renderPuzzle();
	}

	document.getElementById('refresh').addEventListener('click', refresh);
	document.getElementById('size').addEventListener('input', changeSize);
	document.addEventListener('keyup', keyboardControl);

	emptyCell = document.getElementsByClassName('empty')[0]
	emptyCell.addEventListener('drop', function(ev) {
	    ev.preventDefault();
	    // var test = ev.dataTransfer.getData("var");
	    // console.log(test)
	    // ev.target.appendChild(document.getElementById(data));
	})

	emptyCell.addEventListener('dragover', allowDrop)

	sizeElement = document.getElementById('size');
	sizeElement.value = window.localStorage.getItem('size') || 4;
}

function drop(e){
	console.log(e)
}

function allowDrop(e){
	 e.preventDefault();
}