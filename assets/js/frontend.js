const destUrlInput = document.getElementById("destUrl")
const lenPicker = document.querySelector(".lenPicker")
const plusminbtn = lenPicker.querySelectorAll("button")
const lenInput = lenPicker.querySelector("input")
const resCp = document.querySelector(".resCp")
const resInput = resCp.querySelector("input")
const page = document.querySelectorAll(".page")[1]
const restartBTNs = document.querySelectorAll('.new-one');
const LimitValues = [5, 1024]

for(button of restartBTNs){
	button.addEventListener('click',()=>{
		addRemClass(modal, "open", "rem");
		setTimeout(()=>addRemClass(page, "show", "rem"), 400);
	})
};

function checkLenInput(t){
	console.log('checking');
	if(lenInput.value < LimitValues[0] || lenInput.value > LimitValues[1] || lenInput.value % 1 !== 0){
		addRemClass(lenInput.parentElement, 'wrong', 'blink', 700);
		if(lenInput.value < LimitValues[0]) {
			addRemClass(plusminbtn[0], 'disabled', 'add')
			addRemClass(plusminbtn[1], 'disabled', 'rem')
			lenInput.value = LimitValues[0];
			showAlert('warning', 'Length can not be shorter than ' + LimitValues[0])
		}
		else if(lenInput.value > LimitValues[1]) {
			addRemClass(plusminbtn[0], 'disabled', 'rem')
			addRemClass(plusminbtn[1], 'disabled', 'add')
			lenInput.value = LimitValues[1];
			showAlert('warning', 'Length can not be longer than ' + LimitValues[1])
		}
		else {
			lenInput.value = parseInt(lenInput.value)
			showAlert('warning', 'Length must be whole number')
		}
		return false
	}
	else if(lenInput.value == LimitValues[0] && !t){
		if(plusminbtn[0].classList.contains('disabled')){
			addRemClass(lenInput.parentElement, 'wrong', 'blink', 700);
			showAlert('warning', 'Length can not be shorter than ' + LimitValues[0])
		}
		else addRemClass(plusminbtn[0], 'disabled', 'add')
		addRemClass(plusminbtn[1], 'disabled', 'rem')
	}
	else if(lenInput.value == LimitValues[1] && !t){
		if(plusminbtn[1].classList.contains('disabled')){
			addRemClass(lenInput.parentElement, 'wrong', 'blink', 700);
			showAlert('warning', 'Length can not be longer than ' + LimitValues[1])
		}
		else addRemClass(plusminbtn[1], 'disabled', 'add')
		addRemClass(plusminbtn[0], 'disabled', 'rem')
	}
	else{
		addRemClass(plusminbtn[0], 'disabled', 'rem')
		addRemClass(plusminbtn[1], 'disabled', 'rem')
		return true
	}
	return false
};
function checkUrlInput(){
	let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
 	let regex = new RegExp(expression);
	if (!destUrlInput.value.match(regex)) {
		addRemClass(destUrlInput, 'wrong', 'blink', 700);
		showAlert('warning', 'Given value is not valid url')
		return false
	}
	return true
};

plusminbtn.forEach((item, i) => {
	item.addEventListener('click', addRem)
});
lenInput.addEventListener('change', checkLenInput)
destUrlInput.addEventListener('change', checkUrlInput)
function addRemClass(ele, className, mode, timeOut=0){
	if(mode == "blink"){
		ele.classList.add(className);
		setTimeout(()=>{ele.classList.remove(className);},timeOut);
	}
	else if(mode == "add"){
		if(!ele.classList.contains(className)){
			ele.classList.add(className);
		}
	}
	else if(mode == "rem"){
		if(ele.classList.contains(className)){
			ele.classList.remove(className);
		}
	}
}
function addRem(e){
	btn = e.currentTarget;
	if(!btn.classList.contains('disabled')){
		btn.classList.add('click')
		setTimeout(()=>{btn.classList.remove('click')}, 300)
		if(lenInput.value == ""){
			lenInput.value = LimitValues[0];
			addRemClass(plusminbtn[0], 'disabled', 'add')
		}
		else{
			setTimeout(checkLenInput, 200);
			if(btn.getAttribute('data-action')=='add'){
				addRemClass(lenInput, 'up', 'blink', 300);
				setTimeout(()=>{
					lenInput.value = parseInt(lenInput.value) + 1
				},150)
			}
			else{
				addRemClass(lenInput, 'down', 'blink', 300);
				setTimeout(()=>{
					lenInput.value = parseInt(lenInput.value) - 1
				},150)
			}
		}
	}
	else checkLenInput();
}

const modal = document.getElementById("modal");
const createUrlForm = document.getElementById("createUrlForm");
createUrlForm.addEventListener("submit", function(event){
	event.preventDefault();
	var request = new XMLHttpRequest();
    var url = "/createNewUrl";
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState === 4){
          if(request.status === 200){
            var ans = JSON.parse(request.response);
            if(ans.error){
              showAlert('error', ans.msg, 4500);
							if(modal.classList.contains('open')) modal.classList.remove('open');
            }
            else{
              showAlert('success' , ans.msg);
            }
          }
          else{
            showAlert('warning', 'Something went wrong, refresh the page and try again');
          }
        }
    }
		if(checkUrlInput() && checkLenInput('final')){
			var data = JSON.stringify({'destUrl': destUrlInput.value, 'urlLength': lenInput.value});
	    request.send(data);
			modal.classList.add('open');
			setTimeout(()=>{setInterval(()=>{calmer.innerHTML = arr[i%arr.length]; i++}, 3000);}, 0);
		}
})

function showAlert(type, msg, dur=2000){
	if(type == 'success'){
		resInput.value = document.location.host + '/' + msg
		resInput.scrollLeft = resInput.scrollWidth
		page.classList.add('show');
	}
	else{
		alert = document.createElement('div');
		alert.classList.add('alert');
		alert.innerHTML = msg;
		alert.addEventListener('click', remEle);
		setTimeout(()=>{remEle(alert)}, dur);
		document.body.appendChild(alert)
		alert.classList.add(type)
	}
}
function remEle(e){
	if(e.target){
		addRemClass(e.currentTarget, "bye", "add")
		setTimeout(()=>{e.target.parentNode.removeChild(e.target);}, 350)
	}
	else{
		e = document.getElementsByClassName('alert')[0];
		if(e){
			addRemClass(e, "bye", "add")
			setTimeout(()=>{e.parentNode.removeChild(e);}, 350)
		}
	}
}
resCp.querySelector('button').addEventListener('click', cpToClip)
function cpToClip(e) {
  addRemClass(e.currentTarget,"click","blink",200)
  resInput.select();
  resInput.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
	showAlert('info', 'Copied! 🤩')
}
let calmer = document.querySelector('p.calmer');
let arr = ['Checking database', 'Generating unique code', 'Getting security rating', 'Saving your link']
let i = 0;
