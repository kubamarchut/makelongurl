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
              showAlert('error', ans.msg);
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
    var destUrl = document.getElementById("destUrl").value;
    var urlLength = document.getElementById("urlLength").value;
    var data = JSON.stringify({'destUrl': destUrl, 'urlLength': urlLength});
    request.send(data);
})

function showAlert(type, msg){
	var destUrl = document.getElementById("destUrl").value;

	modal.innerHTML = `<p>You've successfully created custom link to <b>${destUrl}</b></p><p><a href="http://127.0.0.1/${msg}">127.0.0.1/${msg}</p></a>`
	modal.classList.add('open');
}
