import bot from "assets/bot.svg";
import user from "assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
const textArea = document.querySelector("#textarea");

let loadInterval;

function loader(element) {
	element.textContent = "";

	loadInterval = setInterval(() => {
		// Update the text content of the loading indicator
		element.textContent += ".";

		// If the loading indicator has reached three dots, reset it
		if (element.textContent === "....") {
			element.textContent = "";
		}
	}, 300);
}

function typeText(element, text) {
	let index = 0;

	let interval = setInterval(() => {
		if (index < text.length) {
			element.innerHTML += text.charAt(index);
			index++;
		} else {
			clearInterval(interval);
		}
	}, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
	const timestamp = Date.now();
	const randomNumber = Math.random();
	const hexadecimalString = randomNumber.toString(16);

	return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
	return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

const handleSubmit = async (e) => {
	e.preventDefault();

	const data = textArea.innerText;

	// user's chatstripe
	chatContainer.innerHTML += chatStripe(false, data);

	// to clear the textarea input
	textArea.innerText = "";

	// bot's chatstripe
	const uniqueId = generateUniqueId();
	chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

	// to focus scroll to the bottom
	chatContainer.scrollTop = chatContainer.scrollHeight;

	// specific message div
	const messageDiv = document.getElementById(uniqueId);

	// messageDiv.innerHTML = "..."
	loader(messageDiv);

	const serverURL = window.location.hostname.includes("localhost")
		? "http://localhost:5000"
		: "https://ask-me-anything.onrender.com/";

	const response = await fetch(serverURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			prompt: data,
		}),
	});

	clearInterval(loadInterval);
	messageDiv.innerHTML = " ";

	console.log("RESPPOSNE");
	console.log(response);
	console.log(JSON.stringify(response, null, 4));

	if (response.ok) {
		const data = await response.json();
		const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
		console.log("DATA");
		console.log(data);
		console.log(JSON.stringify(data, null, 4));
		typeText(messageDiv, parsedData);
	} else {
		console.log("else ");
		const err = await response.text();

		messageDiv.innerHTML = "Something went wrong";
		alert(err);
	}
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
	if (e.keyCode === 13) {
		handleSubmit(e);
	}
});
