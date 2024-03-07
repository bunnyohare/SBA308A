const API_URL = `https://api.thecatapi.com/v1/`;
const API_KEY = "DEMO-API-KEY";

let currentImageToVoteOn;

async function showHistoricVotes() {
    document.getElementById('vote-options').style.display = 'none';
    document.getElementById('vote-results').style.display = 'block';

    const url = `${API_URL}votes?limit=6&order=DESC`;

    try {
        const response = await axios.get(url, { headers: { 'x-api-key': API_KEY } });
        const data = response.data;

        // Determine how many items to display
        const maxItems = Math.min(data.length, 6); 

        for (let i = 0; i < maxItems; i++) {
            const voteData = data[i];
            const imageData = voteData.image;
            let image = document.createElement('img');
            image.src = imageData.url;
            image.style.maxWidth = "300px";
            image.style.width = '80%';

            let gridCell = document.createElement('div');
            if (voteData.value < 0) {
                gridCell.classList.add('down');
            } else {
                gridCell.classList.add('up');
            }
            gridCell.classList.add('col-lg');
            gridCell.appendChild(image);
            document.getElementById('grid').appendChild(gridCell);
        }
    } catch (error) {
        console.log(error);
    }
}


async function showVoteOptions() {
    document.getElementById("grid").innerHTML = '';
    document.getElementById('vote-options').style.display = 'block';
    document.getElementById('vote-results').style.display = 'none';

    await showImageToVoteOn();
}

async function showImageToVoteOn() {
    const url = `${API_URL}images/search`;

    try {
        const response = await axios.get(url, { headers: { 'x-api-key': API_KEY } });
        currentImageToVoteOn = response.data[0];
        document.getElementById("image-to-vote-on").src = currentImageToVoteOn.url;
    } catch (error) {
        console.log(error);
    }
}

async function vote(value) {
    const url = `${API_URL}votes/`;
    const body = {
        image_id: currentImageToVoteOn.id,
        value
    };

    try {
        await axios.post(url, body, {
            headers: {
                'content-type': "application/json",
                'x-api-key': API_KEY
            }
        });
        await showVoteOptions();
    } catch (error) {
        console.log(error);
    }
}
