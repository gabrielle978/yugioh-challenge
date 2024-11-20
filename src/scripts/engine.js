const state ={
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox:document.getElementById("score_points"),
    },
    cardSprites:{
        avatar:document.getElementById("card-image"),
        name:document.getElementById("card-name"),
        type:document.getElementById("card-type")
    },
    fieldCards:{
        player:document.getElementById("player-field-card"),
        computer:document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer:"computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },    
    actions:{
        button:document.getElementById("next-duel"),
    }
};

const path = "./src/assets/icons/";

const cardData = [
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type: "Paper",
        img: `${path}dragon.png`,
        winOf:[1],
        loseOf: [2]
    },
    {
        id:1,
        name:"Dark Magician",
        type: "Rock",
        img: `${path}magician.png`,
        winOf:[2],
        loseOf: [0]
    },
    {
        id:2,
        name:"Exodia",
        type: "Scissors",
        img: `${path}exodia.png`,
        winOf:[1],
        loseOf: [0]
    },
]

//Função para desenhar as cartas no campo
async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}
//Função para ocultar detalhes da carta
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";

}
//Função que define o botão do jogo
async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}
//Função para atualizar o placar
async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score
        .playerScore} | Lose: ${state.score.computerScore}`;

}
//Função para conferir o resultado do duelo
async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "DRAW";
    const playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(ComputerCardId)){
        duelResults = "WIN";
        state.score.playerScore++;
    }
    if(playerCard.loseOf.includes(ComputerCardId)){
        duelResults = "LOSE";
        state.score.computerScore++;
    }
    await playAudio(duelResults);

    return duelResults;
}
//Função para definir as cartas no campo
async function setCardsField(cardId) {
    await removeAllCards();

    let computerCardId = await getRandomCardId();
    await ShowHiddenCardFieldsImage(true);

   // await hiddenCardDetails();

    drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);

}

//Função para mostrar/ocultar cartas
async function ShowHiddenCardFieldsImage(value) {
    if (value == true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if (value == false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

//Função para obter uma card aleatória
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random()* cardData.length);
    return cardData[randomIndex].id;
}

//Função para criar a imagem da carta
async function createCardImage(randomIdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("mouseover", () =>{
            drawSelectCard(randomIdCard);
        });
    }
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    return cardImage;
}
//Função para remover imagens das cartas
async function removeAllCards() {
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());
}

//Função para desenhar o card selecionado no menu
async function drawSelectCard(index) {
    const card = cardData[index];
    state.cardSprites.avatar.src = card.img;
    state.cardSprites.name.innerText = card.name;
    state.cardSprites.type.innerText = "Attribute: " + card.type;
    
}

//Função que distribui as cartas no menu
async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i< cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}
//Função para reiniciar o duelo
async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

// Função reproduzir o àudio do resultado
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    try {
        await audio.play();
    } catch (error){
        console.error("Erro ao reproduzir o áudio", error);
    }
}

//Função inicializadora
function init(){
    ShowHiddenCardFieldsImage(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    document.addEventListener("click", () => {
        const bgm = document.getElementById("bgm");
        if (bgm.paused) {
            bgm.play().catch((error) => {
                console.error("Erro ao tentar reproduzir o áudio:", error);
            });
        }
    });
    
}

//Chamada de função inicializadora
init();