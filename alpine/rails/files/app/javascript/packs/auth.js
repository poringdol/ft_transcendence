class Login {
	renderLogin()
	{
		const container = document.querySelector(".container")
		container.style.display = "none"
		const loginContainer = document.getElementById("login")
		const h1 = document.createElement("h1")
		h1.className = "loginh1"
		h1.innerText = "What is your name?"
		const form = document.createElement("form")
		const input = document.createElement("input")
		input.id = "username"
		input.name = "username"
		form.appendChild(input)
		form.addEventListener("submit", this.submit)
		loginContainer.append(h1, form)
	}
}