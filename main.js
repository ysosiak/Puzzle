function moveBlock(button){
	block = button.parentNode;

	block_row = block.getAttribute('data-row-id');
	block_column = block.getAttribute('data-column-id');
	// console.log(block_row + '_' + block_column)

	block_index = (parseInt(block_row) - 1) * size + parseInt(block_column) - 1;
	// console.log(data[block_index]);

	emptyCell = document.getElementsByClassName('empty')[0];
	emptyCell_row = emptyCell.getAttribute('data-row-id');
	emptyCell_column = emptyCell.getAttribute('data-column-id');
	// console.log(emptyCell_row + '_' + emptyCell_column)

	empty_index = (parseInt(emptyCell_row) - 1) * size + parseInt(emptyCell_column) - 1;
	// console.log(data[empty_index]);

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
		tmp = data[block_index];
		data[block_index] = data[empty_index];
		data[empty_index] = tmp;
		saveData();

		window.localStorage.setItem('moves', ++moves);
		updateMoves();

		emptyCell.appendChild(button);
		button.className = '';
		button.classList.add(direction);
		emptyCell.classList.remove('empty');
		block.classList.add('empty');

		// console.log(JSON.stringify(data))
		// sorted = data;
		var sorted = data.slice();
		sorted.sort(function(a,b){return a-b});
		sorted.splice(0,1);
		sorted.push(null);
		console.log(sorted);
		if (JSON.stringify(data) == JSON.stringify(sorted)){
			alert('Success')
		}
		// console.log(JSON.stringify())
	}

}

/*function replaceBlock(e){
	e.target.className = '';
	// console.log(e)
	if (e.type == 'webkitAnimationEnd'){
		// button = e.target;
		// td = button.parentNode;
		// emptyCell = document.getElementsByClassName('empty')[0];
		// emptyCell.appendChild(button);
		// emptyCell.classList.remove('empty');
		// td.classList.add('empty');
	}
}
*/
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
				// button.setAttribute('draggable', true);
				button.innerHTML = blocks[i][j];
				button.addEventListener('click', function(e){
					moveBlock(this)
				})

				button.addEventListener('drag', function(e){
					// console.log('drag')
				})

				button.addEventListener('webkitAnimationEnd', function(e){
					// e.target.className = '';
					e.target.classList.remove(e.animationName);
				}, false);

				td.appendChild(button);
			}

			tr.appendChild(td);
		};

		table.appendChild(tr);
	};
}

var data = [],
	size = 4,
	moves = 0;
function refresh(e){
	sizeElement = document.getElementById('size');
	size = parseInt(sizeElement.value);
	if (size < 3 || isNaN(size))
		size = 4;
	window.localStorage.setItem('size', size)

	data = [];
	for (var i = null; i < size * size; i++) {
		data.push(i)
	};

	data.sort(function() {
	  return .5 - Math.random();
	});

	moves = 0;
	window.localStorage.setItem('moves', moves);

	updateMoves();
	saveData();
	renderPuzzle();
}

/*function changeSize(e){
	size = parseInt(e.target.value);
	if (size < 3 || isNaN(size))
		size = 4;
	window.localStorage.setItem('size', size)

}
*/
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
		block = document.getElementById('r' + row + 'c' + column);
		if (block)
			moveBlock(block.childNodes[0]);
	}
}

function updateMoves(){
	document.getElementById('moves').innerHTML = moves;
}

window.onload = function(){
	data = window.localStorage.getItem('data');
	size = window.localStorage.getItem('size');
	moves = window.localStorage.getItem('moves');

	if (!size)
		size = 4;
	if (!data){
		refresh();
		moves = 0;
	}else{
		if (isNaN(moves))
			moves = 0;
		data = JSON.parse(data);
		renderPuzzle();
	}

	updateMoves();

	document.getElementById('refresh').addEventListener('click', function(){
		if (confirm("Are you sure?"))
			refresh();
	});
	// document.getElementById('size').addEventListener('input', changeSize);
	document.addEventListener('keyup', keyboardControl);

	/*emptyCell = document.getElementsByClassName('empty')[0]
	emptyCell.addEventListener('drop', function(ev) {
	    ev.preventDefault();
	})
	emptyCell.addEventListener('dragover', function(e){
		e.preventDefault();
	})*/

	sizeElement = document.getElementById('size');
	sizeElement.value = window.localStorage.getItem('size') || 4;
}
